import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';
import { API_BASE_URL } from '../../constants';

const ProductList = ({ products }) => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/viewproduct/${product._id}`, { state: { product } });
  };

  return (
    <div className='product-list'>
      {products.map(product => (
        <div
          key={product._id} // Assuming _id is used as a unique identifier
          className='product-item'
          onClick={() => handleProductClick(product)}
        >
          <img src={`${API_BASE_URL}/${product.images[0]}`} alt={product.name} />
          <h2>{product.name}</h2>
          <p>Current bid : {product.bid.amount}  coins</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
