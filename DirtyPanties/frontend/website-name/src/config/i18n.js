import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) 
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    fallbackLng: 'fr', // Default language if detection fails
    debug: true,  //can be turned on after development
    interpolation: {
      escapeValue: false, // React already escapes variables
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      // Detection settings
      order: ['cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
  });

export default i18n;
