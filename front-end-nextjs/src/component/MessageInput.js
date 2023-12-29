import {React, useEffect} from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useSocket } from '@/Context/SocketContext';

const MessageInput = ({ user, messages, setMessages, newMessage, setNewMessage, handleKeyDown, handleKeyUp, messageListRef }) => {
  const socket = useSocket()
  
  useEffect(() => {
    const handleChatMessageResponse = (data) => {
      setMessages([...messages, data]);
      setNewMessage('');
      scrollToBottom()
    };

    socket.on('chat message response', handleChatMessageResponse);

    return () => {
      socket.off('chat message response', handleChatMessageResponse);
    };


  }, [messages, socket]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
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

      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  
  return (
    <div className="message-input ChatPageContent ">
      <div>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
