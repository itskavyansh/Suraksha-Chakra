import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import CameraView from './components/CameraView';
import SamplePicker from './components/SamplePicker';
import AnalyzingView from './components/AnalyzingView';
import ResultView from './components/ResultView';
import ReportSheet from './components/ReportSheet';
import { getClassifier } from './classifier';
import { preload, useModelStatusStore } from './classifier/modelStatus';
import { loadImageFromFile, processSource } from './imageUtils';
import { useToast } from '../../components/ui/Toast';
import { useSpeech } from './hooks/useSpeech';
import { useAppStore } from '../../store/useAppStore';
import type { ClassificationResult } from '../../types';

type ScanState = 'capture' | 'analyzing' | 'result';

const MIN_ANALYZE_MS = 600;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

const ScanPage: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { stop: stopSpeech } = useSpeech();
  const { user, setDemoUser } = useAppStore();
  const { status: modelStatus, progress: modelProgress } = useModelStatusStore();
  const prevStatusRef = useRef(modelStatus);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [scanState, setScanState] = useState<ScanState>('capture');
  const [capturedCanvas, setCapturedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [capturedThumb, setCapturedThumb] = useState<string | null>(null);
  const [captureHint, setCaptureHint] = useState<string | undefined>(undefined);
  const [fallbackSampleHint, setFallbackSampleHint] = useState<string | undefined>(undefined);
  const [classResult, setClassResult] = useState<ClassificationResult | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Preload model on mount if idle
  useEffect(() => {
    if (useModelStatusStore.getState().status === 'idle') {
      preload();
    }
  }, []);

  // Show toast if model loading fails
  useEffect(() => {
    if (prevStatusRef.current !== 'error' && modelStatus === 'error') {
      showToast(t('scan.errors.model_load_failed'), 'info');
    }
    prevStatusRef.current = modelStatus;
  }, [modelStatus, showToast, t]);

  // Run classifier when entering analyzing state
  useEffect(() => {
    if (scanState !== 'analyzing' || !capturedCanvas) return;
    let cancelled = false;

    const run = async () => {
      setAnalyzeError(null);
      const start = Date.now();

      // If model is still loading in background, wait for it without blocking with a modal
      if (useModelStatusStore.getState().status === 'loading') {
        await new Promise<void>((resolve) => {
          const unsub = useModelStatusStore.subscribe((state) => {
            if (state.status !== 'loading') {
              unsub();
              resolve();
            }
          });
        });
      }

      if (cancelled) return;

      const currentStatus = useModelStatusStore.getState().status;
      const classifier = getClassifier();

      // Determine hint: if sample missing, captureHint is set.
      // If model failed, use fallbackSampleHint for sample images.
      const effectiveHint =
        captureHint || (currentStatus === 'error' ? fallbackSampleHint : undefined);

      try {
        const result = await classifier.classify(capturedCanvas, effectiveHint);
        const elapsed = Date.now() - start;
        const wait = Math.max(0, MIN_ANALYZE_MS - elapsed);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));

        if (!cancelled) {
          setClassResult(result);
          setScanState('result');
        }
      } catch {
        if (!cancelled) {
          setAnalyzeError('error');
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [scanState, capturedCanvas, captureHint, fallbackSampleHint]);

  const handleCapture = useCallback(
    (canvas: HTMLCanvasElement, thumb: string, hint?: string, fallbackHint?: string) => {
      setCapturedCanvas(canvas);
      setCapturedThumb(thumb);
      setCaptureHint(hint);
      setFallbackSampleHint(fallbackHint);
      setScanState('analyzing');
    },
    [],
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      showToast(t('scan.errors.upload_not_image'), 'error');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      showToast(t('scan.errors.upload_too_large'), 'error');
      return;
    }
    try {
      const img = await loadImageFromFile(file);
      const { canvas, thumb } = processSource(img);
      handleCapture(canvas, thumb, undefined, undefined);
    } catch {
      showToast(t('scan.errors.classify_failed'), 'error');
    }
  };

  const handleReset = useCallback(() => {
    stopSpeech();
    setScanState('capture');
    setCapturedCanvas(null);
    setCapturedThumb(null);
    setCaptureHint(undefined);
    setFallbackSampleHint(undefined);
    setClassResult(null);
    setAnalyzeError(null);
    setIsReportOpen(false);
  }, [stopSpeech]);

  const handleReportSuccess = useCallback(() => {
    if (user) {
      const updated = { ...user, safetyScore: Math.min(100, user.safetyScore + 5) };
      setDemoUser(updated);
    }
  }, [user, setDemoUser]);

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-ink-900">{t('pages.scan')}</h2>

        {/* AI Status Chip */}
        <div className="flex items-center">
          {modelStatus === 'loading' && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium animate-pulse"
              role="status"
              aria-live="polite"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>{t('scan.status.loading', { progress: modelProgress })}</span>
            </div>
          )}
          {modelStatus === 'ready' && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium"
              role="status"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t('scan.status.ready')}</span>
            </div>
          )}
          {modelStatus === 'error' && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-100 border border-ink-200 text-ink-700 text-xs font-medium"
              role="status"
            >
              <span className="w-2 h-2 rounded-full bg-ink-500" />
              <span>{t('scan.status.unavailable')}</span>
            </div>
          )}
        </div>
      </div>

      {scanState === 'capture' && (
        <div className="flex flex-col gap-4">
          <CameraView onCapture={(c, th) => handleCapture(c, th, undefined, undefined)} />

          {/* Upload buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 min-h-[44px] border border-ink-100 text-ink-900 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-ink-100 active:scale-95 transition-all text-sm"
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              {t('scan.upload_photo')}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-hidden="true"
            onChange={handleUpload}
          />

          <SamplePicker
            onSelect={(c, th, hint, fallbackHint) => handleCapture(c, th, hint, fallbackHint)}
            disabled={false}
          />
        </div>
      )}

      {scanState === 'analyzing' && (
        <AnalyzingView
          thumb={capturedThumb}
          error={analyzeError}
          onRetry={handleReset}
          isModelLoading={modelStatus === 'loading'}
          modelProgress={modelProgress}
        />
      )}

      {scanState === 'result' && classResult && (
        <>
          <ResultView
            result={classResult}
            thumb={capturedThumb}
            onScanAnother={handleReset}
            onReportHazard={() => setIsReportOpen(true)}
          />
          <ReportSheet
            isOpen={isReportOpen}
            result={classResult}
            thumb={capturedThumb}
            onClose={() => setIsReportOpen(false)}
            onSuccess={handleReportSuccess}
          />
        </>
      )}
    </PageContainer>
  );
};

export default ScanPage;
