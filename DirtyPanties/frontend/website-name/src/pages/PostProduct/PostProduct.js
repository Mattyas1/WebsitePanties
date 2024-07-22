// src/pages/PostProduct.js
import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import './PostProduct.css'; // Pour les styles

const PostProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    category: 'Clothing', // Valeur par défaut
    price: '',
    description: '',
    auctionDate: '',
    apparitionLink: '',
    model: '',
    warranty: '',
    size: '',
    material: '',
  });
  const [images,setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    console.log(images);
    e.preventDefault();
    const formData = new FormData();
    for (let key in product) {
      formData.append(key, product[key]);
    }
    images.forEach(image => {
      formData.append('images', image);
    });
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    };
    try {
      await axios.post(`${API_BASE_URL}/api/products/new`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  return (
    <div className="post-product-container">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category:
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="Clothing">Clothing</option>
            <option value="Toy">Toy</option>
            {/* Ajouter d'autres catégories si nécessaire */}
          </select>
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Images:
          <input
            type="file"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
          />
        </label>
        <label>
          Auction Date:
          <input
            type="date"
            name="auctionDate"
            value={product.auctionDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Apparition Link:
          <input
            type="url"
            name="apparitionLink"
            value={product.apparitionLink}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Model:
          <input
            type="text"
            name="model"
            value={product.model}
            onChange={handleChange}
          />
        </label>

        {/* Affichage conditionnel des champs spécifiques */}
        {product.category === 'Toy' && (
          <>
            <label>
              Warranty:
              <input
                type="text"
                name="warranty"
                value={product.warranty}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        {product.category === 'Clothing' && (
          <>
            <label>
              Size:
              <input
                type="text"
                name="size"
                value={product.size}
                onChange={handleChange}
              />
            </label>
            <label>
              Material:
              <input
                type="text"
                name="material"
                value={product.material}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default PostProduct;
