import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  RotateCcw,
  LogOut,
  Globe,
  Award,
  Calendar,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import Badge from '../../components/ui/Badge';
import { useAppStore } from '../../store/useAppStore';
import api from '../../data/api';
import type { Language, TrainingProgress, TrainingModule } from '../../types';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, language, setLanguage } = useAppStore();

  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [progress, setProgress] = useState<TrainingProgress[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([api.getTrainingModules(), api.getTrainingProgress()]).then(
      ([mods, progs]) => {
        if (active) {
          setModules(mods);
          setProgress(progs);
        }
      },
    );
    return () => {
      active = false;
    };
  }, []);

  const handleResetDemo = () => {
    if (window.confirm(t('profile.reset_confirm'))) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith('sc_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => sessionStorage.removeItem(k));
      window.location.reload();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const safetyScore = user?.safetyScore ?? 85;
  const strokeDashoffset = 251.2 - (251.2 * safetyScore) / 100;

  const completedModules = progress
    .filter((p) => p.completed)
    .map((p) => {
      const mod = modules.find((m) => m.id === p.moduleId);
      return {
        ...p,
        titleKey: mod?.titleKey || 'training.title',
      };
    });

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 pb-6">
        <h2 className="text-xl font-bold text-ink-900">{t('profile.title')}</h2>

        {/* Digital Worker ID Card */}
        <div className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white rounded-2xl p-5 shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-100" />
              <span className="font-bold text-sm tracking-wide">
                {t('profile.id_card')}
              </span>
            </div>
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
              {user?.id || 'SC-DEL-000142'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-brand-900 font-extrabold text-lg flex items-center justify-center shadow-inner flex-shrink-0">
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('') || 'RK'}
            </div>

            <div className="min-w-0">
              <h3 className="font-extrabold text-lg truncate leading-tight">
                {user?.name || 'Ramesh Kumar'}
              </h3>
              <p className="text-xs text-brand-100 mt-0.5">{user?.phone || '+91 98765 43210'}</p>
              <div className="flex items-center gap-3 text-xs text-brand-100 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {user?.city || 'Delhi'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '15 Apr 2023'}
                </span>
              </div>
            </div>
          </div>

          {/* Skills Chips */}
          <div className="pt-2 border-t border-white/20">
            <span className="text-[11px] text-brand-100 block mb-1.5 font-medium">
              {t('profile.skills')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(user?.skills || ['Segregation', 'Door-to-door collection', 'Hazard Safety']).map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-0.5 rounded-md bg-white/15 text-xs text-white backdrop-blur-xs font-medium"
                  >
                    {skill}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Safety Score Ring Card */}
        <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm flex items-center gap-5">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#E2E8E4"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#0F5C3A"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-ink-900">{safetyScore}</span>
              <span className="text-[9px] text-ink-500 font-semibold uppercase">/100</span>
            </div>
          </div>

          <div className="min-w-0">
            <h4 className="font-bold text-sm text-ink-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-700" />
              {t('profile.safety_score')}
            </h4>
            <p className="text-xs text-ink-500 mt-1 leading-relaxed">
              {t('profile.safety_desc')}
            </p>
          </div>
        </div>

        {/* Training History */}
        <div className="bg-white border border-ink-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <h4 className="font-bold text-sm text-ink-900">
            {t('profile.training_history')}
          </h4>

          {completedModules.length === 0 ? (
            <p className="text-xs text-ink-500 italic py-2">No completed modules yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-ink-50">
              {completedModules.map((cm) => (
                <div key={cm.moduleId} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink-900 truncate">
                      {t(cm.titleKey)}
                    </p>
                    {cm.completedAt && (
                      <span className="text-[11px] text-ink-500">
                        {new Date(cm.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Badge variant="brand">
                    <span className="flex items-center gap-1 text-[11px]">
                      <CheckCircle className="w-3 h-3" />
                      {cm.score}/3
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Language Preference */}
        <div className="bg-white border border-ink-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-brand-700" />
            <span className="text-sm font-semibold text-ink-900">{t('profile.language')}</span>
          </div>

          <div className="flex gap-1.5 bg-ink-100 p-1 rounded-xl">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all min-h-[32px] ${
                language === 'en' ? 'bg-white text-ink-900 shadow-xs' : 'text-ink-500'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all min-h-[32px] ${
                language === 'hi' ? 'bg-white text-ink-900 shadow-xs' : 'text-ink-500'
              }`}
            >
              हिं
            </button>
          </div>
        </div>

        {/* Reset Demo Data & Logout */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleResetDemo}
            className="w-full min-h-[44px] border border-ink-100 text-ink-700 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-ink-100 active:scale-95 transition-all text-xs"
          >
            <RotateCcw className="w-4 h-4 text-ink-500" />
            <span>{t('profile.reset_demo')}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full min-h-[44px] bg-danger-100 text-danger-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-200 active:scale-95 transition-all text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('profile.logout')}</span>
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
