import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Syringe,
  Wine,
  BatteryCharging,
  FlaskConical,
  ShieldAlert,
  HelpCircle,
  BookOpen,
  ChevronRight,
  WifiOff,
} from 'lucide-react';
import { ROUTES } from '@/app/routes';
import { HAZARD_GUIDANCE } from '@/features/scan/guidance';
import { HazardCategory } from '@/types';

export const GuidePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const categories: { cat: HazardCategory; icon: React.ElementType; color: string; iconBg: string }[] = [
    { cat: 'sharps', icon: Syringe, color: 'bg-red-50 border-red-200 text-red-900', iconBg: 'bg-danger-700 text-white' },
    { cat: 'glass', icon: Wine, color: 'bg-orange-50 border-orange-200 text-orange-900', iconBg: 'bg-orange-600 text-white' },
    { cat: 'batteries', icon: BatteryCharging, color: 'bg-amber-50 border-amber-200 text-amber-900', iconBg: 'bg-amber-600 text-white' },
    { cat: 'chemicals', icon: FlaskConical, color: 'bg-rose-50 border-rose-200 text-rose-900', iconBg: 'bg-danger-700 text-white' },
    { cat: 'medical', icon: ShieldAlert, color: 'bg-red-50 border-red-200 text-red-900', iconBg: 'bg-danger-700 text-white' },
    { cat: 'unknown', icon: HelpCircle, color: 'bg-slate-50 border-slate-200 text-slate-900', iconBg: 'bg-slate-700 text-white' },
  ];

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-brand-700 mb-1">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Worker Safety Manual
          </span>
        </div>
        <h1 className="text-xl font-bold text-ink-900">
          {t('guide.title')}
        </h1>
        <p className="text-xs text-ink-500 mt-0.5">
          {t('guide.subtitle')}
        </p>
      </div>

      {/* Offline capability notice */}
      <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-brand-100/60 border border-brand-500/20 text-xs text-brand-900 font-medium">
        <WifiOff className="w-4 h-4 flex-shrink-0 text-brand-700" />
        <span>Works offline with zero model download needed.</span>
      </div>

      {/* 6 Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map(({ cat, icon: Icon, color, iconBg }) => {
          const item = HAZARD_GUIDANCE[cat];
          return (
            <button
              key={cat}
              type="button"
              onClick={() => navigate(ROUTES.guideCategory(cat))}
              className={`flex items-center p-4 rounded-2xl border text-left shadow-sm hover:shadow-card active:scale-[0.99] transition-all min-h-[72px] ${color}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3.5 flex-shrink-0 shadow-sm ${iconBg}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="font-bold text-sm text-ink-900 leading-tight">
                  {t(item.titleKey)}
                </h2>
                <p className="text-[11px] text-ink-500 mt-1 line-clamp-1">
                  {t(item.lookLikeKey)}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-400 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
