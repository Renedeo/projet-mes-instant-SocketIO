import React from 'react';

const ConnectedUsers = ({ connectedUsers }) => {
  return (
    <div className='connected-users ChatPageContent'>
      <h3>Connected Users:</h3>
      <ul>
        {connectedUsers.map((user) => (
          <li key={user}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectedUsers;
