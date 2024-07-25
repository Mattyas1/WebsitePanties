import React from 'react';
import './BuyCoins.css'; 
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY, API_BASE_URL } from '../../constants';

const BuyCoins = () => {
  const coinPackages = [
    { amount: 100, price: 1.99 },
    { amount: 500, price: 8.99 },
    { amount: 1000, price: 15.99 },
  ];
  const currency ='usd'

  const handlePurchase = async (amount, price) => {
    try {
        const stripe = await loadStripe(`${STRIPE_PUBLIC_KEY}`);

        const body = {
            coinAmount: amount,
            price: price,
            currency : currency
        };
        const headers = {
            'Content-Type': 'application/json'
        }
        const response = await axios.post(`${API_BASE_URL}/api/coins/pay`, body, {headers});
        const data = response.data;
        const result = stripe.redirectToCheckout({
            sessionId : data.id
        });
        if (result.error) {
            // Display error to the customer
            console.error(result.error.message);
        }
        // Handle the purchase logic here
        console.log(`Purchasing ${amount} coins for $${price}`);

    } catch (error) {
        console.error('Error creating Stripe Checkout session:', error);
    }
  }

  return (
    <div className="buy-coins-container">
      <h1>Buy Coins</h1>
      <p>Select a package to purchase additional coins for your account.</p>
      <div className="coins-packages">
        {coinPackages.map((pkg, index) => (
          <div key={index} className="coins-package">
            <h2>{pkg.amount} Coins</h2>
            <p>${pkg.price.toFixed(2)}</p>
            <button onClick={() => handlePurchase(pkg.amount, pkg.price)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCoins;
