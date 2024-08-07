import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Header.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext'; 
import { useWebSocket } from '../../context/WebSocketContext';
import Cookies from 'js-cookie';

const Header = () => {
  const { isAuthenticated, user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const {socket, ready, registerMessageHandler, unregisterMessageHandler} = useWebSocket();
  
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const bellIconRef = useRef(null);
  const unreadNotifications = useRef(user?.notifications?.filter(notification => !notification.read).length || 0);
  const [unreadCount, setUnreadCount] = useState(unreadNotifications.current);

  const handleClickOutside = (event) => {
    // Check if the click is outside both the dropdown and notifications
    const isClickOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
    const isClickOutsideNotifications = notificationsRef.current && !notificationsRef.current.contains(event.target);
    const isClickOutsideBellIcon = bellIconRef.current && !bellIconRef.current.contains(event.target);

    // If clicking outside of dropdown or notifications, and also outside the bell icon
    if (isClickOutsideDropdown && isClickOutsideNotifications && isClickOutsideBellIcon) {
      setShowDropdown(false);
      setShowNotifications(false);
    } else if (isClickOutsideDropdown && !isClickOutsideNotifications) {
      // If clicking outside the dropdown but inside notifications, only hide the dropdown
      setShowDropdown(false);
    } else if (isClickOutsideNotifications && !isClickOutsideDropdown) {
      // If clicking outside notifications but inside dropdown, only hide the notifications
      setShowNotifications(false);
    }
  };

  const markNotificationsAsRead = () => {
    const updateNotifications = user.notifications.map(notification => 
      notification.read ? notification : {...notification, read:true});
      socket.send(JSON.stringify({
        type: 'notificationsRead',
        data : {
          userId: user._id,
        }
      }));
      setUser(prevUser => ({...prevUser , notifications: updateNotifications}));
      unreadNotifications.current = 0;
      setUnreadCount(0);
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  //WSS
  useEffect(() => {  
    if(ready && socket && isAuthenticated) {

      const handleNotificationUpdate = (data) => {
        console.log("Received Notification:", data);
        user.notifications.push(data)
        setUser(user);
        unreadNotifications.current = unreadNotifications.current + 1;
        setUnreadCount(unreadNotifications.current);
      };

      registerMessageHandler('notificationUpdate', handleNotificationUpdate);

    return () => {
    };
   }
  }, [ unreadNotifications, isAuthenticated, user, setUser, socket, registerMessageHandler, unregisterMessageHandler, ready]);
  //handles
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    // I put !showNotification because the change right above is not yet done at this point
    //the set function needs a rerender to make showNotification be true, so the logic is not 
    //natural here since we markNotificationaAsRead when showNotifications is still false.
    if (!showNotifications && unreadCount>0) {
      markNotificationsAsRead();
    }
  };

  const handleRechargeWallet = () => {
    navigate("/rechargewallet");
  };

  const handleSettings = () => {
    navigate("/settings")
  };

  const handleHistory = () => {
    navigate("/history")
  };

  const handleAdmin = () => {
    navigate("/admindashboard");
  }

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    setUser(null);
    setIsAuthenticated(false);

    navigate("/login");
  };

  return (
    <header>
      <img src={logo} alt="Logo" onClick={() => navigate('/')} />
      <nav>
        <Link className='become-partner-link' to="/becomepartner">Become Partner</Link>
        <Link className='home-link' to="/">Home</Link>
        <Link className='partners-link' to="/partners">Partners</Link>
        {isAuthenticated ? (
          <>
            <div className="notification-icon" onClick={toggleNotifications} ref={bellIconRef}>
              <FontAwesomeIcon icon={faBell} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>
            {showNotifications && (
              <div className="notification-dropdown" ref={notificationsRef}>
                {user.notifications.length > 0 ? (
                  user.notifications.slice().reverse().map((notification, index) => (
                    <div key={index} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                      {notification.message}
                    </div>
                  ))
                ) : (
                  <div className="notification-item">No notifications</div>
                )}
              </div>
            )}
            <div className="dropdown" ref={dropdownRef}>
              <button onClick={toggleDropdown}>My Account</button>
              {showDropdown && (
                <div className="dropdown-content">
                  <button onClick={handleSettings}>Settings</button>
                  <button onClick={handleRechargeWallet}>Recharge Wallet</button>
                  <button onClick={handleHistory}>History</button>
                  {user.role === 'admin' && (
                    <button onClick={handleAdmin}>ADMIN</button>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
              <div className="user-wallet">
                {user?.wallet.amount !== undefined ? `${user.wallet.amount} $` : 'Loading wallet...'}
              </div>
            </div>
          </>
        ) : (
          <Link className= "login-link" to="/login">Log in</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
