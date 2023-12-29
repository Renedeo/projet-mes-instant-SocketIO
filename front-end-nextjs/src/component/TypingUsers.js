import React from 'react';

const TypingUsers = ({ typingUsers }) => {
  return (
    <div className='typing-users ChatPageContent'>
      <h3>Typing Users:</h3>
      <ul>
        {typingUsers.map((username) => (
          <li key={username}>{username} is typing...</li>
        ))}
      </ul>
    </div>
  );
};

export default TypingUsers;
