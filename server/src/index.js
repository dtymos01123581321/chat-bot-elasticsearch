import express from 'express';
import httpServer from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Client } from '@elastic/elasticsearch';
    const esClient = new Client({ node: 'http://localhost:9200' });

const app = express();
const activeRooms = new Set();
const roomMessages = [];
let questionForBot = '';

app.use(cors());
const http =  httpServer.createServer(app);

http.listen(3000, () => {
    console.log('listening on *:3000');
});

async function saveQuestion(question, answer) {
    try {
        const result = await esClient.index({
            index: 'questions',
            body: {
                question: question,
                answer: answer,
                timestamp: new Date()

            }
        });
        console.log('Question saved', result);
    } catch (error) {
        console.error('Error saving the question', error);
    }
}

app.get('/', (req, res) => {
    res.send('Hello World!')
});

const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const isQuestion = (message) => message.endsWith('?');

const updateClientsAboutRooms = () => io.emit('availableRooms', Array.from(activeRooms));

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);
    io.emit('new connection', { rooms: Array.from(activeRooms) });

    socket.on('joinRoom', (room) => {
        activeRooms.add(room);
        socket.join(room);
        updateClientsAboutRooms();

        if (roomMessages.length) {
            const messages = roomMessages.filter(f => f.room === room);
            socket.emit('roomHistory', { room, messages });
        }
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        if (!io.sockets.adapter.rooms.get(room)) {
            activeRooms.delete(room);
        }
        updateClientsAboutRooms();
    });

    socket.on('disconnecting', () => {
        socket.rooms.forEach((room) => {
            if (!io.sockets.adapter.rooms.get(room)) {
                activeRooms.delete(room);
            }
        });
        updateClientsAboutRooms();
    });

    socket.on('sendMessage', async (data) => {
        if (isQuestion(data.message)) {
            try {
                const indexExists = await esClient.indices.exists({ index: 'questions' });
                if (!indexExists) {
                    console.log('Index does not exist, creating...');
                    await esClient.indices.create({
                        index: 'questions',
                        body: {
                            settings: {
                                number_of_shards: 1,
                                number_of_replicas: 1
                            },
                            mappings: {
                                properties: {
                                    question: {
                                        type: 'text',
                                        fields: {
                                            keyword: {
                                                type: 'keyword'
                                            }
                                        }
                                    },
                                    answer: {
                                        type: 'text',
                                        analyzer: 'standard',
                                    },
                                    created_at: {
                                        type: 'date',
                                        format: "strict_date_optional_time||epoch_millis"
                                    }
                                }
                            }
                        }
                    });
                }

                const response = await esClient.search({
                    index: 'questions',
                    body: {
                        query: {
                            match: {
                                question: {
                                    query: data.message,
                                    minimum_should_match: "90%"
                                }
                            }
                        }
                    }
                });

                const body = response.body ? response.body : response;

                if (body.hits && body.hits.total.value > 0) {
                    const answer = body.hits.hits[0]._source.answer;
                    const messageObj = {
                        name: 'bot',
                        message: answer,
                        room: data.room,
                        date: new Date().toISOString()
                    };

                    roomMessages.push(data);
                    socket.to(data.room).emit('receiveMessage', data);

                    roomMessages.push(messageObj);
                    io.in(data.room).emit('receiveMessage', messageObj);
                } else {
                    console.log('No hits found for: ', data.message);

                    questionForBot = data.message;

                    roomMessages.push(data);
                    socket.to(data.room).emit('receiveMessage', data);
                }
            } catch (error) {
                console.error('Elasticsearch search error:', error);
            }
        } else {
            if (questionForBot) {
                await saveQuestion(questionForBot, data.message);
                questionForBot = '';
            }
            roomMessages.push(data);
            console.log('Elasticsearch room messages: ', roomMessages);

            socket.to(data.room).emit('receiveMessage', data);
        }
    })
});
