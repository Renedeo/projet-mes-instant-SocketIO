import React from 'react';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({ newMessage, handleNewMessage, handleKeyDown, handleKeyUp, handleSendMessage }) => {
  return (
    <div className="message-input ChatPageContent ">
      <div>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => handleNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />
        <label htmlFor="username"><span>Type your message ...</span></label>
      </div>

      <button className='btn' onClick={handleSendMessage}>
        <SendIcon />
      </button>
    </div>
  );
};

export default MessageInput;
