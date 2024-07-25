import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Success.css';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(location.search).get('session_id');

  return (
    <div className="success-container">
      <h1 className="success-title">Payment Successful!</h1>
      <p className="success-message">
        Thank you for your purchase. Your transaction has been completed successfully.
      </p>
      <p className="success-details">
        Session ID: <span className="session-id">{sessionId}</span>
      </p>
      <button className="success-button" onClick={() => navigate('/')}>
        Go to Homepage
      </button>
      <button className="success-button" onClick={() => navigate('/marketplace')}>
        Go to Marketplace
      </button>
    </div>
  );
};

export default Success;
