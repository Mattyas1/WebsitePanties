// src/components/RegisterForm/RegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import './RegisterForm.css';
import { useTranslation } from 'react-i18next';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    birthDate: '',  // corrected to lowercase 'birthdate'
    email: '',
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/newUser`, formData);
      console.log('Registration success:', response.data);
      alert('Registration successful! Please log in.');
      setIsSubmitting(false);
      navigate('/login')
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        console.error('Error:', error.response.data);
        alert('Registration Failed: ' + error.response.data.message);
      } else {
        console.error('Error:', error.message);
        alert('Registration Failed: An unexpected error occurred.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div>
        <label>{t('birthdate')}:</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>{t('email')}:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>{t('username')}:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>{t('password')}:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('registering') : t('register')}
      </button>
    </form>
  );
};

export default RegisterForm;
