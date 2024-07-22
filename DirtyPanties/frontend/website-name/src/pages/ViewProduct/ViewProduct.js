import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ViewProduct.css';

// Example product data
const products = [
  { id: 1, name: 'Product 1', price: 10, description: 'Description for Product 1', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Product 2', price: 20, description: 'Description for Product 2', image: 'https://via.placeholder.com/150' },
  // Add more products here
];

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching product data based on the id
    const foundProduct = products.find(p => p.id === parseInt(id, 10));
    setProduct(foundProduct);
  }, [id]);

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className='view-product'>
    <button className='back-button' onClick={handleBackClick}>
        Back
      </button>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>Price: ${product.price}</p>
      <p>Description: {product.description}</p>
    </div>
  );
};

export default ViewProduct;
