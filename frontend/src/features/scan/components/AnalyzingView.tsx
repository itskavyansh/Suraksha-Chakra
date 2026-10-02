import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScanLine } from 'lucide-react';

interface AnalyzingViewProps {
  thumb: string | null;
  error: string | null;
  onRetry: () => void;
  isModelLoading?: boolean;
  modelProgress?: number;
}

const AnalyzingView: React.FC<AnalyzingViewProps> = ({
  thumb,
  error,
  onRetry,
  isModelLoading = false,
  modelProgress = 0,
}) => {
  const { t } = useTranslation();

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 px-4 text-center">
        {thumb && (
          <img
            src={thumb}
            alt="Captured"
            className="w-40 h-40 rounded-2xl object-cover opacity-50"
          />
        )}
        <p className="text-danger-700 font-semibold">{t('scan.errors.classify_failed')}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-brand-700 text-white font-semibold rounded-xl min-h-[44px] hover:bg-brand-900 active:scale-95 transition-all"
        >
          {t('scan.errors.try_again')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      {/* Captured image with pulse */}
      <div className="relative w-full max-w-xs">
        {thumb ? (
          <img
            src={thumb}
            alt={t('scan.analyzing')}
            className="w-full rounded-2xl object-cover animate-pulse"
            style={{ maxHeight: '240px' }}
          />
        ) : (
          <div className="w-full h-48 rounded-2xl bg-ink-100 animate-pulse" />
        )}
        {/* Scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20">
          <div className="flex flex-col items-center gap-2">
            <ScanLine className="w-10 h-10 text-white animate-bounce" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 max-w-xs w-full text-center">
        <div className="flex items-center gap-3">
          <span
            className="w-5 h-5 border-2 border-brand-700 border-t-transparent rounded-full animate-spin flex-shrink-0"
            aria-hidden="true"
          />
          <p className="text-ink-900 font-semibold text-base" aria-live="polite">
            {isModelLoading
              ? t('scan.analyzing_model_loading', { progress: modelProgress })
              : t('scan.analyzing')}
          </p>
        </div>

        {isModelLoading && (
          <div className="w-full bg-ink-100 h-2 rounded-full overflow-hidden mt-1">
            <div
              className="bg-brand-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${modelProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzingView;
