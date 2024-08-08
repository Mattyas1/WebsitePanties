// src/components/LoginForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./LoginForm.css";
import { useTranslation } from 'react-i18next';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className='login-form'>
  <div>
    <label>{t('username')}:</label>
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
  </div>
  <div>
    <label>{t('password')}:</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>
  <div className="forgot-password">
    <Link to="/resetpassword">{t('forgotPassword')}</Link>
  </div>
  <button type="submit">{t('login')}</button>
</form>
  );
};

export default LoginForm;
