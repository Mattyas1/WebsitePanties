// src/components/ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';
import { API_BASE_URL } from '../../constants';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/resetPassword`, { email });
      if (response.status === 200) {
        setMessage('Password reset link sent successfully. Please check your email.');
        setError(''); // Clear any previous errors
      }
    } catch (error) {
      setMessage('');
      setError('Error sending password reset link. Please try again.');
    }
  };

  return (
    <form onSubmit={handleReset} className='reset-password-form'>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Send Reset Link</button>
      {message && <p className='message-success'>{message}</p>}
      {error && <p className='message-error'>{error}</p>}
    </form>
  );
};

export default ResetPassword;
