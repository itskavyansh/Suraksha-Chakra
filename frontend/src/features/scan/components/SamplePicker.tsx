import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, Scissors, Zap, Droplets, Plus, Leaf, HelpCircle, Camera,
} from 'lucide-react';
import { processSource, loadImageFromUrl } from '../imageUtils';

interface SampleItem {
  id: string;
  labelKey: string;
  placeholderIcon: React.ElementType;
}

const SAMPLES: SampleItem[] = [
  { id: 'needle', labelKey: 'scan.samples.needle', placeholderIcon: AlertTriangle },
  { id: 'broken-glass', labelKey: 'scan.samples.broken_glass', placeholderIcon: Scissors },
  { id: 'battery', labelKey: 'scan.samples.battery', placeholderIcon: Zap },
  { id: 'chemical-can', labelKey: 'scan.samples.chemical_can', placeholderIcon: Droplets },
  { id: 'medical', labelKey: 'scan.samples.medical', placeholderIcon: Plus },
  { id: 'bottle', labelKey: 'scan.samples.bottle', placeholderIcon: Leaf },
  { id: 'cardboard', labelKey: 'scan.samples.cardboard', placeholderIcon: Camera },
  { id: 'unknown-item', labelKey: 'scan.samples.unknown_item', placeholderIcon: HelpCircle },
];

interface SampleTileProps {
  item: SampleItem;
  onSelect: (canvas: HTMLCanvasElement, thumb: string, hint?: string, fallbackHint?: string) => void;
  disabled: boolean;
}

const SampleTile: React.FC<SampleTileProps> = ({ item, onSelect, disabled }) => {
  const { t } = useTranslation();
  const [imgFailed, setImgFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const Icon = item.placeholderIcon;

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      const img = await loadImageFromUrl(`/samples/${item.id}.jpg`);
      const { canvas, thumb } = processSource(img);
      // Sample jpg loaded successfully -> classify with real model (no hint)
      onSelect(canvas, thumb, undefined, item.id);
    } catch {
      // Image missing — trigger with blank canvas and hint for mock classifier
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#EEF1EF';
        ctx.fillRect(0, 0, 640, 480);
      }
      const thumb = canvas.toDataURL('image/jpeg', 0.5);
      onSelect(canvas, thumb, item.id, item.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={t(item.labelKey)}
      className="flex-shrink-0 flex flex-col items-center gap-1.5 w-20 disabled:opacity-60"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-ink-100 relative flex items-center justify-center border border-ink-100 hover:border-brand-500 transition-colors active:scale-95">
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
            <span className="w-5 h-5 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        {imgFailed ? (
          <Icon className="w-8 h-8 text-ink-500" aria-hidden="true" />
        ) : (
          <img
            src={`/samples/${item.id}.jpg`}
            alt={t(item.labelKey)}
            className="w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
      <span className="text-xs text-ink-500 font-medium text-center leading-tight w-full">
        {t(item.labelKey)}
      </span>
    </button>
  );
};

interface SamplePickerProps {
  onSelect: (canvas: HTMLCanvasElement, thumb: string, hint?: string, fallbackHint?: string) => void;
  disabled?: boolean;
}

const SamplePicker: React.FC<SamplePickerProps> = ({ onSelect, disabled = false }) => {
  const { t } = useTranslation();
  return (
    <div>
      <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">
        {t('scan.samples.title')}
      </p>
      <div
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
        role="list"
        aria-label={t('scan.samples.title')}
      >
        {SAMPLES.map((s) => (
          <div key={s.id} role="listitem" className="snap-start">
            <SampleTile item={s} onSelect={onSelect} disabled={disabled} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SamplePicker;
