import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/viewproduct/${productId}`);
  };

  return (
    <div className='product-list'>
      {products.map(product => (
        <div
          key={product.id}
          className='product-item'
          onClick={() => handleProductClick(product.id)}
        >
          <img src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
