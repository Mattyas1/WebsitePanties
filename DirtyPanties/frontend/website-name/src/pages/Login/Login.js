// src/pages/Login.js
import React, { useState, useContext} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import Cookies from 'js-cookie';
import "./Login.css"
import { API_BASE_URL } from '../../constants';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const {setUser, setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogin = async (username, password) => {
    setIsPosting(true)
    try { 
      const response = await axios.post(`${API_BASE_URL}/api/auth`, {username, password});
      const { user, accessToken, refreshToken } = response.data;

      Cookies.set('accessToken', accessToken, { expires: 1 / 24 }); // Expires in 1 hour
      Cookies.set('refreshToken', refreshToken, { expires: 200 }); // Expires in 200 days

      setUser(user);
      setIsAuthenticated(true);
      console.log('Login success:', response.data);
      setIsPosting(false);
      navigate('/')

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
      {!isAuthenticated ? (
        <>
          <LoginForm onLogin={handleLogin} isPosting={isPosting} />
          <p className="register-link">
            Not a user yet? <Link to="/register">Click here to create an account</Link>
          </p>
        </>
      ) : (
        <p>Already Logged In</p>
      )}
    </div>
  );
};

export default Login;
