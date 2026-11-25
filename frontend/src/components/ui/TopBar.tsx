import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BRAND } from '@/config/brand';
import { ROUTES } from '@/app/routes';
import { LanguageToggle } from './LanguageToggle';

export interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    try {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(ROUTES.home);
      }
    } catch {
      navigate(ROUTES.home);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-ink-100/80 shadow-sm min-h-[56px]">
      <div className="flex items-center min-w-0">
        {showBack ? (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2 mr-1 rounded-xl text-ink-900 hover:bg-ink-100 active:bg-ink-100/70"
            aria-label="Go back to previous screen"
          >
            <ArrowLeft className="w-5 h-5 text-ink-900" />
          </button>
        ) : null}
        <div className="flex items-center space-x-2 truncate">
          <h1 className="text-base font-bold text-brand-900 truncate">
            {title || BRAND.name}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        {rightAction}
        <LanguageToggle />
      </div>
    </header>
  );
};
