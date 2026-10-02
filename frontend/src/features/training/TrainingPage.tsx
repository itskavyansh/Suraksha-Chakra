import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  Zap,
  Droplets,
  HeartPulse,
  Clock,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import Badge from '../../components/ui/Badge';
import api from '../../data/api';
import type { TrainingModule, TrainingProgress } from '../../types';

const ICON_MAP: Record<string, React.ElementType> = {
  AlertTriangle,
  ShieldAlert,
  Zap,
  Droplets,
  HeartPulse,
};

const TrainingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [progress, setProgress] = useState<TrainingProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([api.getTrainingModules(), api.getTrainingProgress()])
      .then(([m, p]) => {
        if (active) {
          setModules(m);
          setProgress(p);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const completedCount = progress.filter((p) => p.completed).length;
  const totalCount = modules.length || 5;
  const pct = Math.round((completedCount / totalCount) * 100);

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 pb-6">
        <div>
          <h2 className="text-xl font-bold text-ink-900">{t('training.title')}</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            {t('training.progress_header', { completed: completedCount, total: totalCount })}
          </p>
          <div className="w-full bg-ink-100 h-2.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-brand-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="w-6 h-6 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {modules.map((m) => {
              const prog = progress.find((p) => p.moduleId === m.id);
              const isCompleted = prog?.completed;
              const IconComp = ICON_MAP[m.coverIcon] || AlertTriangle;

              return (
                <button
                  key={m.id}
                  onClick={() => navigate(`/training/${m.id}`)}
                  className="w-full text-left bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-3.5 hover:border-brand-500 transition-all active:scale-[0.99] shadow-sm"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-brand-100 text-brand-700' : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    <IconComp className="w-6 h-6" aria-hidden="true" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {isCompleted ? (
                        <Badge variant="brand">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {t('training.completed')} ({prog?.score}/3)
                          </span>
                        </Badge>
                      ) : (
                        <Badge variant="neutral">{t('training.not_started')}</Badge>
                      )}
                      <span className="text-xs text-ink-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t('training.duration', { min: m.durationMin })}
                      </span>
                    </div>

                    <p className="font-semibold text-sm text-ink-900 truncate">
                      {t(m.titleKey)}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-ink-500 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default TrainingPage;
