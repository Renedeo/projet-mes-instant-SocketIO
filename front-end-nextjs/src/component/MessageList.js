import React from 'react';

const MessageList = ({ messages }) => {
  return (
    <div className="message-list ChatPageContent">
      {messages.map((message) => (
        <div key={message.id} className="message">
          <strong>{message.author.username}:</strong> {message.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
