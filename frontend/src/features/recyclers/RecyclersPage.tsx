import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Navigation,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Recycler } from '@/types';
import { api } from '@/data/api';

const MATERIALS_LIST = ['All', 'Plastic', 'Metal', 'Paper', 'Glass', 'E-waste'];

export const RecyclersPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const materialParam = searchParams.get('material') || 'All';

  const [recyclers, setRecyclers] = useState<Recycler[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(materialParam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadRecyclers() {
      try {
        const data = await api.getRecyclers();
        if (mounted) {
          setRecyclers(data);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }
    loadRecyclers();
    return () => {
      mounted = false;
    };
  }, []);

  // Sync state with search params if changed externally
  useEffect(() => {
    if (materialParam && materialParam !== selectedMaterial) {
      setSelectedMaterial(materialParam);
    }
  }, [materialParam]);

  const handleSelectMaterial = (mat: string) => {
    setSelectedMaterial(mat);
    if (mat === 'All') {
      searchParams.delete('material');
    } else {
      searchParams.set('material', mat);
    }
    setSearchParams(searchParams);
  };

  const filteredRecyclers = recyclers.filter((rec) => {
    if (selectedMaterial === 'All') return true;
    return rec.materials.some((m) => m.toLowerCase().includes(selectedMaterial.toLowerCase()));
  });

  const handleOpenDirections = (mapQuery: string) => {
    try {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // Ignore if popup blocked
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-700" />
            <span>{t('recyclers.title')}</span>
          </h1>
          <p className="text-xs text-ink-500 mt-0.5">{t('recyclers.subtitle')}</p>
        </div>
        <Badge variant="sample" />
      </div>

      {/* Material Filter Chips */}
      <div>
        <label className="text-[11px] font-semibold text-ink-500 mb-1.5 block">
          {t('recyclers.filterMaterial')}
        </label>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {MATERIALS_LIST.map((mat) => {
            const isSelected = selectedMaterial.toLowerCase() === mat.toLowerCase();
            return (
              <button
                key={mat}
                type="button"
                onClick={() => handleSelectMaterial(mat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'bg-ink-100 text-ink-900 hover:bg-ink-100/80'
                }`}
              >
                {mat === 'All' ? t('recyclers.allMaterials') : mat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recyclers List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-ink-500">Loading verified recyclers...</div>
      ) : filteredRecyclers.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8 text-ink-500" />}
          title="No recyclers found"
          description="Try selecting a different material filter."
          actionLabel="Show all recyclers"
          onAction={() => handleSelectMaterial('All')}
        />
      ) : (
        <div className="space-y-3">
          {filteredRecyclers.map((rec) => (
            <Card key={rec.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-sm font-bold text-ink-900">{rec.name}</h2>
                    {rec.isVerified && (
                      <span className="inline-flex items-center text-[10px] font-bold text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded-md">
                        <ShieldCheck className="w-3 h-3 mr-0.5" />
                        {t('recyclers.verifiedBadge')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-xs text-ink-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-brand-700 shrink-0" />
                    <span>{rec.area}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-ink-500 flex items-center justify-end">
                    <Clock className="w-3 h-3 mr-1" />
                    {rec.hours}
                  </span>
                </div>
              </div>

              {/* Accepted Materials */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {rec.materials.map((mat) => (
                  <span
                    key={mat}
                    className="px-2 py-0.5 rounded-md bg-ink-100 text-[11px] font-medium text-ink-900 flex items-center"
                  >
                    <Package className="w-3 h-3 mr-1 text-ink-500" />
                    {mat}
                  </span>
                ))}
              </div>

              {/* Buying Rates Preview */}
              {rec.rates && Object.keys(rec.rates).length > 0 && (
                <div className="p-2.5 rounded-xl bg-ink-100/40 border border-ink-100 space-y-1">
                  <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider block">
                    {t('recyclers.rates')}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {Object.entries(rec.rates).map(([matKey, rate]) => (
                      <div key={matKey} className="flex items-center justify-between">
                        <span className="text-ink-500 capitalize">{matKey}:</span>
                        <span className="font-bold text-brand-700">₹{rate.min}–₹{rate.max}/kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-ink-100 flex items-center space-x-2">
                <a
                  href={`tel:${rec.phone}`}
                  className="flex-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full border border-ink-100 text-xs text-brand-700 font-bold"
                    leftIcon={<Phone className="w-3.5 h-3.5" />}
                  >
                    Call ({rec.phone})
                  </Button>
                </a>

                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs font-bold"
                  leftIcon={<Navigation className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenDirections(rec.mapQuery)}
                >
                  Directions
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
