import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserList.css';

const UserList = ({ users }) => {
  const navigate = useNavigate();

  const handleRowClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="user-list">
      <h1>User List</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Wallet Amount</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} onClick={() => handleRowClick(user._id)} style={{ cursor: 'pointer' }}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>${user.wallet.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
