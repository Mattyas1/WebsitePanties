import React from 'react';
import './Home.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handlePostButton = () => {

    navigate("/postproduct")
  }
  return (
    <div className="home-container">
      <h1>Welcome to My Marketplace</h1>
      <p>Your one-stop shop for all things awesome!</p>
      <button onClick={handlePostButton}>
        Post New Product
      </button>
    </div>
  );
};

export default Home;
