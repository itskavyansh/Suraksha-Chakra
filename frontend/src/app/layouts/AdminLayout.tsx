import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-surface">
      {/* Admin top bar - full width */}
      <header className="bg-brand-900 text-white shadow-md">
        <div className="flex items-center justify-between px-4 h-14 max-w-5xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 h-10 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold"
            aria-label={t('admin.back')}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t('admin.back')}</span>
          </Link>
          <h1 className="text-base font-bold">{t('admin.title')}</h1>
          <div className="w-24" aria-hidden="true" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6" role="main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
