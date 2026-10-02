import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import api from '../../data/api';
import type { Language } from '../../types';

// Hand-crafted 4-petal pinwheel SVG
const PinwheelIcon: React.FC = () => (
  <svg
    viewBox="0 0 80 80"
    width="80"
    height="80"
    aria-hidden="true"
    className="drop-shadow-lg"
  >
    {/* Black petal - top */}
    <ellipse cx="40" cy="24" rx="9" ry="18" fill="#1A2420" transform="rotate(0 40 40)" />
    {/* Green petal - right */}
    <ellipse cx="56" cy="40" rx="9" ry="18" fill="#0F5C3A" transform="rotate(90 40 40)" />
    {/* Red petal - bottom */}
    <ellipse cx="40" cy="56" rx="9" ry="18" fill="#C62828" transform="rotate(180 40 40)" />
    {/* Blue petal - left */}
    <ellipse cx="24" cy="40" rx="9" ry="18" fill="#1E6FD9" transform="rotate(270 40 40)" />
    {/* White center */}
    <circle cx="40" cy="40" r="8" fill="white" />
  </svg>
);

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setDemoUser, language, setLanguage } = useAppStore();
  const [loading, setLoading] = React.useState(false);

  const handleTryWorker = async () => {
    setLoading(true);
    try {
      const worker = await api.getCurrentWorker();
      setDemoUser(worker);
      navigate('/home');
    } catch {
      // silently fail in demo
    } finally {
      setLoading(false);
    }
  };

  const handleLangToggle = () => {
    const next: Language = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 flex flex-col">
      {/* Language toggle - top right */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleLangToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold transition-colors min-h-[44px] backdrop-blur-sm"
          aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
        >
          {language === 'en' ? 'हिं' : 'EN'}
        </button>
      </div>

      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        {/* Logo area */}
        <div className="flex flex-col items-center mb-10 animate-[fadeInDown_0.6s_ease-out]">
          <div className="mb-5 p-4 rounded-3xl bg-white/10 backdrop-blur-sm shadow-lg">
            <PinwheelIcon />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 text-center">
            {t('app.name')}
          </h1>
          <p className="text-brand-100 text-base font-medium text-center opacity-90">
            {t('app.tagline')}
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-xs flex flex-col gap-4">
          <button
            onClick={handleTryWorker}
            disabled={loading}
            id="btn-try-worker"
            className="w-full min-h-[56px] bg-white text-brand-900 font-bold text-base rounded-xl shadow-lg hover:bg-brand-100 active:scale-95 transition-all duration-150 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
            ) : null}
            {t('landing.try_worker')}
          </button>

          <button
            onClick={() => navigate('/admin')}
            id="btn-view-admin"
            className="w-full min-h-[52px] bg-transparent border-2 border-white/50 text-white font-semibold text-base rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-150"
          >
            {t('landing.view_admin')}
          </button>
        </div>

        {/* Decorative wave divider */}
        <div className="mt-12 w-16 h-1 rounded-full bg-white/30" />
      </div>

      {/* Footer */}
      <footer className="py-4 px-6 text-center">
        <p className="text-white/60 text-xs">{t('app.demo_notice')}</p>
      </footer>
    </div>
  );
};

export default LandingPage;
