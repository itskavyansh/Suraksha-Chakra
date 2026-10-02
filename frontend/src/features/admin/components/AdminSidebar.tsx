import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Briefcase,
  Recycle,
  GraduationCap,
  BarChart3,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'reports'
  | 'workers'
  | 'jobs'
  | 'recyclers'
  | 'training'
  | 'analytics';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

const TABS: { id: AdminTab; labelKey: string; icon: React.ElementType }[] = [
  { id: 'dashboard', labelKey: 'admin.nav.dashboard', icon: LayoutDashboard },
  { id: 'reports', labelKey: 'admin.nav.reports', icon: AlertTriangle },
  { id: 'workers', labelKey: 'admin.nav.workers', icon: Users },
  { id: 'jobs', labelKey: 'admin.nav.jobs', icon: Briefcase },
  { id: 'recyclers', labelKey: 'admin.nav.recyclers', icon: Recycle },
  { id: 'training', labelKey: 'admin.nav.training', icon: GraduationCap },
  { id: 'analytics', labelKey: 'admin.nav.analytics', icon: BarChart3 },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile Horizontal Tabs */}
      <div className="flex md:hidden gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 mb-4" style={{ scrollbarWidth: 'none' }}>
        {TABS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] ${
                isActive
                  ? 'bg-brand-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Sidebar Nav */}
      <nav className="hidden md:flex flex-col gap-1 w-52 flex-shrink-0" aria-label="Admin Navigation">
        {TABS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left min-h-[42px] ${
                isActive
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
