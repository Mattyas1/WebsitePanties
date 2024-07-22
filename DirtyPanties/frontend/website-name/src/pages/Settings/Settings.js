import React, { useState } from 'react';
import './Settings.css'; // Import the CSS file

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: true,
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode(prevMode => !prevMode);
    // You can add logic to save this setting if needed
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    // You can add logic to save this setting if needed
  };

  const handlePreferenceChange = (event) => {
    const { name, checked } = event.target;
    setPreferences(prevPreferences => ({
      ...prevPreferences,
      [name]: checked,
    }));
    // You can add logic to save these settings if needed
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
    <div className={`settings-container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Settings</h1>
      
      <div className="settings-section">
        <h2>Language</h2>
        <select value={language} onChange={handleLanguageChange} className="settings-select">
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          {/* Add more languages as needed */}
        </select>
      </div>

      <div className="settings-section">
        <h2>Preferences</h2>
        <label>
          <input
            type="checkbox"
            name="notifications"
            checked={preferences.notifications}
            onChange={handlePreferenceChange}
          />
          Receive Notifications
        </label>
        <label>
          <input
            type="checkbox"
            name="emailUpdates"
            checked={preferences.emailUpdates}
            onChange={handlePreferenceChange}
          />
          Receive Email Updates
        </label>
      </div>

      <div className="settings-section">
        <h2>Display</h2>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={handleDarkModeToggle}
          />
          Dark Mode
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

      {/* Modals for changing password and email */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Change Password</h2>
            {/* Password change form goes here */}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {showEmailModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
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
