import React, { useEffect, useState, useContext } from 'react';
import ProductList from '../../components/ProductList/ProductList';
import PartnerList from '../../components/PartnerList/PartnerList'; // Ensure correct path
import './Home.css';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Home = () => { 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [subscribedPartners, setSubscribedPartners] = useState([]);
  const { isAuthenticated, user } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        const data = response.data;
        setProducts(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchFavoriteProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/${user._id}/favorites`);
        setFavoriteProducts(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchSubscribedPartners = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/${user._id}/subscriptions`);
        setSubscribedPartners(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProducts();
    if (isAuthenticated) {
      fetchFavoriteProducts();
      fetchSubscribedPartners();
      setLoading(false)
    } else {
      setLoading(false); // Set loading to false if not authenticated
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='home-container'>
      <h1>{t('home')}</h1>
      {isAuthenticated && (
        <>
          <h2>{t('subscribedPartners')}</h2>
          {subscribedPartners.length > 0 ? (
            <PartnerList partners={subscribedPartners} />
          ) : (
            <p>{t('noSubscribedPartners')}</p>
          )}
          <h2>{t('favoriteProducts')}</h2>
          {favoriteProducts.length > 0 ? (
            <ProductList products={favoriteProducts} />
          ) : (
            <p>{t('noFavoriteProducts')}</p>
          )}
        </>
      )}
      <h2>{t('mostRecentProducts')}</h2>
      <ProductList products={products} />
    </div>
  );
};

export default Home;
