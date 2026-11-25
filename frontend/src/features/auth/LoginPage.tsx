import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Eye, EyeOff, ShieldAlert, LogIn, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ROUTES } from '@/app/routes';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/sessionStore';
import { useToast } from '@/components/ui/Toast';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSession, loginDemoWorker } = useSessionStore();
  const { showToast } = useToast();

  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rate limiting after 5 failures: 30 seconds lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutRemaining > 0) {
      timer = setTimeout(() => {
        setLockoutRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [lockoutRemaining]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
    setErrorMessage('');
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
    setErrorMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    if (mobile.length !== 10 || pin.length !== 4) {
      setErrorMessage(t('auth.invalidCredentials'));
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.verifyLogin(mobile, pin);
      if (res.success && res.worker) {
        setSession(res.worker, res.worker.id === 'demo-ramesh');
        showToast(t('auth.welcomeToast', { name: res.worker.name }));
        navigate(ROUTES.home);
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutRemaining(30);
          setFailedAttempts(0);
        }
        setErrorMessage(t('auth.invalidCredentials'));
      }
    } catch {
      setErrorMessage(t('auth.invalidCredentials'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryDemo = () => {
    const demo = loginDemoWorker();
    showToast(t('auth.welcomeToast', { name: demo.name }));
    navigate(ROUTES.home);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-surface min-h-screen">
      <div>
        {/* Top bar with back arrow and language toggle */}
        <div className="flex items-center justify-between pb-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.landing)}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2 rounded-xl text-ink-900 hover:bg-ink-100"
            aria-label="Back to welcome page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <LanguageToggle />
        </div>

        {/* Prototype notice banner */}
        <div className="flex items-center space-x-2 p-2.5 mb-4 bg-warn-500/15 border border-warn-500/30 rounded-xl text-xs text-amber-950">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-800" />
          <span>{t('common.prototypeSignIn')}</span>
        </div>

        <h1 className="text-xl font-bold text-ink-900">
          {t('auth.loginTitle')}
        </h1>
        <p className="text-xs text-ink-500 mt-1 mb-5">
          {t('auth.loginSubtitle')}
        </p>

        {/* Lockout alert */}
        {lockoutRemaining > 0 && (
          <div className="p-3 mb-4 rounded-xl bg-danger-100 border border-danger-700/20 text-xs font-semibold text-danger-700">
            {t('auth.tooManyAttempts', { seconds: lockoutRemaining })}
          </div>
        )}

        {/* General error message */}
        {errorMessage && lockoutRemaining === 0 && (
          <div className="p-3 mb-4 rounded-xl bg-danger-100 border border-danger-700/20 text-xs font-semibold text-danger-700">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('auth.mobileNumber')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-500">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={handleMobileChange}
                placeholder={t('auth.mobilePlaceholder')}
                disabled={lockoutRemaining > 0}
                className="w-full min-h-[44px] pl-12 pr-3.5 py-2.5 rounded-xl border border-ink-100 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-ink-100/50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink-900">
                {t('auth.pin')}
              </label>
              <button
                type="button"
                onClick={() => navigate(ROUTES.forgotPin)}
                className="text-xs font-medium text-brand-700 hover:text-brand-900 min-h-[44px] flex items-center"
              >
                {t('auth.forgotPinLink')}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                value={pin}
                onChange={handlePinChange}
                placeholder={t('auth.pinPlaceholder')}
                disabled={lockoutRemaining > 0}
                className="w-full min-h-[44px] px-3.5 py-2.5 pr-10 rounded-xl border border-ink-100 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-ink-100/50"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-ink-500 hover:text-ink-900"
                aria-label={showPin ? t('auth.hidePin') : t('auth.showPin')}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-md mt-2"
            isLoading={isSubmitting}
            disabled={lockoutRemaining > 0}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            {lockoutRemaining > 0
              ? `${lockoutRemaining}s`
              : t('auth.loginAction')}
          </Button>
        </form>

        {/* Demo worker alternative */}
        <div className="mt-5 pt-4 border-t border-ink-100 text-center">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full font-semibold"
            leftIcon={<UserCheck className="w-4 h-4" />}
            onClick={handleTryDemo}
          >
            {t('auth.tryDemoWorker')}
          </Button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 text-center border-t border-ink-100 mt-6">
        <button
          type="button"
          onClick={() => navigate(ROUTES.signup)}
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 min-h-[44px] px-2"
        >
          {t('auth.dontHaveAccount')} {t('auth.signupAction')}
        </button>
      </div>
    </div>
  );
};
