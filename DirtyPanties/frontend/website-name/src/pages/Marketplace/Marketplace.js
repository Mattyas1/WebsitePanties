// src/pages/Marketplace.js
import React from 'react';
import ProductList from '../../components/ProductList/ProductList';
import "./Marketplace.css"

const products = [
  { id: 1, name: 'Product 1', price: 10, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Product 2', price: 20, image: 'https://via.placeholder.com/150' },
  // Add more products here
];

const Marketplace = () => {
  return (
    <div className='marketplace-container'>
      <h1>Marketplace</h1>
      <ProductList products={products} />
    </div>
  );
};

export default Marketplace;
