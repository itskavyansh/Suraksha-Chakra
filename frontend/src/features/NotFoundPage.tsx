import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <p className="text-8xl font-extrabold text-brand-100 leading-none">404</p>
      </div>
      <h1 className="text-2xl font-bold text-ink-900 mb-2">{t('pages.not_found')}</h1>
      <p className="text-ink-500 text-sm mb-8 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-700 text-white font-semibold rounded-xl min-h-[44px] hover:bg-brand-900 transition-colors shadow-sm"
      >
        <Home className="w-4 h-4" aria-hidden="true" />
        {t('common.back_home')}
      </Link>
    </div>
  );
};

export default NotFoundPage;
