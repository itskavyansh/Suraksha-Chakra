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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [scanState, setScanState] = useState<ScanState>('capture');
  const [capturedCanvas, setCapturedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [capturedThumb, setCapturedThumb] = useState<string | null>(null);
  const [captureHint, setCaptureHint] = useState<string | undefined>(undefined);
  const [classResult, setClassResult] = useState<ClassificationResult | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Run classifier whenever we enter analyzing state
  useEffect(() => {
    if (scanState !== 'analyzing' || !capturedCanvas) return;
    let cancelled = false;

    const run = async () => {
      setAnalyzeError(null);
      const classifier = getClassifier();
      const start = Date.now();
      try {
        const result = await classifier.classify(capturedCanvas, captureHint);
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
    return () => { cancelled = true; };
  }, [scanState, capturedCanvas, captureHint]);

  const handleCapture = useCallback(
    (canvas: HTMLCanvasElement, thumb: string, hint?: string) => {
      setCapturedCanvas(canvas);
      setCapturedThumb(thumb);
      setCaptureHint(hint);
      setScanState('analyzing');
    },
    [],
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be re-selected
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
      handleCapture(canvas, thumb, undefined);
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
    setClassResult(null);
    setAnalyzeError(null);
    setIsReportOpen(false);
  }, [stopSpeech]);

  const handleReportSuccess = useCallback(() => {
    // Increment safetyScore by 5, cap at 100
    if (user) {
      const updated = { ...user, safetyScore: Math.min(100, user.safetyScore + 5) };
      setDemoUser(updated);
    }
  }, [user, setDemoUser]);

  return (
    <PageContainer>
      <h2 className="text-xl font-bold text-ink-900 mb-4">{t('pages.scan')}</h2>

      {scanState === 'capture' && (
        <div className="flex flex-col gap-4">
          <CameraView onCapture={(c, th) => handleCapture(c, th, undefined)} />

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

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-hidden="true"
            onChange={handleUpload}
          />

          <SamplePicker
            onSelect={(c, th, hint) => handleCapture(c, th, hint)}
            disabled={false}
          />
        </div>
      )}

      {scanState === 'analyzing' && (
        <AnalyzingView
          thumb={capturedThumb}
          error={analyzeError}
          onRetry={handleReset}
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
