import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserList.css';
import { useTranslation } from 'react-i18next';



const UserList = ({ users }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRowClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="user-list">
      <h1>{t('userList')}</h1>
      {users.length === 0 ? (
        <p>{t('noUsersFound')}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t('username')}</th>
              <th>{t('email')}</th>
              <th>{t('walletAmount')}</th>
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
