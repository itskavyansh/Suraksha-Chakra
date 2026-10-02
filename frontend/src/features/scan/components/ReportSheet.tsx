import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, MapPin } from 'lucide-react';
import api from '../../../data/api';
import { useAppStore } from '../../../store/useAppStore';
import { useToast } from '../../../components/ui/Toast';
import type { ClassificationResult } from '../../../types';

interface ReportSheetProps {
  isOpen: boolean;
  result: ClassificationResult;
  thumb: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

function requestPosition(timeout: number): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout,
      maximumAge: 60000,
    });
  });
}

const ReportSheet: React.FC<ReportSheetProps> = ({
  isOpen,
  result,
  thumb,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { user } = useAppStore();
  const [includeLocation, setIncludeLocation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    let lat: number | null = null;
    let lng: number | null = null;
    let locationOk = false;

    if (includeLocation) {
      try {
        const pos = await requestPosition(6000);
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        locationOk = true;
      } catch {
        // Location denied or timed out — proceed without
      }
    }

    try {
      await api.submitHazardReport({
        category: result.category,
        confidence: result.confidence,
        label: result.label,
        lat,
        lng,
        imageThumb: thumb,
        workerId: user?.id ?? 'demo',
      });

      const msg =
        includeLocation && !locationOk
          ? t('scan.report.success_no_location')
          : t('scan.report.success');
      showToast(msg, 'success');
      onSuccess();
      onClose();
    } catch {
      showToast(t('scan.errors.classify_failed'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[150]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-3xl z-[160] p-6 pb-8 shadow-2xl"
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-ink-100 mx-auto mb-4" aria-hidden="true" />

        <div className="flex items-center justify-between mb-4">
          <h2 id="report-title" className="text-lg font-bold text-ink-900">
            {t('scan.report.title')}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-ink-100 transition-colors"
          >
            <X className="w-5 h-5 text-ink-500" aria-hidden="true" />
          </button>
        </div>

        {/* Summary */}
        <div className="bg-danger-100 rounded-xl p-3 mb-4 flex items-center gap-3">
          {thumb && (
            <img
              src={thumb}
              alt={result.label}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div>
            <p className="text-xs text-danger-700 font-semibold uppercase tracking-wide">
              {result.category}
            </p>
            <p className="text-ink-900 font-bold text-sm">{result.label}</p>
            <p className="text-xs text-ink-500">
              {Math.round(result.confidence * 100)}% confidence
            </p>
          </div>
        </div>

        {/* Location toggle */}
        <label className="flex items-center gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={includeLocation}
            onChange={(e) => setIncludeLocation(e.target.checked)}
            className="w-5 h-5 accent-brand-700 cursor-pointer"
          />
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-ink-500" aria-hidden="true" />
            <span className="text-sm font-medium text-ink-900">
              {t('scan.report.include_location')}
            </span>
          </div>
        </label>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 min-h-[48px] border border-ink-100 text-ink-900 font-semibold rounded-xl hover:bg-ink-100 active:scale-95 transition-all disabled:opacity-50"
          >
            {t('scan.report.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 min-h-[48px] bg-danger-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-800 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            )}
            {t('scan.report.confirm')}
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportSheet;
