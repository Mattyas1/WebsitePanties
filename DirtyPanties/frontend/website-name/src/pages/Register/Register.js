// src/pages/Register.js
import React from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import './Register.css';

const Register = () => {
  return (
    <div className="register-container">
      <h1>Create an Account</h1>
      <RegisterForm />
    </div>
  );
};

export default Register;
