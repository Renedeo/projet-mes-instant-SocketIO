"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/Context/AuthContext';
import { useRouter } from 'next/navigation';
import SendIcon from '@mui/icons-material/Send';
import { useSocket } from '@/Context/SocketContext';

const ChatComponent = () => {
  const { user, connectedUsers, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter()
  const socket  = useSocket()

  useEffect(() => {
    const handleChatMessageResponse = (data) => {
      setMessages([...messages, data]);
      console.log(data)
      console.log(messages)
      setNewMessage('');
    };
    
    socket.on('chat message response', handleChatMessageResponse);
    

    fetchChatMessages();
    
    // Clean up the event listener when the component is unmounted
    return () => {
      socket.off('chat message response', handleChatMessageResponse);
    };
  }, [messages, socket]);
  console.log(connectedUsers)

  const fetchChatMessages = async () => {
    try {
      const response = await fetch('http://localhost:4000/messages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error.message);

    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch('http://localhost:4000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          author: { username: user },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }


      socket.emit('chat message', {
        content: newMessage,
        author: { username: user },
      });

      
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const handleLogout = () => {
    logout();
    socket.emit('logout', {"username": user});
    router.push('/');
  };


  return (
    <div className='ChatPageContainer'>
      <div className='chat-header ChatPageContent '>

        <h2>Welcome to the Chat, {user}!</h2>
        <button className='btn' onClick={handleLogout}>Logout</button>
      </div>

      <div className="chat-container">
        <div className="message-list ChatPageContent">
          {messages.map((message) => (
            <div key={message.id} className="message">
              <strong>{message.author.username}:</strong> {message.content}
            </div>
          ))}
        </div>

        <div className='connected-users ChatPageContent'>
        <h3>Connected Users:</h3>
        <ul>
          {connectedUsers.map((user) => (
            <li key={user}>{user.username}</li>
          ))}
        </ul>
      </div>
            
        <div className="message-input ChatPageContent ">
          <div>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <label htmlFor="username"><span>Type your message ...</span></label>
          </div>

          <button className='btn' onClick={handleSendMessage}>
          <SendIcon />
          </button>
        </div>

      </div>

      {/* <div className="blob"></div> */}
    </div>
  );
};

export default ChatComponent;
