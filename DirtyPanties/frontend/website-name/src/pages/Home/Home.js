import React, { useEffect, useState } from 'react';
import ProductList from '../../components/ProductList/ProductList';
import "./Home.css";
import axios from 'axios';
import { API_BASE_URL } from '../../constants';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='marketplace-container'>
      <h1>HOME</h1>
      <ProductList products={products} />
    </div>
  );
};

export default Home;
