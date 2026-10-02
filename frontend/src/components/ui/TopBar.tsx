import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { ChevronLeft, Globe } from 'lucide-react';
import type { Language } from '../../types';

const TopBar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useAppStore();

  const isHome = location.pathname === '/home';

  const handleLangToggle = () => {
    const next: Language = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-900 text-white shadow-md">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: back button or spacer */}
        {!isHome ? (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        ) : (
          <div className="w-10" aria-hidden="true" />
        )}

        {/* Center: app name */}
        <h1 className="text-base font-bold tracking-wide">
          {t('app.name')}
        </h1>

        {/* Right: language toggle */}
        <button
          onClick={handleLangToggle}
          className="flex items-center gap-1.5 px-3 h-10 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold"
          aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span>{language === 'en' ? 'हिं' : 'EN'}</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
