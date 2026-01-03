import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { Translations } from './translations';

// Build resources object from translations
const resources = Translations.reduce((obj, curr) => {
  obj[curr.id] = curr;
  return obj;
}, {});

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    lng: 'en-US', // Force English as default
    fallbackLng: 'en-US',
    resources,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
