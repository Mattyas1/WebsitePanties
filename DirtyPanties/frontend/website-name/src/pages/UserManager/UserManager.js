import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import UserList from '../../components/UserList/UserList';
import { useTranslation } from 'react-i18next';


const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.status === 200) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="user-manager">
        <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
      <UserList users={users} />
    </div>
  );
};

export default UserManager;
