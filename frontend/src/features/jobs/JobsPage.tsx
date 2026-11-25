import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Briefcase,
  MapPin,
  CheckCircle2,
  Package,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Job } from '@/types';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/sessionStore';
import { useToast } from '@/components/ui/Toast';

export const JobsPage: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const user = useSessionStore((state) => state.user);
  const updateUser = useSessionStore((state) => state.updateUser);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<'all' | 'under2km' | 'highValue'>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadJobs() {
      if (!user) return;
      try {
        const data = await api.getJobs(user.id);
        if (mounted) {
          setJobs(data);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }
    loadJobs();
    return () => {
      mounted = false;
    };
  }, [user]);

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'under2km') return job.distanceKm <= 2.0;
    if (filter === 'highValue') return job.estValue >= 200;
    return true;
  });

  const handleAccept = async (jobId: string) => {
    if (!user) return;
    setActionLoadingId(jobId);
    try {
      const updated = await api.acceptJob(user.id, jobId);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
      showToast(t('jobs.accepted'), 'success');
    } catch {
      showToast('Could not accept job', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkDone = async (jobId: string) => {
    if (!user) return;
    setActionLoadingId(jobId);
    try {
      const { job: updated, newSafetyScore, transaction } = await api.markJobDone(user.id, jobId);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
      updateUser({ safetyScore: newSafetyScore });
      showToast(t('jobs.jobCompletedToast', { amount: transaction.amount }), 'success');
    } catch {
      showToast('Could not complete job', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-700" />
            <span>{t('jobs.title')}</span>
          </h1>
          <p className="text-xs text-ink-500 mt-0.5">{t('jobs.subtitle')}</p>
        </div>
        <Badge variant="sample" />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-ink-100 text-ink-900 hover:bg-ink-100/80'
          }`}
        >
          {t('jobs.filterAll')} ({jobs.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('under2km')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'under2km'
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-ink-100 text-ink-900 hover:bg-ink-100/80'
          }`}
        >
          {t('jobs.filterUnder2km')}
        </button>

        <button
          type="button"
          onClick={() => setFilter('highValue')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'highValue'
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-ink-100 text-ink-900 hover:bg-ink-100/80'
          }`}
        >
          {t('jobs.filterHighValue')}
        </button>
      </div>

      {/* Job Cards */}
      {loading ? (
        <div className="p-8 text-center text-xs text-ink-500">Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8 text-ink-500" />}
          title={t('jobs.emptyTitle')}
          description={t('jobs.emptyDesc')}
          actionLabel="Show all jobs"
          onAction={() => setFilter('all')}
        />
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const isLoading = actionLoadingId === job.id;

            return (
              <Card key={job.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-ink-900 leading-snug">{job.title}</h2>
                    <div className="flex items-center text-xs text-ink-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-brand-700 shrink-0" />
                      <span>{job.area}</span>
                      <span className="mx-1.5">•</span>
                      <span>{job.distanceKm} km away</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-bold text-brand-700 flex items-center justify-end">
                      <span>{t('jobs.estValue', { value: job.estValue })}</span>
                    </div>
                    <span className="text-[11px] text-ink-500">
                      {t('jobs.estKg', { kg: job.estKg })}
                    </span>
                  </div>
                </div>

                {/* Materials Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {job.materials.map((mat) => (
                    <span
                      key={mat}
                      className="px-2 py-0.5 rounded-md bg-ink-100 text-[11px] font-medium text-ink-900 flex items-center"
                    >
                      <Package className="w-3 h-3 mr-1 text-ink-500" />
                      {mat}
                    </span>
                  ))}
                  <span className="text-[11px] text-ink-500 ml-auto">
                    {t('jobs.postedBy', { poster: job.postedBy })}
                  </span>
                </div>

                {/* Actions & Status */}
                <div className="pt-2 border-t border-ink-100 flex items-center justify-between">
                  <div>
                    {job.status === 'completed' && (
                      <span className="inline-flex items-center text-xs font-bold text-brand-700 bg-brand-100 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Completed
                      </span>
                    )}
                    {job.status === 'accepted' && (
                      <span className="inline-flex items-center text-xs font-semibold text-info-600 bg-info-100 px-2 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {t('jobs.accepted')}
                      </span>
                    )}
                  </div>

                  {job.status === 'available' && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs font-bold"
                      isLoading={isLoading}
                      onClick={() => handleAccept(job.id)}
                    >
                      {t('jobs.acceptJob')}
                    </Button>
                  )}

                  {job.status === 'accepted' && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs font-bold bg-brand-500 hover:bg-brand-700"
                      isLoading={isLoading}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      onClick={() => handleMarkDone(job.id)}
                    >
                      {t('jobs.markDone')} (+₹{job.estValue})
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
