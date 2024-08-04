import React, { useEffect, useState, useContext } from 'react';
import ProductList from '../../components/ProductList/ProductList';
import "./Home.css";
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const {isAuthenticated, user } = useContext(AuthContext)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        const data = response.data;
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoriteProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/${user._id}/favorites`);
        setFavoriteProducts(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    if(isAuthenticated){
      fetchFavoriteProducts();
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='marketplace-container'>
      <h1>HOME</h1>
      {isAuthenticated && (
        <>
          <h2>Favorite Products</h2>
          {favoriteProducts.length > 0 ? (
            <ProductList products={favoriteProducts} />
          ) : (
            <p>No favorite products found.</p>
          )}
        </>
      )}
      <h2>Most Recent Products</h2>
      <ProductList products={products} />
    </div>
  );
};

export default Home;
