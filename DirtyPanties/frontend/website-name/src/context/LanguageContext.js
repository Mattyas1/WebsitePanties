import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useTranslation } from 'react-i18next';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(() => {
    // Retrieve the language from localStorage or default to browser language
    return localStorage.getItem('preferredLanguage') || navigator.language.split('-')[0] || 'en';
  });

  // Update language if user settings change
  useEffect(() => {
    if (user && user.settings && user.settings.language) {
      const userLanguage = user.settings.language;
      setLanguage(userLanguage);
      i18n.changeLanguage(userLanguage);
    }
  }, [user, i18n]);

  // Ensure language is initialized on mount
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Update language and save to localStorage
  const updateLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage)
      .then(() => {
        console.log('Language changed to:', newLanguage);
        localStorage.setItem('preferredLanguage', newLanguage);
      })
      .catch(err => {
        console.error('Language change error:', err);
      });
  };

  return (
    <LanguageContext.Provider value={{ language, updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
