import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ROUTES } from '@/app/routes';
import { api } from '@/data/api';
import { useToast } from '@/components/ui/Toast';
import { validatePhone, validatePin, validatePinsMatch } from './validators';

export const ForgotPinPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState<'phone' | 'reset'>('phone');
  const [mobile, setMobile] = useState('');
  const [mockSmsCode, setMockSmsCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneCheck = validatePhone(mobile);
    if (!phoneCheck.isValid) {
      setError(t(phoneCheck.errorKey!));
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const account = await api.findAccountByPhone(mobile.trim());
      if (!account) {
        setError(t('auth.userNotFound'));
        return;
      }

      // Generate a mock 4-digit SMS code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setMockSmsCode(code);
      setStep('reset');
    } catch {
      setError(t('auth.userNotFound'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode !== mockSmsCode) {
      setError('Invalid verification code');
      return;
    }

    const pinCheck = validatePin(newPin);
    if (!pinCheck.isValid) {
      setError(t(pinCheck.errorKey!));
      return;
    }

    const matchCheck = validatePinsMatch(newPin, confirmPin);
    if (!matchCheck.isValid) {
      setError(t(matchCheck.errorKey!));
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await api.resetPin(mobile.trim(), newPin);
      showToast(t('auth.forgotPinSuccess'));
      navigate(ROUTES.login);
    } catch {
      setError('Failed to update PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-surface min-h-screen">
      <div>
        <div className="flex items-center justify-between pb-3">
          <button
            type="button"
            onClick={() => (step === 'reset' ? setStep('phone') : navigate(ROUTES.login))}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2 rounded-xl text-ink-900 hover:bg-ink-100"
            aria-label="Back"
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
          {t('auth.forgotPinTitle')}
        </h1>
        <p className="text-xs text-ink-500 mt-1 mb-5">
          {t('auth.forgotPinSubtitle')}
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-danger-100 border border-danger-700/20 text-xs font-semibold text-danger-700">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
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
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                    setError('');
                  }}
                  placeholder={t('auth.mobilePlaceholder')}
                  className="w-full min-h-[44px] pl-12 pr-3.5 py-2.5 rounded-xl border border-ink-100 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md"
              isLoading={isLoading}
            >
              Get Verification Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPin} className="space-y-4">
            {/* Mock SMS Notice */}
            <div className="p-3 bg-brand-100/70 border border-brand-500/30 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-1.5 text-brand-900 font-semibold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 text-brand-700" />
                <span>{t('auth.forgotPinMockCodeNotice')}</span>
              </div>
              <p className="text-lg font-mono font-bold tracking-widest text-brand-900">
                {mockSmsCode}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1">
                {t('auth.forgotPinEnterCode')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={enteredCode}
                onChange={(e) => {
                  setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 4));
                  setError('');
                }}
                placeholder="4 digits"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-ink-100 text-sm bg-white font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-900 mb-1">
                  {t('auth.forgotPinNewPin')}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={newPin}
                  onChange={(e) => {
                    setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setError('');
                  }}
                  placeholder="••••"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-ink-100 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-900 mb-1">
                  {t('auth.confirmPin')}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(e) => {
                    setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setError('');
                  }}
                  placeholder="••••"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-ink-100 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md"
              leftIcon={<KeyRound className="w-4 h-4" />}
              isLoading={isLoading}
            >
              Update PIN
            </Button>
          </form>
        )}
      </div>

      <div className="pt-4 text-center border-t border-ink-100 mt-6">
        <button
          type="button"
          onClick={() => navigate(ROUTES.login)}
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 min-h-[44px] px-2"
        >
          {t('common.back')} to {t('landing.loginBtn')}
        </button>
      </div>
    </div>
  );
};
