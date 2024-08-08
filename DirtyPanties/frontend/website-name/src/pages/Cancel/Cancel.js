// src/pages/CancelPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cancel.css'; 
import { useTranslation } from 'react-i18next';


const Cancel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();


  return (
    <div className="cancel-page">
      <div className="cancel-content">
        <h1>{t('transactionCancelled')}</h1>
        <p>{t('paymentCancelled')}</p>
        <p>{t('assistanceMessage')}</p>
        <button className="retry-button" onClick={() => navigate('/')} >{t('goToHome')}</button>
        <button className="retry-button" onClick={() => navigate('/rechargewallet')} >{t('tryAgain')}</button>
      </div>
    </div>

  );
};

export default Cancel;
