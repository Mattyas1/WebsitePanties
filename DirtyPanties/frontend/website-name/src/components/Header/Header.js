import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Header.css'; // Import the CSS file
import { AuthContext } from '../../context/AuthContext'; 

const Header = () => {
  const {isAuthenticated} = useContext(AuthContext);
  return (
    <header>
      <img src={logo} alt="Logo" />
      <nav>
        <Link to="/">Home</Link>
        <Link to="/marketplace">Marketplace</Link>
        {isAuthenticated ? (
          <Link to="/myaccount">My Account</Link>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
