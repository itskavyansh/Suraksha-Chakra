import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, UserCheck, LogIn, UserPlus, Monitor } from 'lucide-react';
import { BRAND } from '@/config/brand';
import { ROUTES } from '@/app/routes';
import { PinwheelLogo } from '@/components/ui/PinwheelLogo';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useSessionStore } from '@/store/sessionStore';
import { useToast } from '@/components/ui/Toast';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginDemoWorker = useSessionStore((state) => state.loginDemoWorker);
  const { showToast } = useToast();

  const handleDemoWorkerLogin = () => {
    const demo = loginDemoWorker();
    showToast(t('auth.welcomeToast', { name: demo.name }));
    navigate(ROUTES.home);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-screen bg-surface">
      {/* Top Bar with Language Toggle */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-brand-700" />
          <span className="text-xs font-semibold text-brand-900 tracking-wide uppercase">
            Official Prototype
          </span>
        </div>
        <LanguageToggle />
      </div>

      {/* Main Branding Section */}
      <div className="flex flex-col items-center text-center my-auto py-6">
        <div className="relative mb-5 p-3 rounded-full bg-white shadow-card border border-ink-100">
          <PinwheelLogo size={68} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">
          {BRAND.name}
        </h1>

        <p className="text-sm font-medium text-brand-700 mt-1">
          {t(BRAND.taglineKey)}
        </p>

        <div className="mt-4 px-4 py-2 bg-brand-100/60 rounded-xl border border-brand-500/20 max-w-xs">
          <p className="text-xs font-semibold text-brand-900">
            {t('landing.welcomeSubtitle')}
          </p>
        </div>

        {/* AI model download note */}
        <p className="text-[11px] text-ink-500 max-w-xs mt-4 leading-normal bg-ink-100/60 p-2.5 rounded-lg border border-ink-100">
          {t('landing.aiModelNote')}
        </p>
      </div>

      {/* CTA Buttons in exact requested order */}
      <div className="w-full flex flex-col space-y-2.5 pb-4">
        {/* 1. Primary: Demo worker Ramesh */}
        <Button
          variant="primary"
          size="lg"
          className="w-full shadow-md text-base font-bold"
          leftIcon={<UserCheck className="w-5 h-5" />}
          onClick={handleDemoWorkerLogin}
        >
          {t('landing.demoWorkerBtn')}
        </Button>

        {/* 2. Log in */}
        <Button
          variant="secondary"
          size="lg"
          className="w-full font-semibold"
          leftIcon={<LogIn className="w-5 h-5" />}
          onClick={() => navigate(ROUTES.login)}
        >
          {t('landing.loginBtn')}
        </Button>

        {/* 3. Create account */}
        <Button
          variant="ghost"
          size="md"
          className="w-full border border-ink-100 bg-white font-semibold"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.signup)}
        >
          {t('landing.signupBtn')}
        </Button>

        {/* 4. View admin demo */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-ink-500 hover:text-ink-900"
          leftIcon={<Monitor className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.admin)}
        >
          {t('landing.adminDemoBtn')}
        </Button>
      </div>

      {/* Footer Notice */}
      <footer className="text-center pt-2 border-t border-ink-100/80">
        <p className="text-[11px] text-ink-500">
          {t('common.prototypeNote')}{' '}
          <button
            type="button"
            onClick={() => navigate(ROUTES.admin)}
            className="text-brand-700 underline font-medium hover:text-brand-900"
          >
            Admin demo
          </button>
        </p>
      </footer>
    </div>
  );
};
