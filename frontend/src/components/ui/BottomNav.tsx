import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Briefcase, Camera, GraduationCap, User } from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ElementType;
  labelKey: string;
  isScan?: boolean;
}

const navItems: NavItem[] = [
  { to: '/home', icon: Home, labelKey: 'nav.home' },
  { to: '/jobs', icon: Briefcase, labelKey: 'nav.jobs' },
  { to: '/scan', icon: Camera, labelKey: 'nav.scan', isScan: true },
  { to: '/training', icon: GraduationCap, labelKey: 'nav.training' },
  { to: '/profile', icon: User, labelKey: 'nav.profile' },
];

const BottomNav: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav
      className="sticky bottom-0 z-50 w-full bg-white border-t border-ink-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Main navigation"
    >
      <ul className="flex items-end justify-around h-16">
        {navItems.map(({ to, icon: Icon, labelKey, isScan }) => {
          if (isScan) {
            return (
              <li key={to} className="flex flex-col items-center -mt-5">
                <NavLink
                  to={to}
                  aria-label={t(labelKey)}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-150 active:scale-95
                    ${isActive ? 'bg-brand-900' : 'bg-brand-700'}`
                  }
                >
                  <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                </NavLink>
                <span className="text-xs font-medium text-ink-500 mt-0.5">
                  {t(labelKey)}
                </span>
              </li>
            );
          }

          return (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] px-2 pt-2 rounded-xl transition-colors duration-150
                  ${isActive ? 'text-brand-700' : 'text-ink-500 hover:text-ink-900'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}
                      aria-hidden="true"
                    />
                    <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                      {t(labelKey)}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
