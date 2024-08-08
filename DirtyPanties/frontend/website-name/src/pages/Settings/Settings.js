import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Settings.css';
import { API_BASE_URL } from '../../constants';
import { LanguageContext } from '../../context/LanguageContext'; // Import LanguageContext

const Settings = () => {
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
    emailUpdates: true,
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const { updateLanguage } = useContext(LanguageContext); // Access updateLanguage from LanguageContext

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/settings`);
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching user settings', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = async (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    const updatedSettings = {
      ...settings,
      [name]: newValue,
    };
    setSettings(updatedSettings);

    // Update language in LanguageContext if language setting changes
    if (name === 'language') {
      updateLanguage(newValue);
    }

    try {
      await axios.put(`${API_BASE_URL}/api/user/settings`, updatedSettings);
    } catch (error) {
      console.error(`Error updating ${name} setting`, error);
    }
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleChangeEmail = () => {
    setShowEmailModal(true);
  };

  const closeModal = () => {
    setShowPasswordModal(false);
    setShowEmailModal(false);
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>Language</h2>
        <select
          name="language"
          value={settings.language}
          onChange={handleSettingChange}
          className="settings-select"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div className="settings-section">
        <h2>Preferences</h2>
        <label>
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleSettingChange}
          />
          Receive Notifications
        </label>
        <label>
          <input
            type="checkbox"
            name="emailUpdates"
            checked={settings.emailUpdates}
            onChange={handleSettingChange}
          />
          Receive Email Updates
        </label>
      </div>

      <div className="settings-section">
        <h2>Account</h2>
        <button className="settings-button" onClick={handleChangePassword}>
          Change Password
        </button>
        <button className="settings-button" onClick={handleChangeEmail}>
          Change Email
        </button>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Change Password</h2>
            {/* Password change form goes here */}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {showEmailModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Change Email</h2>
            {/* Email change form goes here */}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
