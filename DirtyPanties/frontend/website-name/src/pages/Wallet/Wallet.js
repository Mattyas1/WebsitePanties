import React, { useState } from 'react';
import './Wallet.css'; 
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';
import { STRIPE_PUBLIC_KEY, API_BASE_URL } from '../../constants';
import { useTranslation } from 'react-i18next';


const Wallet = () => {
  const { t } = useTranslation();


  const quickAmounts = [10, 100, 1000];
  const [customAmount, setCustomAmount] = useState('');
  const currency = 'usd';


  const handlePurchase = async (amount) => {
    try {
      const stripe = await loadStripe(`${STRIPE_PUBLIC_KEY}`);

      const body = {
        amount,
        currency,
      };
      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await axios.post(`${API_BASE_URL}/api/wallet/recharge`, body, { headers });
      const data = response.data;
      const result = stripe.redirectToCheckout({
        sessionId: data.id,
      });

      if (result.error) {
        // Display error to the customer
        console.error(result.error.message);
      }

      // Handle the purchase logic here
      console.log(`Recharging wallet with $${amount}`);
    } catch (error) {
      console.error('Error creating Stripe Checkout session:', error);
    }
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
  };

  const handleCustomAmountSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      handlePurchase(amount);
    } else {
      console.error('Invalid amount');
    }
  };

  return (
    <div className="recharge-wallet-container">
      <h1>{t('rechargeWallet')}</h1>
      <p>{t('selectAmount')}</p>
      
      <div className="quick-amounts">
        {quickAmounts.map((amount, index) => (
          <div key={index} className="amount-package">
            <h2>${amount}</h2>
            <button onClick={() => handlePurchase(amount)}>
              {t('addNow')}
            </button>
          </div>
        ))}
      </div>
      
      <div className="custom-amount">
        <h2>{t('customAmount')}</h2>
        <form onSubmit={handleCustomAmountSubmit}>
          <input
            type="number"
            min="1"
            step="0.01"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder={t('enterAmount')}
          />
          <button type="submit">{t('addNow')}</button>
        </form>
      </div>
      
      <div className="refund-section">
        <h2>{t('needRefund')}</h2>
        <Link to="/refund">
          <button>{t('goToRefundPage')}</button>
        </Link>
      </div>
    </div>
  );
};

export default Wallet;
