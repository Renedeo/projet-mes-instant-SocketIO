"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/Context/AuthContext';
import { useRouter } from 'next/navigation';
import SendIcon from '@mui/icons-material/Send';

const ChatComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter()

  useEffect(() => {
    fetchChatMessages();
  }, [isAuthenticated]);

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
          // You may include authentication headers if needed
        },
        body: JSON.stringify({
          content: newMessage,
          author: { username: user },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages([...messages, data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const handleLogout = () => {
    logout();
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
    </div>
  );
};

export default ChatComponent;