// src/components/NewPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants';
import axios from 'axios';
import "./NewPassword.css";
import { useTranslation } from 'react-i18next';


const NewPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();


  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/resetPassword/${token}`, { password });
      if (response.status === 200) {
        navigate('/login')
        setMessage('Password has been reset successfully.');
        setError(''); // Clear any previous errors
      }
    } catch (error) {
      setMessage('');
      setError('Error resetting password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleReset} className='reset-password-form'>
      <div>
        <label>{t('newPassword')}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">{t('resetPassword')}</button>
      {message && <p className='message-success'>{t('messageSuccess')}</p>}
      {error && <p className='message-error'>{t('messageError')}</p>}
    </form>
  );
};

export default NewPassword;
