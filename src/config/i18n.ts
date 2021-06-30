import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import Backend from '@polkadot/react-components/i18n/Backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(detector)
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'en',
    debug: false,
    saveMissing: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {},
    ns: ['react-components', 'react-params', 'react-query', 'react-signer'],
  });

export default i18n;
