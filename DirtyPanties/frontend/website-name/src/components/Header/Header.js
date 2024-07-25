import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Header.css'; // Import the CSS file
import { AuthContext } from '../../context/AuthContext'; 
import Cookies from 'js-cookie';

const Header = () => {
  const { isAuthenticated, user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest('.dropdown')) return;
    setShowDropdown(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleBuyCoins = () => {
    navigate("/buycoins");
  };

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    setUser(null);
    setIsAuthenticated(false);

    navigate("/login");
  };

  return (
    <header>
      <img src={logo} alt="Logo" />
      <nav>
        <Link to="/">Home</Link>
        <Link to="/marketplace">Marketplace</Link>
        {isAuthenticated ? (
          <div className="dropdown">
            <button onClick={toggleDropdown}>My Account</button>
            {showDropdown && (
              <div className="dropdown-content">
                <Link to="/settings">Settings</Link>
                <button onClick={handleBuyCoins}>Buy Coins</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
            <div className="user-coins">
              {user?.coins !== undefined ? `${user.coins} 🪙` : 'Loading coins...'}
            </div>
          </div>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
