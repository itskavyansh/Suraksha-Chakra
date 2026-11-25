import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Briefcase, Camera, GraduationCap, User } from 'lucide-react';
import { ROUTES } from '@/app/routes';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navItems = [
    {
      id: 'home',
      label: t('nav.home'),
      icon: Home,
      route: ROUTES.home,
      isActive: location.pathname === ROUTES.home,
    },
    {
      id: 'jobs',
      label: t('nav.jobs'),
      icon: Briefcase,
      route: ROUTES.jobs,
      isActive: location.pathname === ROUTES.jobs,
    },
    {
      id: 'scan',
      label: t('nav.scan'),
      icon: Camera,
      route: ROUTES.scan,
      isActive: location.pathname === ROUTES.scan,
      isRaised: true,
    },
    {
      id: 'training',
      label: t('nav.training'),
      icon: GraduationCap,
      route: ROUTES.training,
      isActive: location.pathname.startsWith('/training'),
    },
    {
      id: 'profile',
      label: t('nav.profile'),
      icon: User,
      route: ROUTES.profile,
      isActive: location.pathname === ROUTES.profile,
    },
  ];

  return (
    <nav
      className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-ink-100 shadow-phone pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isRaised) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.route)}
                className="group relative -top-4 flex flex-col items-center justify-center focus:outline-none"
                aria-label={item.label}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                    item.isActive
                      ? 'bg-brand-900 text-white ring-4 ring-brand-100'
                      : 'bg-brand-700 text-white hover:bg-brand-900 ring-4 ring-white'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-semibold text-brand-900 mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center justify-center flex-1 min-h-[44px] min-w-[44px] py-1 transition-colors ${
                item.isActive
                  ? 'text-brand-700 font-semibold'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] mt-0.5 leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
