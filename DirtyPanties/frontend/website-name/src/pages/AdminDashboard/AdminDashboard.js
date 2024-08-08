import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; 
import { useTranslation } from 'react-i18next';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
  <h1>{t('adminDashboard')}</h1>
  <button onClick={() => handleNavigation('/admin/postproduct')}>{t('postProduct')}</button>
  <button onClick={() => handleNavigation('/admin/refundrequests')}>{t('refundRequests')}</button>
  <button onClick={() => handleNavigation('/bids-history')}>{t('bidsHistory')}</button>
  <button onClick={() => handleNavigation('/admin/users')}>{t('userList')}</button>
  <button onClick={() => handleNavigation('/deliveries')}>{t('deliveries')}</button>
  <button onClick={() => handleNavigation('/moderation')}>{t('moderation')}</button>
</div>
  );
};

export default AdminDashboard;
