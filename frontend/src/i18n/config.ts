import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';

const STORAGE_KEY = 'sc_lang';

export const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'hi' || saved === 'en') {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  return 'en';
};

export const setSavedLanguage = (lang: 'en' | 'hi'): void => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore storage errors
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

const initialLang = getSavedLanguage();
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  if (lng === 'en' || lng === 'hi') {
    setSavedLanguage(lng);
  }
});

export default i18n;
