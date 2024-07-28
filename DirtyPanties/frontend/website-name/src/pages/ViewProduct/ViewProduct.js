import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { API_BASE_URL, WSS_URL } from '../../constants';
import './ViewProduct.css'; // Make sure to create this CSS file
import { AuthContext } from '../../context/AuthContext';

const ViewProduct = () => {
  const navigate = useNavigate();
  const {productId} = useParams();
  const [product, setProduct] = useState(null);
  const { isAuthenticated, setUser, user } = useContext(AuthContext);

  const [timeRemaining, setTimeRemaining] = useState('');
  const [userBid, setUserBid] = useState('');
  const [biddingError, setBiddingError] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(`${WSS_URL}`);
  
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'subscribe',
        data: productId  // Fixed the structure of the data being sent
      }));
    };
  
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
  
      if (message.type === 'productSet') {
        console.log("Received : ", message.data)
        setProduct(message.data);
      };
  
      if (message.type === 'productUpdate') {
        console.log("Received : ", message.data)
        setProduct((prevProduct) => ({
          ...prevProduct,
          bid: {
            ...prevProduct.bid,
            amount: message.data.highestBid
          }
        }));
      }
    };
  
    // Cleanup function to close the WebSocket connection when the component is unmounted or productId changes
    return () => {
      socket.close();
    };
  }, [productId]);
  

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

  const handleBidSubmit = () => {
    if (userBid > user.coins) {
      setBiddingError('Not enough coins');
      return;
    }
    if (userBid <= product.bid.amount) {
      setBiddingError('Bid must be higher than the current highest bid');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBid = async () => {
    setIsConfirmModalOpen(false);
    try {     
      const body = {
        productId: productId,
        userBid,
      };
      const headers = {'Content-Type': 'application/json'};

      const response = await axios.post(`${API_BASE_URL}/api/bids/place`, body, { headers });

      if (response.status !== 200) {
        throw new Error(`Server responded with status code ${response.status}`);
      }

      const data = response.data;
      setProduct(data.updatedProduct);
      setUser(data.updatedUser);
      setBiddingError(null);
      setIsSuccessModalOpen(true);
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
        <p className="product-price">Current Highest Bid: {product.bid.amount} 🪙 </p>
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        contentLabel="Confirm Bid"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirm Bid</h2>
        <p>You are about to bid {userBid} coins for this product. Are you sure?</p>
        <div className="modal-buttons">
          <button className='modal-button' onClick={handleConfirmBid}>Confirm</button>
          <button className= 'modal-button cancel' onClick={() => setIsConfirmModalOpen(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={() => setIsSuccessModalOpen(false)}
        contentLabel="Bid Success"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Bid Placed Successfully</h2>
        <p>Your bid has been placed successfully.</p>
        <button onClick={() => setIsSuccessModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default ViewProduct;
