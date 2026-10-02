import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, CheckCircle, Package } from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import api from '../../data/api';
import type { Job } from '../../types';

type FilterType = 'all' | 'under_2km' | 'high_value';

const JobsPage: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getJobs()
      .then((data) => {
        if (active) {
          setJobs(data);
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

  const handleAccept = async (id: string) => {
    try {
      const updated = await api.acceptJob(id);
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
    } catch {
      showToast(t('errors.something_wrong'), 'error');
    }
  };

  const handleMarkDone = async (id: string) => {
    try {
      const { job } = await api.markJobDone(id);
      setJobs((prev) => prev.map((j) => (j.id === id ? job : j)));
      showToast(t('jobs.done_success', { amount: job.estValueINR }), 'success');
    } catch {
      showToast(t('errors.something_wrong'), 'error');
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (filter === 'under_2km') return j.distanceKm <= 2.0;
    if (filter === 'high_value') return j.estValueINR >= 200;
    return true;
  });

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 pb-6">
        {/* Header with Sample Data Badge */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink-900">{t('jobs.title')}</h2>
          <Badge variant="neutral">{t('common.sample_data')}</Badge>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {(['all', 'under_2km', 'high_value'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex items-center ${
                filter === f
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-ink-100 text-ink-700 hover:border-brand-500'
              }`}
            >
              {t(`jobs.filters.${f}`)}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="w-6 h-6 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border border-ink-100 rounded-2xl p-8 text-center">
            <Package className="w-10 h-10 text-ink-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-ink-500">{t('jobs.empty')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredJobs.map((j) => (
              <div
                key={j.id}
                className="bg-white border border-ink-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-ink-900 leading-snug">
                      {t(j.titleKey)}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-ink-500 mt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-brand-700" />
                        {j.area}
                      </span>
                      <span>•</span>
                      <span>{j.distanceKm} km</span>
                      <span>•</span>
                      <span>{j.postedAgo}</span>
                    </div>
                  </div>

                  <span className="text-right">
                    <span className="text-base font-extrabold text-brand-700">
                      ₹{j.estValueINR}
                    </span>
                    <span className="block text-[11px] text-ink-500">~{j.estKg} kg</span>
                  </span>
                </div>

                {/* Materials chips */}
                <div className="flex flex-wrap gap-1.5">
                  {j.materials.map((mat) => (
                    <span
                      key={mat}
                      className="px-2 py-0.5 rounded-md bg-ink-100 text-ink-700 text-xs font-medium"
                    >
                      {mat}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-ink-50 text-xs">
                  <span className="text-ink-500">
                    {t('jobs.posted_by', { by: j.postedBy })}
                  </span>

                  <div>
                    {j.status === 'open' && (
                      <button
                        onClick={() => handleAccept(j.id)}
                        className="px-4 py-2 bg-brand-700 text-white font-bold rounded-xl hover:bg-brand-900 active:scale-95 transition-all min-h-[38px]"
                      >
                        {t('jobs.accept')}
                      </button>
                    )}

                    {j.status === 'accepted' && (
                      <div className="flex items-center gap-2">
                        <Badge variant="warn">{t('jobs.accepted')}</Badge>
                        <button
                          onClick={() => handleMarkDone(j.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all min-h-[38px]"
                        >
                          {t('jobs.mark_done')}
                        </button>
                      </div>
                    )}

                    {j.status === 'done' && (
                      <Badge variant="brand">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {t('jobs.done')}
                        </span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default JobsPage;
