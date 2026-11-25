import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Syringe,
  Wine,
  BatteryCharging,
  FlaskConical,
  ShieldAlert,
  HelpCircle,
  CheckCircle,
  XCircle,
  Volume2,
  VolumeX,
  Camera,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/app/routes';
import { HAZARD_GUIDANCE } from '@/features/scan/guidance';
import { HazardCategory } from '@/types';
import { useSpeech } from '@/hooks/useSpeech';
import { useToast } from '@/components/ui/Toast';

export const GuideCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { speak, stop, isSpeaking } = useSpeech();

  const validCategory = (category as HazardCategory) || 'unknown';
  const item = HAZARD_GUIDANCE[validCategory] || HAZARD_GUIDANCE.unknown;

  const iconMap: Record<string, React.ElementType> = {
    Syringe,
    Wine,
    BatteryCharging,
    FlaskConical,
    ShieldAlert,
    HelpCircle,
  };
  const Icon = iconMap[item.iconName] || HelpCircle;

  const fullTextToRead = [
    t(item.titleKey),
    t('guide.lookLikeTitle'),
    t(item.lookLikeKey),
    t('guide.dosTitle'),
    ...item.dosKeys.map((k) => t(k)),
    t('guide.dontsTitle'),
    ...item.dontsKeys.map((k) => t(k)),
  ].join('. ');

  const handleListen = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(fullTextToRead, () => {
        showToast(t('common.speechNotAvailable'), 'info');
      });
    }
  };

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* Category Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center shadow-md">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
              Safety Guidelines
            </span>
            <h1 className="text-lg font-bold text-ink-900 leading-tight">
              {t(item.titleKey)}
            </h1>
          </div>
        </div>

        {/* Listen Button */}
        <button
          type="button"
          onClick={handleListen}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border min-h-[44px] transition-colors ${
            isSpeaking
              ? 'bg-danger-700 text-white border-danger-700 animate-pulse'
              : 'bg-white border-ink-100 text-ink-900 hover:bg-ink-100'
          }`}
          aria-label={isSpeaking ? 'Stop voice reading' : 'Listen to guidance'}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{t('scan.stop')}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-brand-700" />
              <span>{t('scan.listen')}</span>
            </>
          )}
        </button>
      </div>

      {/* What it looks like */}
      <Card padding="md" className="border-ink-100">
        <div className="flex items-center space-x-2 text-ink-900 font-bold text-xs uppercase tracking-wider mb-1.5">
          <Eye className="w-4 h-4 text-brand-700" />
          <span>{t('guide.lookLikeTitle')}</span>
        </div>
        <p className="text-xs text-ink-500 leading-relaxed font-medium">
          {t(item.lookLikeKey)}
        </p>
      </Card>

      {/* Safe Handling (DO) */}
      <Card padding="md" className="border-brand-500/30 bg-brand-100/20">
        <h2 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-2.5 flex items-center">
          <CheckCircle className="w-4 h-4 text-brand-700 mr-1.5" />
          <span>{t('guide.dosTitle')}</span>
        </h2>
        <ul className="space-y-2">
          {item.dosKeys.map((k) => (
            <li key={k} className="flex items-start text-xs text-ink-900 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-1.5 mr-2 flex-shrink-0" />
              <span>{t(k)}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Danger Warning (DON'T) */}
      <Card padding="md" className="border-danger-700/30 bg-danger-100/20">
        <h2 className="text-xs font-bold text-danger-700 uppercase tracking-wider mb-2.5 flex items-center">
          <XCircle className="w-4 h-4 text-danger-700 mr-1.5" />
          <span>{t('guide.dontsTitle')}</span>
        </h2>
        <ul className="space-y-2">
          {item.dontsKeys.map((k) => (
            <li key={k} className="flex items-start text-xs text-ink-900 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-danger-700 mt-1.5 mr-2 flex-shrink-0" />
              <span>{t(k)}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Links */}
      <div className="pt-2 grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="md"
          className="font-bold border border-brand-500/20"
          leftIcon={<Camera className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.scan)}
        >
          {t('guide.scanItem')}
        </Button>

        <Button
          variant="danger"
          size="md"
          className="font-bold shadow-sm"
          leftIcon={<AlertTriangle className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.hurt)}
        >
          {t('guide.gotHurt')}
        </Button>
      </div>
    </div>
  );
};
