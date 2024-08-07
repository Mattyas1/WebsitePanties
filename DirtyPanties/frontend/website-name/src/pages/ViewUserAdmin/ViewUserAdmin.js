import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants';
import './ViewUserAdmin.css';

const ViewUserAdmin = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="view-user-admin">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <h1>User Details</h1>
      {user ? (
        <div className="user-details">
          <div className="user-summary">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Wallet Amount:</strong> ${user.wallet.amount.toFixed(2)}</p>
            <p><strong>Birth Date:</strong> {new Date(user.birthDate).toLocaleDateString()}</p>
          </div>

          <section className="user-history">
            <h2>Bid History</h2>
            {user.bidHistory.length === 0 ? (
              <p>No bid history.</p>
            ) : (
              <ul>
                {user.bidHistory.map((bid, index) => (
                  <li key={index} className="history-item">
                    <p><strong>Product Name:</strong> {bid.productName}</p>
                    <p><strong>Bid Amount:</strong> ${bid.bidAmount.toFixed(2)}</p>
                    <p><strong>Bid Date:</strong> {new Date(bid.bidDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}

            <h2>Win History</h2>
            {user.winHistory.length === 0 ? (
              <p>No win history.</p>
            ) : (
              <ul>
                {user.winHistory.map((win, index) => (
                  <li key={index} className="history-item">
                    <p><strong>Product Name:</strong> {win.productName}</p>
                    <p><strong>Paid Amount:</strong> ${win.paidAmount.toFixed(2)}</p>
                    <p><strong>Win Date:</strong> {new Date(win.winDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="user-notifications">
            <h2>Notifications</h2>
            {user.notifications.length === 0 ? (
              <p>No notifications.</p>
            ) : (
              <ul>
                {user.notifications.map((notification, index) => (
                  <li key={index} className="notification-item">
                    <p><strong>Message:</strong> {notification.message}</p>
                    <p><strong>Date:</strong> {new Date(notification.date).toLocaleDateString()}</p>
                    <p><strong>Read:</strong> {notification.read ? 'Yes' : 'No'}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="user-favorites">
            <h2>Favorite Products</h2>
            {user.favoriteProducts.length === 0 ? (
              <p>No favorite products.</p>
            ) : (
              <ul>
                {user.favoriteProducts.map((fav, index) => (
                  <li key={index} className="favorite-item">
                    <p><strong>Product Name:</strong> {fav.productName}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="user-subscribed-partners">
            <h2>Subscribed Partners</h2>
            {user.subscribedPartners.length === 0 ? (
              <p>No subscribed partners.</p>
            ) : (
              <ul>
                {user.subscribedPartners.map((partner, index) => (
                  <li key={index} className="partner-item">
                    <p><strong>Username:</strong> {partner.username}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default ViewUserAdmin;
