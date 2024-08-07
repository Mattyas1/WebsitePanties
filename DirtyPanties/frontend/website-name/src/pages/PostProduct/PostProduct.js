import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import './PostProduct.css'; // For styles

const PostProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    category: 'Clothing', // Default value
    price: '',
    description: '',
    auctionDate: '',
    apparitionLink: '',
    model: '',
    warranty: '',
    size: '',
    material: '',
  });
  const [images, setImages] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/partner`);
        setPartners(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingPartners(false);
      }
    };

    fetchPartners();
  }, []);

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

  const handlePartnerChange = (e) => {
    const selectedPartner = partners.find(partner => partner.username === e.target.value);
    setProduct((prevProduct) => ({
      ...prevProduct,
      model: selectedPartner ? { userId: selectedPartner._id, username: selectedPartner.username } : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(product)
    const formData = new FormData();
    for (let key in product) {
      if (key === 'model') {
        formData.append(key, JSON.stringify(product[key]));
      } else {
        formData.append(key, product[key]);
      }
    }
    images.forEach(image => {
      formData.append('images', image);
    });

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
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
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
            {/* Add other categories as needed */}
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
          Partner:
          {loadingPartners ? (
            <p>Loading partners...</p>
          ) : error ? (
            <p>Error loading partners: {error}</p>
          ) : (
            <select name="model" onChange={handlePartnerChange} required>
              <option value="">Select a partner</option>
              {partners.map(partner => (
                <option key={partner._id} value={partner.username}>
                  {partner.username}
                </option>
              ))}
            </select>
          )}
        </label>

        {/* Conditionally render fields based on the selected category */}
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
