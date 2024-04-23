import {css} from 'lit';

export default css`
    .chat-container {
      width: 100%;
      max-width: 600px;
      margin: auto;
      display: flex;
      flex-direction: column;
    }
    
    .chat-input {
      display: flex;
      gap: 8px;
    }
    .chat-input input {
      flex-grow: 1;
      padding: 8px;
    }
    .chat-input button {
      padding: 8px 16px;
    } 
    
    .chat-app {
    display: flex;
    height: 98vh;
  }

  .user-profile {
      display: flex;
      align-items: center;
      background-color: #f3f3f3;
      border-radius: 10px;
      padding: 20px;
      max-width: 300px;
      flex-direction: column;
    }

    .user-image {
      border-radius: 50%;
      width: 100px;
      height: 100px;
      margin-right: 10px;
    }
    
    .user-name {
      font-size: 18px;
      font-weight: bold;
      margin: 20px 0;
      color: #393e56;
    }
  
  .sidebar {
    width: 250px;
    color: white;
    padding: 10px;
  }

  .sidebar-header {
    padding: 20px 0;
    text-align: center;
    border-bottom: 1px solid #34495e;
    color: #393e56;
  }

  .chat-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .chat-list-item {
    padding: 10px 20px;
    cursor: pointer;
    color: #393e56;
    background-color: #f3f3f3;
    border-radius: 10px;
    margin-bottom: 5px;
  }

  .chat-list-item:hover {
    background: #d0d3e3;
  }

  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #edf0f5;
    border-radius: 30px;
  }

  .chat-header {
    padding: 20px;
    background: #ecf0f1;
    border-bottom: 1px solid #bdc3c7;
    position: absolute;
    width: -webkit-fill-available;
    top: 0px;
    border-radius: 20px;
  }

  .chat-title {
    margin: 0;
  }

  .chat-messages {
    margin-top: 70px;
    flex: 1;
    max-height: calc(88vh - 60px);
    overflow-y: auto;
    padding: 10px;
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }
  
  .right-message {
    width: -moz-fit-content;
    max-width: 80%;
    min-width: 20%;
    color: white;
    margin-left: auto;
    display: flex;
    
    .message {
      background-color: #66ac5a!important;
      color: #fff;
    }
  }
  
  .right-message .message-content {
    margin-right: 0;
    margin-left: auto;
  }

  .message-container {
    display: flex;
    position: relative;
  }

  .message-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    margin-right: 8px;
    position: absolute;
    bottom: 20px;
  }

  .message-content {
    padding: 10px;
    border-radius: 10px;
    margin-right: auto;
    max-width: 80%;
    min-width: 20%;
    color: #3b445e;
    margin-left: 40px;
  }

  .right-message .message-content {
    margin-right: 0;
    margin-left: auto;
  }
  
  .message-sender {
    color: #3b445e;
  }

  .message-content .message {
     background: #f0f0f0;
  }

  .message-header {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    font-weight: bold;
    color: #3b445e;
    align-items: center;  
    margin-bottom: 5px;         
  }

  .message-sender {
    margin-right: 8px;
  }

  .message-time {
    font-size: 0.8em;
  }
  
  .message {
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 15px;
    border: 1px solid white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .form-name {
    display: flex;
    bottom: 12px;
    width: 220px;
    
    input {
        flex: 1 1 0%;
        padding: 10px;
        margin-right: 10px;
        border: none;
        border-radius: 5px;
        width: 70%;
    }
    
    button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background: rgb(52, 152, 219);
        color: white;
        cursor: pointer;
        width: 35%;
    }
  }
    
  .room-form {
    display: flex;
    position: absolute;
    bottom: 50px;
    width: 250px;
    
    input {
        flex: 1 1 0%;
        padding: 10px;
        margin-right: 10px;
        border: none;
        border-radius: 5px;
        width: 70%;
        background-color: #f0f3f6;
    }
    
    button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background: rgb(52, 152, 219);
        color: white;
        cursor: pointer;
        width: 42%;
    }
  }
  
  .message-form {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    position: absolute;
    bottom: 30px;
    left: 60%;
    transform: translateX(-60%);
    min-width: 50%;
    max-width: 70%;
    height: 40px;
    background: #fff;
    border-radius: 20px;
  }

  .message-form input {
    flex: 1;
    padding: 10px;
    margin-right: 10px;
    border: none;
    border-radius: 5px;
    width: 80%
  }

  .message-form button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background: #3498db;
    color: white;
    cursor: pointer;
  }

  .message-form button:hover {
    background: #2980b9;
  }`;
