import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants';
import './ViewUserAdmin.css';
import { useTranslation } from 'react-i18next';


const ViewUserAdmin = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();


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
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
      <h1>{t('userDetails')}</h1>
      {user ? (
        <div className="user-details">
          <div className="user-summary">
            <p><strong>{t('username')}:</strong> {user.username}</p>
            <p><strong>{t('email')}:</strong> {user.email}</p>
            <p><strong>{t('walletAmount')}:</strong> ${user.wallet.amount.toFixed(2)}</p>
            <p><strong>{t('birthDate')}:</strong> {new Date(user.birthDate).toLocaleDateString()}</p>
          </div>

          <section className="user-history">
            <h2>{t('bidHistory')}</h2>
            {user.bidHistory.length === 0 ? (
              <p>{t('noBidHistory')}</p>
            ) : (
              <ul>
                {user.bidHistory.map((bid, index) => (
                  <li key={index} className="history-item">
                    <p><strong>{t('productName')}:</strong> {bid.productName}</p>
                    <p><strong>{t('bidAmount')}:</strong> ${bid.bidAmount.toFixed(2)}</p>
                    <p><strong>{t('bidDate')}:</strong> {new Date(bid.bidDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}

            <h2>{t('winHistory')}</h2>
            {user.winHistory.length === 0 ? (
              <p>{t('noWinHistory')}</p>
            ) : (
              <ul>
                {user.winHistory.map((win, index) => (
                  <li key={index} className="history-item">
                    <p><strong>{t('productName')}:</strong> {win.productName}</p>
                    <p><strong>{t('paidAmount')}:</strong> ${win.paidAmount.toFixed(2)}</p>
                    <p><strong>{t('winDate')}:</strong> {new Date(win.winDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="user-notifications">
            <h2>{t('notifications')}</h2>
            {user.notifications.length === 0 ? (
              <p>{t('noNotifications')}</p>
            ) : (
              <ul>
                {user.notifications.map((notification, index) => (
                  <li key={index} className="notification-item">
                    <p><strong>{t('message')}:</strong> {notification.message}</p>
                    <p><strong>{t('date')}:</strong> {new Date(notification.date).toLocaleDateString()}</p>
                    <p><strong>{t('read')}:</strong> {notification.read ? t('yes') : t('no')}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="user-favorites">
            <h2>{t('favoriteProducts')}</h2>
            {user.favoriteProducts.length === 0 ? (
              <p>{t('noFavoriteProducts')}</p>
            ) : (
              <ul>
                {user.favoriteProducts.map((fav, index) => (
                  <li key={index} className="favorite-item">
                    <p><strong>{t('productName')}:</strong> {fav.productName}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="user-subscribed-partners">
            <h2>{t('subscribedPartners')}</h2>
            {user.subscribedPartners.length === 0 ? (
              <p>{t('noSubscribedPartners')}</p>
            ) : (
              <ul>
                {user.subscribedPartners.map((partner, index) => (
                  <li key={index} className="partner-item">
                    <p><strong>{t('username')}:</strong> {partner.username}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : (
        <p>{t('noUserData')}</p>
      )}
    </div>
  );
};

export default ViewUserAdmin;
