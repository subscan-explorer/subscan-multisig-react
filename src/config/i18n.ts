import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(detector)
  .use(backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'en',
    debug: false,
    saveMissing: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {
      addPath: '/locales/commit/{{lng}}', // TODO: update path;
    },
  });

export default i18n;
