// src/components/LoginForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./LoginForm.css";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className='login-form'>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="forgot-password">
        <Link to="/resetpassword">Forgotten Password?</Link>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
