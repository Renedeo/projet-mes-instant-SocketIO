import React, { useRef, useEffect } from 'react';

const MessageList = ({ messages, setMessages, currentUser, messageListRef }) => {
  useEffect(() => {
    fetchChatMessages();
  }, []);

  const fetchChatMessages = async () => {
    try {
      const response = await fetch('http://localhost:4000/messages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  };
  
  return (
    <div className="message-list ChatPageContent" ref={messageListRef}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.author.username === currentUser ? 'own-message' : 'other-message'}`}
        >
          <div className="message-content">
            <strong>{message.author.username}</strong>
            <p className={`message-content ${message.author.username === currentUser ? 'own' : 'other'}`}>{message.content}</p>
          </div>
          <div className={`message-date ${message.author.username === currentUser ? 'own-date' : 'other-date'}`}>{formatDate(message.createdAt)}</div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
