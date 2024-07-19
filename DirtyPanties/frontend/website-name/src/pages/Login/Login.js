// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import Cookies from 'js-cookie';
import "./Login.css"
import { API_BASE_URL } from '../../constants';
//import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleLogin = async (username, password) => {
    setIsPosting(true)
    try { 
      const response = await axios.post(`${API_BASE_URL}/api/auth`, {username, password});
      const { user, accessToken, refreshToken } = response.data;

      Cookies.set('accessToken', accessToken, { expires: 1 / 24 }); // Expires in 1 hour
      Cookies.set('refreshToken', refreshToken, { expires: 200 }); // Expires in 200 days

      console.log('Login success:', response.data);

      setLoggedInUser(user.username);
      setIsPosting(false);

      //navigate('/main');  to be defined later
    } catch(error) {
      setIsPosting(false);
      if (error.response){
        console.error('Error:', error.response.data);
        alert('Login Failed: ' + error.response.data.message);
      } else {
      console.error('Error:', error.message);
      alert('Login Failed: An unexpected error occurred.');
      } 
    }
  };

  return (
    <div className='login-container'>
      <h1>Login</h1>
      {!loggedInUser ? (
        <>
          <LoginForm onLogin={handleLogin} isPosting= {isPosting}/>
          <p className="register-link">
              Not a user yet? <Link to="/register">Click here to create an account</Link>
          </p>
        </>
      ) : (
        <p>Welcome back, {loggedInUser}! Let's go buy some dirty panties now !!</p>
      )}
    </div>
  );
};

export default Login;
