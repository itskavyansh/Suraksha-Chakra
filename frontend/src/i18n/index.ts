import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import type { Language } from '../types';

const getSavedLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('sc_lang');
    if (saved === 'en' || saved === 'hi') return saved;
  } catch {
    // localStorage unavailable
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
