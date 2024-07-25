// src/pages/CancelPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cancel.css'; // Import the CSS file

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="cancel-page">
      <div className="cancel-content">
        <h1>Transaction Cancelled</h1>
        <p>It looks like you cancelled the payment process.</p>
        <p>If you need assistance or wish to try again, please use the button below.</p>
        <button className="retry-button" onClick={() => navigate('/')}>Go to Home</button>
        <button className="retry-button" onClick={() => navigate('/buyCoins')}>Try Again</button>
      </div>
    </div>
  );
};

export default Cancel;
