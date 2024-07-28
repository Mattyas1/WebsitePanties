// src/components/NewPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants';
import axios from 'axios';
import "./NewPassword.css";

const NewPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

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
        <label>New Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Reset Password</button>
      {message && <p className='message-success'>{message}</p>}
      {error && <p className='message-error'>{error}</p>}
    </form>
  );
};

export default NewPassword;
