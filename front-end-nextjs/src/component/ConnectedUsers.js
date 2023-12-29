import React from 'react';

const ConnectedUsers = ({ connectedUsers }) => {
  const usersPerColumn = 5; // Adjust the number of users per column

  const columns = [];
  for (let i = 0; i < connectedUsers.length; i += usersPerColumn) {
    const columnUsers = connectedUsers.slice(i, i + usersPerColumn);
    columns.push(
      <ul key={i} className="user-column">
        {columnUsers.map((user) => (
          <li key={user}>{user.username}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className='connected-users ChatPageContent'>
      <h3>Connected Users:</h3>
      <div className="user-columns">{columns}</div>
    </div>
  );
};

export default ConnectedUsers;
