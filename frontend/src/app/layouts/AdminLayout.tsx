import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Briefcase,
  Recycle,
  GraduationCap,
  LineChart,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ROUTES } from '@/app/routes';

export const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active admin tab from hash or search or state
  const currentTab = new URLSearchParams(location.search).get('tab') || 'dashboard';

  const navItems = [
    { id: 'dashboard', label: t('admin.tabDashboard'), icon: LayoutDashboard },
    { id: 'reports', label: t('admin.tabReports'), icon: AlertTriangle },
    { id: 'workers', label: t('admin.tabWorkers'), icon: Users },
    { id: 'jobs', label: t('admin.tabJobs'), icon: Briefcase },
    { id: 'recyclers', label: t('admin.tabRecyclers'), icon: Recycle },
    { id: 'training', label: t('admin.tabTraining'), icon: GraduationCap },
    { id: 'analytics', label: t('admin.tabAnalytics'), icon: LineChart },
  ];

  const handleTabChange = (tabId: string) => {
    navigate(`${ROUTES.admin}?tab=${tabId}`);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Banner */}
      <div className="bg-brand-900 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-brand-700">
        <div className="flex items-center space-x-2">
          <Badge variant="warning">{t('common.sampleData')}</Badge>
          <span>{t('admin.banner')}</span>
        </div>
        <span className="text-brand-100/80 text-[11px] hidden sm:inline">
          {t('admin.syncNotice')}
        </span>
      </div>

      {/* Main Admin Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-ink-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-900 hover:bg-ink-100 rounded-lg"
            aria-label="Toggle admin navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="text-base font-bold text-ink-900 flex items-center gap-2">
              <span>Suraksha Chakra</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-brand-100 text-brand-900 rounded-md">
                Admin
              </span>
            </h1>
            <p className="text-xs text-ink-500 hidden sm:block">
              Hazard intelligence & municipal worker monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => navigate(ROUTES.home)}
            className="inline-flex items-center px-3 py-1.5 min-h-[44px] text-xs font-semibold rounded-lg text-ink-900 hover:bg-ink-100 border border-ink-100 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>{t('common.backToHome')}</span>
          </button>
          <LanguageToggle />
        </div>
      </header>

      {/* Mobile Horizontal Tab Navigation */}
      <div className="md:hidden bg-white border-b border-ink-100 overflow-x-auto px-2 flex space-x-1 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center whitespace-nowrap px-3 py-2.5 text-xs font-medium border-b-2 min-h-[44px] transition-colors ${
                isActive
                  ? 'border-brand-700 text-brand-900 font-bold bg-brand-100/30'
                  : 'border-transparent text-ink-500 hover:text-ink-900'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4 mr-1.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-white border-r border-ink-100 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-brand-700 text-white font-semibold shadow-sm'
                    : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
                }`}
                aria-label={item.label}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-white' : 'text-ink-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
