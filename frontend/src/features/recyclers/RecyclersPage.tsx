import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Phone, Navigation, CheckCircle, AlertCircle } from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import Badge from '../../components/ui/Badge';
import api from '../../data/api';
import type { Recycler } from '../../types';

const RecyclersPage: React.FC = () => {
  const { t } = useTranslation();
  const [recyclers, setRecyclers] = useState<Recycler[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getRecyclers()
      .then((data) => {
        if (active) {
          setRecyclers(data);
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

  // Collect unique materials
  const allMaterials = Array.from(
    new Set(recyclers.flatMap((r) => r.materials.map((m) => m.name))),
  );

  const filteredRecyclers = recyclers.filter((r) => {
    if (selectedMaterial === 'all') return true;
    return r.materials.some((m) => m.name === selectedMaterial);
  });

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 pb-6">
        {/* Header with Sample Data Badge */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink-900">{t('recyclers.title')}</h2>
          <Badge variant="neutral">{t('common.sample_data')}</Badge>
        </div>

        {/* Material Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setSelectedMaterial('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex items-center ${
              selectedMaterial === 'all'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white border border-ink-100 text-ink-700 hover:border-brand-500'
            }`}
          >
            {t('recyclers.filter_all')}
          </button>
          {allMaterials.map((mat) => (
            <button
              key={mat}
              onClick={() => setSelectedMaterial(mat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex items-center ${
                selectedMaterial === mat
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-ink-100 text-ink-700 hover:border-brand-500'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>

        {/* Recycler Cards */}
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="w-6 h-6 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filteredRecyclers.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-ink-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm text-ink-900 leading-snug">
                      {r.name}
                    </h3>
                    {r.verified ? (
                      <Badge variant="brand">
                        <span className="flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3 h-3" />
                          {t('recyclers.verified')}
                        </span>
                      </Badge>
                    ) : (
                      <Badge variant="neutral">
                        <span className="flex items-center gap-1 text-[11px]">
                          <AlertCircle className="w-3 h-3 text-ink-500" />
                          {t('recyclers.unverified')}
                        </span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-ink-500 mt-1">
                    <span className="flex items-center gap-1 font-medium text-ink-700">
                      <MapPin className="w-3.5 h-3.5 text-brand-700 flex-shrink-0" />
                      {r.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-ink-500 flex-shrink-0" />
                      {r.hours}
                    </span>
                  </div>
                </div>

                {/* Materials & Rates */}
                <div>
                  <p className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
                    {t('recyclers.accepts')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.materials.map((m) => {
                      const isHighlighted = selectedMaterial === m.name;
                      return (
                        <span
                          key={m.name}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            isHighlighted
                              ? 'bg-brand-700 text-white shadow-xs'
                              : 'bg-brand-100/70 text-brand-900 border border-brand-200'
                          }`}
                        >
                          {m.name}: ₹{m.rateINRPerKg}/kg
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-ink-50">
                  <a
                    href={`tel:${r.phone}`}
                    className="flex-1 min-h-[44px] bg-brand-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-900 active:scale-95 transition-all text-xs"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t('recyclers.call')} ({r.phone})</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${r.name} ${r.area}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[44px] border border-ink-100 text-ink-900 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-ink-100 active:scale-95 transition-all text-xs"
                  >
                    <Navigation className="w-4 h-4 text-brand-700" />
                    <span>{t('recyclers.directions')}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RecyclersPage;
