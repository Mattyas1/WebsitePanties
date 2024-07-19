import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Header.css'; // Import the CSS file

const Header = () => {
  return (
    <header>
      <img src={logo} alt="Logo" />
      <nav>
        <Link to="/">Home</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
};

export default Header;
