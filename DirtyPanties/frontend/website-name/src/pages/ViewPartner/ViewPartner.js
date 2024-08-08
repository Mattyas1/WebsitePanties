import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../constants';
import ProductList from '../../components/ProductList/ProductList'; // Ensure correct path
import './ViewPartner.css';
import { useTranslation } from 'react-i18next';


const ViewPartner = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const {isAuthenticated, user, setUser} = useContext(AuthContext);
  const { t } = useTranslation();


  useEffect(() => {
    const fetchPartnerAndProducts = async () => {
      try {
        // Fetch partner details along with populated selling products
        const response = await axios.get(`${API_BASE_URL}/api/partner/${partnerId}`);
        setPartner(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerAndProducts();
  }, [partnerId]);

  const handleSubscribeClick = async () => {
        try {
            if (isAuthenticated){
                const userId = user._id;
                const response = await axios.post(`${API_BASE_URL}/api/user/${userId}/subscribe`, { partnerId });
                const updatedSubscribedPartners = response.data.subscribedPartners;
                setUser((prevUser) => ({
                    ...prevUser,
                    subscribedPartners: updatedSubscribedPartners
                }));
                setSubscriptionError(null);
                if(isSubscribed){
                    console.log("Unsubscribed successfully :", response.data);
                } else {
                    console.log("Subscribed successfully :", response.data);
                }
            } else {
                setSubscriptionError("You need to be logged in to subscribe")
            }
        } catch (error) {
        console.error('Error subscribing:', error);
        setSubscriptionError('Error subscribing to partner. Please try again.');
        }
  };

  const isSubscribed = user?.subscribedPartners?.some((fav) => fav.userId === partnerId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!partner) {
    return <div>No partner found</div>;
  }

  return (
    <div className='view-partner'>
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
      <h1>{partner.username}</h1>
      {isSubscribed ? (
        <button className="subscribe-button" onClick={handleSubscribeClick}>{t('unsubscribe')}</button>
      ) : (
        <button className="subscribe-button" onClick={handleSubscribeClick}>{t('subscribe')}</button>
      )}
      {subscriptionError && <p className="error-message">{subscriptionError}</p>}
      <h2>{t('productsOnSale')}</h2>
      {partner.sellingProducts && partner.sellingProducts.length > 0 ? (
        <ProductList products={partner.sellingProducts.map(sp => sp.productId)} />
      ) : (
        <p>{t('noProductsAvailable')}</p>
      )}
    </div>
  );
};

export default ViewPartner;
