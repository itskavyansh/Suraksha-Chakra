import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Eye, EyeOff, ShieldAlert, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ROUTES } from '@/app/routes';
import { api, hashPin } from '@/data/api';
import { useSessionStore } from '@/store/sessionStore';
import { useToast } from '@/components/ui/Toast';
import {
  validateName,
  validatePhone,
  validatePin,
  validatePinsMatch,
} from './validators';

const CITIES = ['Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad', 'Other'] as const;
const SKILLS = [
  'Segregation',
  'Door-to-door collection',
  'Sorting yard',
  'Recycling shop',
  'Other',
] as const;

export const SignupPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [city, setCity] = useState<string>('Delhi');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Segregation']);
  const [preferredLang, setPreferredLang] = useState<'en' | 'hi'>(
    i18n.language === 'hi' ? 'hi' : 'en'
  );
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(val);
    if (errors.mobile) {
      setErrors((prev) => ({ ...prev, mobile: '' }));
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>, isConfirm = false) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (isConfirm) {
      setConfirmPin(val);
      if (errors.confirmPin) setErrors((prev) => ({ ...prev, confirmPin: '' }));
    } else {
      setPin(val);
      if (errors.pin) setErrors((prev) => ({ ...prev, pin: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameCheck = validateName(fullName);
    const phoneCheck = validatePhone(mobile);
    const pinCheck = validatePin(pin);
    const matchCheck = validatePinsMatch(pin, confirmPin);

    const newErrors: Record<string, string> = {};
    if (!nameCheck.isValid) newErrors.fullName = t(nameCheck.errorKey!);
    if (!phoneCheck.isValid) newErrors.mobile = t(phoneCheck.errorKey!);
    if (!pinCheck.isValid) newErrors.pin = t(pinCheck.errorKey!);
    if (!matchCheck.isValid) newErrors.confirmPin = t(matchCheck.errorKey!);
    if (!consent) newErrors.consent = t('auth.validationConsent');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const pinHash = await hashPin(pin);
      const worker = await api.createAccount({
        name: fullName.trim(),
        phone: mobile.trim(),
        pinHash,
        city,
        skills: selectedSkills.length > 0 ? selectedSkills : ['Segregation'],
        preferredLanguage: preferredLang,
      });

      // Update session store
      setSession(worker, false);

      // Change app language if user selected a different preference
      if (preferredLang !== i18n.language) {
        i18n.changeLanguage(preferredLang);
      }

      showToast(t('auth.welcomeToast', { name: worker.name }));
      navigate(ROUTES.home);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'DUPLICATE_PHONE') {
        setErrors({ mobile: t('auth.phoneExists') });
      } else {
        showToast('Account creation failed. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-surface min-h-screen">
      {/* Header */}
      <div>
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
          {t('auth.signupTitle')}
        </h1>
        <p className="text-xs text-ink-500 mt-1 mb-5">
          {t('auth.signupSubtitle')}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('auth.fullName')} *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              placeholder={t('auth.fullNamePlaceholder')}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.fullName ? 'border-danger-700 bg-danger-100/20' : 'border-ink-100'
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-danger-700 mt-1 font-medium">{errors.fullName}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('auth.mobileNumber')} *
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
                className={`w-full min-h-[44px] pl-12 pr-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.mobile ? 'border-danger-700 bg-danger-100/20' : 'border-ink-100'
                }`}
              />
            </div>
            {errors.mobile && (
              <p className="text-[11px] text-danger-700 mt-1 font-medium">{errors.mobile}</p>
            )}
          </div>

          {/* 4-Digit PIN & Confirm PIN */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1">
                {t('auth.pin')} *
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => handlePinChange(e, false)}
                  placeholder="4 digits"
                  className={`w-full min-h-[44px] px-3.5 py-2.5 pr-10 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors.pin ? 'border-danger-700 bg-danger-100/20' : 'border-ink-100'
                  }`}
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
              {errors.pin && (
                <p className="text-[11px] text-danger-700 mt-1 font-medium">{errors.pin}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1">
                {t('auth.confirmPin')} *
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => handlePinChange(e, true)}
                placeholder="4 digits"
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.confirmPin ? 'border-danger-700 bg-danger-100/20' : 'border-ink-100'
                }`}
              />
              {errors.confirmPin && (
                <p className="text-[11px] text-danger-700 mt-1 font-medium">{errors.confirmPin}</p>
              )}
            </div>
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('auth.city')}
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-ink-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Multi-select chips */}
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1.5">
              {t('auth.skills')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium min-h-[44px] transition-colors ${
                      isSelected
                        ? 'bg-brand-700 text-white shadow-sm'
                        : 'bg-white border border-ink-100 text-ink-900 hover:bg-ink-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 mr-1" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1.5">
              {t('auth.preferredLanguage')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPreferredLang('en')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold min-h-[44px] border ${
                  preferredLang === 'en'
                    ? 'border-brand-700 bg-brand-100 text-brand-900'
                    : 'border-ink-100 bg-white text-ink-500'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setPreferredLang('hi')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold min-h-[44px] border ${
                  preferredLang === 'hi'
                    ? 'border-brand-700 bg-brand-100 text-brand-900'
                    : 'border-ink-100 bg-white text-ink-500'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }));
                }}
                className="mt-0.5 w-4 h-4 rounded text-brand-700 border-ink-100 focus:ring-brand-500"
              />
              <span className="text-xs text-ink-900 leading-snug">
                {t('auth.consentCheckbox')} *
              </span>
            </label>
            {errors.consent && (
              <p className="text-[11px] text-danger-700 mt-1 font-medium">{errors.consent}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4 font-bold shadow-md"
            isLoading={isSubmitting}
          >
            {t('auth.signupAction')}
          </Button>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 text-center border-t border-ink-100 mt-6">
        <button
          type="button"
          onClick={() => navigate(ROUTES.login)}
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 min-h-[44px] px-2"
        >
          {t('auth.alreadyHaveAccount')}
        </button>
      </div>
    </div>
  );
};
