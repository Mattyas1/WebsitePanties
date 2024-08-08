import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Success.css';
import { useTranslation } from 'react-i18next';


const Success = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();


  return (
    <div className="success-container">
      <h1 className="success-title">{t('paymentSuccessful')}</h1>
      <p className="success-message">
        {t('paymentSuccessMessage')}
      </p>
      <button className="success-button" onClick={() => navigate('/')}>
        {t('goToHomepage')}
      </button>
    </div>

  );
};

export default Success;
