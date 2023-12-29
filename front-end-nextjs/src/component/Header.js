import React from 'react';
import { useAuth } from '@/Context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Additional logic for handling logout
  };

  return (
    <div className='chat-header ChatPageContent'>
      <h2>Welcome to the Chat, {user}!</h2>
      <button className='btn' onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Header;
