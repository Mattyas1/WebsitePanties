import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import './ViewProduct.css'; // Make sure to create this CSS file
import { AuthContext } from '../../context/AuthContext';

const ViewProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product);
  const { isAuthenticated, setUser, user } = useContext(AuthContext);

  const [timeRemaining, setTimeRemaining] = useState('');
  const [userBid, setUserBid] = useState('');
  const [biddingError, setBiddingError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/${product._id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (!product?._id) return;

    fetchProduct(); // Initial call to get the product information

    const intervalId = setInterval(() => {
      fetchProduct();
    }, 5000); // Refresh every 5 seconds (5000 ms)

    return () => clearInterval(intervalId);
  }, [product?._id]);

  // Calculate time remaining
  useEffect(() => {
    if (!product || !product.auctionDate) return;
    const auctionEndDate = new Date(product.auctionDate);
    if (isNaN(auctionEndDate.getTime())) {
      console.error('Invalid auction date:', product.auctionDate);
      return;
    }
    const updateTimer = () => {
      const now = new Date();
      const timeDiff = auctionEndDate - now;
      if (timeDiff <= 0) {
        setTimeRemaining('Auction ended');
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [product]);

  const handleBidChange = (e) => {
    const value = e?.target?.value || ''; 
    setUserBid(value);
  };

  const handleBidSubmit = async () => {
    if (userBid > user.coins) {
      setBiddingError('Not enough coins');
      return;
    };
    if (userBid <= product.bid.amount) {
      setBiddingError('Bid must be higher than the current highest bid');
      return;
    };
    try {     
      const body = {
        productId: product._id,
        userBid,
      };
      const headers = {'Content-Type': 'application/json'};

      const response = await axios.post(`${API_BASE_URL}/api/bids/place`, body, { headers });

      if (response.status !== 200) {
        throw new Error(`Server responded with status code ${response.status}`);
      };

      const data = response.data;
      setProduct(data.updatedProduct);
      setUser(data.updatedUser);
      setBiddingError(null);
    } catch (error) {
      setBiddingError('Error submitting bid');
    }
  };

  if (!product) {
    return <div>No product data found.</div>;
  }

  return (
    <div className="view-product-container">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <div className="product-image">
        <img src={`${API_BASE_URL}/${product.images[0]}`} alt={product.name} />
      </div>
      <div className="product-details">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">Current Highest Bid: {product.bid.amount} 🪙</p>
        <p className="product-description">Description: {product.description}</p>
        <p className="product-category">Category: {product.category}</p>
        <p className="auction-timer">Time remaining: {timeRemaining}</p>

        <div className="bid-section">
          {isAuthenticated ? (
            <>
              <input
                type="number"
                value={userBid}
                onChange={handleBidChange}
                placeholder="Place your bid"
              />
              <button onClick={handleBidSubmit}>Submit Bid</button>
              {biddingError && <p className="error-message">{biddingError}</p>}
            </>
          ) : (
            <button onClick={() => navigate('/login')}>Login to place a bid</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
