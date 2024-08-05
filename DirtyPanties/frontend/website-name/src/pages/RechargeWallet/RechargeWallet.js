import React, { useState } from 'react';
import './RechargeWallet.css'; 
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY, API_BASE_URL } from '../../constants';

const RechargeWallet = () => {
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
      <h1>Recharge Your Wallet</h1>
      <p>Select an amount to add to your wallet.</p>
      <div className="quick-amounts">
        {quickAmounts.map((amount, index) => (
          <div key={index} className="amount-package">
            <h2>${amount}</h2>
            <button onClick={() => handlePurchase(amount)}>Add Now</button>
          </div>
        ))}
      </div>
      <div className="custom-amount">
        <h2>Custom Amount</h2>
        <form onSubmit={handleCustomAmountSubmit}>
          <input
            type="number"
            min="1"
            step="0.01"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder="Enter amount"
          />
          <button type="submit">Add Now</button>
        </form>
      </div>
    </div>
  );
};

export default RechargeWallet;
