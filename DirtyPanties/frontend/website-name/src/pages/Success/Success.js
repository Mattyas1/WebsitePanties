import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Success.css';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <h1 className="success-title">Payment Successful!</h1>
      <p className="success-message">
        Thank you for your purchase. Your transaction has been completed successfully. 
        Coins have been added to your wallet.
      </p>
      <button className="success-button" onClick={() => navigate('/')}>
        Go to Homepage
      </button>
    </div>
  );
};

export default Success;
