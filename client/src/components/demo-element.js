import {LitElement, html} from 'lit';
import style from './demo-element.css.js';
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

/**
 * An example element.
 */
export class DemoElement extends LitElement {
  static get properties() { // Оголошення властивостей компонента для реактивного оновлення UI.
    return {
      /**
       * The name to say "Hello" to.
       * @type {string}
       */
      name: {type: String},

      /**
       * The number of times the button has been clicked.
       * @type {number}
       */
      count: {type: Number},

      socket: { type: Object },

      /**
       * The array of message objects.
       * @type {{name: string, message: string, room: string, date: string}[]}
       */
      messages: { type: Array },
      currentMessage: { type: String },
      room: { type: String },
      currentRoom: { type: String },
      currentName: { type: String },
      rooms: { type: Array }
    };
  }

  constructor() {
    super();
    this.messages = [];
    this.currentMessage = '';
    this.currentRoom = '';
    this.currentName = '';
    this.room = '';
    this.rooms = [];
    this.name = '';
    this.count = 0;
    this.socket = io('http://localhost:3000', {
      extraHeaders: {
        "Access-Control-Allow-Origin": "*"
    }});
    this.socket.on('new connection', (data) => {
      console.log('new connection');
      if (data.rooms.length) {
        this.rooms = data.rooms;
      }
    });
  }

  static styles = [style];

  updateMessage(e) {
    this.currentMessage = e.target.value;
  }

  updateRoom(e) {
    this.room = e.target.value;
  }

  updateName(e) {
    this.name = e.target.value;
  }

  updateCurrentName() {
    this.currentName = this.name;
  }

  sendMessage() {
    if (this.currentMessage.trim()) {
      const messageObj = {
        name: this.name,
        message: this.currentMessage,
        room: this.room,
        date: new Date().toISOString()
      };
      this.messages = [...this.messages, messageObj];
      this.socket.emit('sendMessage', messageObj);

      this.currentMessage = '';

      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    const chatMessages = this.shadowRoot.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  joinRoom(room) {
    if(!room) return;

    this.currentRoom = room;
    this.room = room;
    this.messages = [];
    if (room.trim() !== '') {
      this.socket.emit('joinRoom', room);

      this.socket.once('roomHistory', ({ room: roomHistory, messages }) => {
        if (room === roomHistory) {
          this.messages = messages;
          this.requestUpdate();
        }
      });

      if (!this.rooms.includes(room)) {
        this.rooms = [...this.rooms, room];
      }

     this.scrollToBottom();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('socket')) {
      this.socket.on('receiveMessage', (data) => {
        this.messages = [...this.messages, data];
      });

      this.socket.on('availableRooms', (rooms) => {
        this.rooms = rooms;
      });

      this.socket.on('roomHistory', ({ room, messages }) => {
        if (this.room === room) {
          this.messages = messages;
          this.requestUpdate();
        }
      });

    }

    if (changedProperties.has('messages')) {
      this.scrollToBottom();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.socket) {
      this.socket.off('message');
    }
  }

  getIconPathForUser(userName) {
    switch (userName) {
      case 'bot':
        return '../../images/bot.png';
      default:
        return '../../images/user1.png';
    }
  }

  formatTimestamp(isoString) {
    const date = new Date(isoString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = date.toLocaleTimeString('en-US', options);
    return timeString.replace(/^0+/, '');
  }

  render() {
    const {room, rooms, messages, currentMessage, currentRoom, name, currentName} = this;
    return html`
      <div class="chat-app">
        <aside class="sidebar">
          <div class="user-profile">
            <img class="user-image" src=${this.getIconPathForUser('user')} alt="User Image" />
            <div class="user-name">${currentName ? currentName : 'Enter your name'}</div>
            
           ${!currentName ? html`
            <div class="form-name">
              <input type="text" .value=${name} @input=${this.updateName} placeholder="Write your name" />
              <button @click=${this.updateCurrentName} ?disabled=${!name}>Add</button>
            </div>
            ` : ''}            
          </div>
          <div class="user-rooms">
            <h2 class="sidebar-header">Rooms</h2>
            <ul class="chat-list">
              ${rooms.map(room => html`
                <li class="chat-list-item" @click=${() => this.joinRoom(room)}>
                  ${room}
                </li>
              `)}
            </ul>
            <div class="room-form">
              <input type="text" .value=${room} @input=${this.updateRoom} placeholder="Add the new Room" />
              <button @click=${() => this.joinRoom(room)} ?disabled=${!room}>Join Room</button>
            </div>
          </div>
        </aside>
        <main class="chat-main">
          <header class="chat-header">
            <h2 class="chat-title">${`Room: ${currentRoom}` || 'Select a chat'}</h2>
          </header>
          <div class="chat-messages">
            ${messages.map(message => html`
              <div class="message-container ${message.name === this.currentName ? 'right-message' : ''}">
                ${message.name === this.currentName 
                    ?  '' : html`<div class="message-icon" style="background-image: url(${this.getIconPathForUser(message.name)})"></div>`}
                <div class="message-content">
                  <div class="message-header">
                    <span class="message-sender">${message.name !== this.currentName ? message.name : 'You'},</span>
                    <span class="message-time">${this.formatTimestamp(message.date)}</span>
                  </div>
                  <div class="message">${message.message}</div>
                </div>
              </div>
            `)}
          </div>
          <div class="message-form">
            <input type="text" .value=${currentMessage} @input=${this.updateMessage} placeholder="Write your message..." />
            <button @click=${this.sendMessage} ?disabled=${!(currentMessage && currentRoom)}>Send</button>
          </div>
        </main>
      </div>
    `;
  }
}

window.customElements.define('demo-element', DemoElement);
