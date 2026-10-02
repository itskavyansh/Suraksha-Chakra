import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Shield } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Demo Banner — Always Visible */}
      <div className="bg-amber-50 border-b border-amber-300 text-amber-900 px-4 py-2 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span>{t('admin.banner')}</span>
      </div>

      {/* Admin header */}
      <header className="bg-brand-900 text-white shadow-md">
        <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 h-9 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold"
            aria-label={t('admin.back')}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t('admin.back')}</span>
          </Link>

          <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
            <Shield className="w-5 h-5 text-brand-300" />
            <span>{t('admin.title')}</span>
          </div>

          <div className="w-24" aria-hidden="true" />
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6" role="main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
