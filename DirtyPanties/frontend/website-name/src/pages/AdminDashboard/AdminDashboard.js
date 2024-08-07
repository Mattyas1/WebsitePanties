import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Import the CSS file

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <button onClick={() => handleNavigation('/admin/postproduct')}>POST Product</button>
      <button onClick={() => handleNavigation('/admin/refundrequests')}>Refund Requests</button>
      <button onClick={() => handleNavigation('/bids-history')}>Bids History</button>
      <button onClick={() => handleNavigation('/admin/users')}>User Lists</button>
      <button onClick={() => handleNavigation('/deliveries')}>Deliveries</button>
      <button onClick={() => handleNavigation('/moderation')}>Moderation</button>
    </div>
  );
};

export default AdminDashboard;
