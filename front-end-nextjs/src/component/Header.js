import React from 'react';
import { useAuth } from '@/Context/AuthContext';
import { useSocket } from '@/Context/SocketContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, logout } = useAuth();
  const socket  = useSocket()
  const router = useRouter()

  const handleLogout = () => {
    logout();
    socket.emit('logout', { "username": user });
    router.push('/');
  };

  return (
    <div className='chat-header ChatPageContent'>
      <h2>Welcome to the Chat, {user}!</h2>
      <button className='btn' onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Header;
