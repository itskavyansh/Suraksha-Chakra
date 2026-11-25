import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Syringe,
  Wine,
  Battery,
  FlaskConical,
  Biohazard,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/app/routes';
import { TrainingModule, TrainingProgress } from '@/types';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/sessionStore';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  Syringe: <Syringe className="w-5 h-5 text-brand-700" />,
  Wine: <Wine className="w-5 h-5 text-danger-700" />,
  Battery: <Battery className="w-5 h-5 text-warn-500" />,
  Flask: <FlaskConical className="w-5 h-5 text-purple-600" />,
  Biohazard: <Biohazard className="w-5 h-5 text-danger-700" />,
};

export const TrainingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSessionStore((state) => state.user);

  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [progress, setProgress] = useState<TrainingProgress>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [mods, prog] = await Promise.all([
          api.getTrainingModules(),
          user ? api.getTrainingProgress(user.id) : Promise.resolve({}),
        ]);
        if (mounted) {
          setModules(mods);
          setProgress(prog);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [user]);

  const completedCount = modules.filter((m) => progress[m.id]?.completed).length;
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-brand-700" />
            <span>{t('training.title')}</span>
          </h1>
          <p className="text-xs text-ink-500 mt-0.5">
            {t('training.progressHeader', { completed: completedCount, total: modules.length })}
          </p>
        </div>
        <Badge variant="sample" />
      </div>

      {/* Progress Card */}
      <Card className="p-4 bg-brand-100/30 border border-brand-500/20">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-900 mb-1.5">
          <span>{t('training.progressHeader', { completed: completedCount, total: modules.length })}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-brand-500/20">
          <div
            className="bg-brand-700 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-ink-500">
          <span>+5 {t('profile.safetyScore')} per passed quiz</span>
          <span>{t('training.scoreLabel', { score: completedCount })}</span>
        </div>
      </Card>

      {/* Module List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-ink-500">Loading modules...</div>
        ) : (
          modules.map((mod, index) => {
            const isCompleted = !!progress[mod.id]?.completed;
            const score = progress[mod.id]?.score ?? 0;

            return (
              <Card
                key={mod.id}
                className="p-4 hover:border-brand-500/40 transition-all cursor-pointer"
                onClick={() => navigate(ROUTES.trainingDetail(mod.id))}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-ink-100/70 flex items-center justify-center shrink-0">
                      {MODULE_ICONS[mod.coverIcon] || <GraduationCap className="w-5 h-5 text-brand-700" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-ink-500 uppercase tracking-wider">
                          Module {index + 1}
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center text-[10px] font-bold text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3 mr-0.5" />
                            {t('training.completed')} ({score}/3)
                          </span>
                        )}
                      </div>
                      <h2 className="text-sm font-bold text-ink-900 mt-0.5">
                        {t(mod.titleKey)}
                      </h2>
                      <p className="text-xs text-ink-500 mt-1 line-clamp-2">
                        {t(mod.descKey)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-ink-100 flex items-center justify-between">
                  <div className="flex items-center text-xs text-ink-500">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>{t('training.duration', { mins: mod.durationMins })}</span>
                  </div>

                  <Button
                    size="sm"
                    variant={isCompleted ? 'ghost' : 'primary'}
                    className={isCompleted ? 'border border-ink-100 text-xs' : 'text-xs font-bold'}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(ROUTES.trainingDetail(mod.id));
                    }}
                  >
                    {isCompleted ? t('training.reviewModule') : t('training.startModule')}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
