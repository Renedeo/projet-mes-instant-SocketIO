"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/Context/AuthContext';
import { useRouter } from 'next/navigation';
import SendIcon from '@mui/icons-material/Send';
import { useSocket } from '@/Context/SocketContext';
import ConnectedUsers from '@/component/ConnectedUsers';
import Header from '@/component/Header';
import MessageInput from '@/component/MessageInput';
import MessageList from '@/component/MessageList';
import TypingUsers from '@/component/TypingUsers';


const ChatComponent = () => {
  const { user, connectedUsers, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [typing, setTyping] = useState(false);
  const router = useRouter()
  const socket = useSocket()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // User pressed Enter, handle sending the message
      handleSendMessage();
    } else {
      // User pressed another key, indicate typing
      setTyping(true);

      // Emit 'typing' event to the server
      socket.emit('typing', { username: user, isTyping: true });
    }
  };

  const handleKeyUp = () => {
    // User released a key, indicate not typing
    setTyping(false);

    // Emit 'typing' event to the server
    socket.emit('typing', { username: user, isTyping: false });
  };

  useEffect(() => {
    const handleChatMessageResponse = (data) => {
      setMessages([...messages, data]);
      setNewMessage('');
    };

    const handleTyping = ({ username, isTyping }) => {
      setTypingUsers((prevTypingUsers) => {
        if (isTyping) {
          // Add the username only if it's not already in the array
          if (!prevTypingUsers.includes(username)) {
            return [...prevTypingUsers, username];
          }
        } else {
          // Remove the username from the array
          return prevTypingUsers.filter((user) => user !== username);
        }

        // Return the previous array if no changes were made
        return prevTypingUsers;
      })
    };

    socket.on('typing', handleTyping);

    socket.on('chat message response', handleChatMessageResponse);

    fetchChatMessages();

    // Clean up the event listener when the component is unmounted
    return () => {
      socket.off('chat message response', handleChatMessageResponse);
      socket.off('typing', handleTyping);
    };
  }, [messages, socket]);

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
    socket.emit('logout', { "username": user });
    router.push('/');
  };


  return (
    <div className='ChatPageContainer'>
      <Header />
      <div className="chat-container">
        <MessageList messages={messages} />

        <div className='user-container'>
          <ConnectedUsers connectedUsers={connectedUsers} />
          <TypingUsers typingUsers={typingUsers} />
        </div>

        <MessageInput
          newMessage={newMessage}
          handleNewMessage={setNewMessage}
          handleKeyDown={handleKeyDown}
          handleKeyUp={handleKeyUp}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatComponent;
