import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants';
import './ViewProduct.css'; // Make sure to create this CSS file

const ViewProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

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
        <p className="product-price">Price: ${product.price}</p>
        <p className="product-description">Description: {product.description}</p>
        <p className="product-category">Category: {product.category}</p>
        {/* Add more product details as needed */}
      </div>
    </div>
  );
};

export default ViewProduct;
