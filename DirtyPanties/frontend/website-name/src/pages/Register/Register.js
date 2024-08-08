// src/pages/Register.js
import React from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import './Register.css';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();

  return (
    <div className="register-container">
      <h1>{t('createAccount')}</h1>
      <RegisterForm />
    </div>
  );
};

export default Register;
