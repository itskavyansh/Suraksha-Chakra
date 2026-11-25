import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'hi' ? 'hi' : 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-2.5 py-1 text-xs font-semibold rounded-lg bg-ink-100 hover:bg-ink-100/80 text-ink-900 border border-ink-100 transition-colors"
      aria-label="Toggle language English or Hindi"
      title="Toggle language English / Hindi"
    >
      <span className={currentLang === 'en' ? 'text-brand-700 font-bold' : 'text-ink-500'}>
        EN
      </span>
      <span className="mx-1 text-ink-500">|</span>
      <span className={currentLang === 'hi' ? 'text-brand-700 font-bold' : 'text-ink-500'}>
        हिं
      </span>
    </button>
  );
};
