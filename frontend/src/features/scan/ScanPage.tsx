import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  GraduationCap,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';
import { ROUTES } from '@/app/routes';
import { ClassificationResult } from '@/types';
import { getClassifier, CONFIDENCE_THRESHOLD } from './classifier/classifier';
import { modelClassifier } from './classifier/modelClassifier';
import { useModelStatusStore } from './classifier/modelStatus';
import { HAZARD_GUIDANCE } from './guidance';
import { useSpeech } from '@/hooks/useSpeech';
import { useToast } from '@/components/ui/Toast';
import { useSessionStore } from '@/store/sessionStore';
import { api } from '@/data/api';

const SAMPLE_ITEMS = [
  { id: 'needle', caption: 'Needle / Syringe', hint: 'needle' },
  { id: 'broken-glass', caption: 'Broken Glass', hint: 'broken-glass' },
  { id: 'battery', caption: 'Battery', hint: 'battery' },
  { id: 'chemical-can', caption: 'Chemical Can', hint: 'chemical-can' },
  { id: 'medical', caption: 'Medical Waste', hint: 'medical' },
  { id: 'bottle', caption: 'Plastic Bottle', hint: 'bottle' },
  { id: 'cardboard', caption: 'Cardboard', hint: 'cardboard' },
  { id: 'unknown-item', caption: 'Unknown Item', hint: 'unknown-item' },
];

export const ScanPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { speak, stop, isSpeaking } = useSpeech();
  const user = useSessionStore((state) => state.user);
  const updateUser = useSessionStore((state) => state.updateUser);
  const modelStatus = useModelStatusStore((state) => state.status);
  const modelProgress = useModelStatusStore((state) => state.progress);

  useEffect(() => {
    modelClassifier.preload();
  }, []);

  // States: 'capture' | 'analyzing' | 'result'
  const [scanState, setScanState] = useState<'capture' | 'analyzing' | 'result'>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  // Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Report hazard sheet
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Stop camera tracks helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stop();
    };
  }, [stopCamera, stop]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(t('scan.cameraError'));
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError(t('scan.cameraError'));
      stopCamera();
    }
  };

  const processImageToCanvas = (
    imageSource: CanvasImageSource,
    srcWidth: number,
    srcHeight: number,
    hint?: string
  ) => {
    try {
      // Downscale to max 640px longest side
      const maxSide = 640;
      let targetWidth = srcWidth;
      let targetHeight = srcHeight;

      if (srcWidth > maxSide || srcHeight > maxSide) {
        if (srcWidth > srcHeight) {
          targetWidth = maxSide;
          targetHeight = Math.round((srcHeight * maxSide) / srcWidth);
        } else {
          targetHeight = maxSide;
          targetWidth = Math.round((srcWidth * maxSide) / srcHeight);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);

      // Create preview & thumbnail
      const previewUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(previewUrl);

      // Create ~240px thumbnail
      const thumbCanvas = document.createElement('canvas');
      const thumbScale = 240 / Math.max(targetWidth, targetHeight);
      thumbCanvas.width = Math.round(targetWidth * thumbScale);
      thumbCanvas.height = Math.round(targetHeight * thumbScale);
      const thumbCtx = thumbCanvas.getContext('2d');
      if (thumbCtx) {
        thumbCtx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
        setThumbnail(thumbCanvas.toDataURL('image/jpeg', 0.7));
      }

      // Enter analyzing state
      setScanState('analyzing');
      const startTime = Date.now();

      getClassifier()
        .classify(canvas, hint)
        .then((res) => {
          const elapsed = Date.now() - startTime;
          const remainingDelay = Math.max(0, 600 - elapsed);
          setTimeout(() => {
            setResult(res);
            setScanState('result');
          }, remainingDelay);
        })
        .catch(() => {
          showToast('Classification failed. Please try again.', 'error');
          setScanState('capture');
        });
    } catch {
      showToast('Error processing image', 'error');
      setScanState('capture');
    }
  };

  const captureFromVideo = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    processImageToCanvas(video, video.videoWidth || 640, video.videoHeight || 480);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast(t('scan.invalidImage'), 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast(t('scan.fileTooLarge'), 'error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      processImageToCanvas(img, img.naturalWidth, img.naturalHeight);
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      showToast(t('scan.invalidImage'), 'error');
    };
    img.src = objectUrl;
    e.target.value = '';
  };

  const handleSelectSample = (sample: typeof SAMPLE_ITEMS[0]) => {
    stopCamera();
    const img = new Image();
    img.onload = () => {
      processImageToCanvas(img, img.naturalWidth, img.naturalHeight, sample.hint);
    };
    img.onerror = () => {
      // Fallback: draw placeholder on canvas
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0F5C3A';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sample.caption, 200, 150);
      }
      processImageToCanvas(canvas, 400, 300, sample.hint);
    };
    img.src = `/samples/${sample.id}.jpg`;
  };

  const handleResetScan = () => {
    stop();
    setCapturedImage(null);
    setThumbnail(null);
    setResult(null);
    setScanState('capture');
  };

  // Submit hazard report
  const handleConfirmReport = async () => {
    if (!result || !user) return;
    setIsSubmittingReport(true);

    let lat: number | null = null;
    let lng: number | null = null;

    if (includeLocation && typeof navigator !== 'undefined' && navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 });
        });
        lat = parseFloat(pos.coords.latitude.toFixed(5));
        lng = parseFloat(pos.coords.longitude.toFixed(5));
      } catch {
        showToast('GPS unavailable. Submitting report without exact coordinates.', 'info');
      }
    }

    try {
      const { newSafetyScore } = await api.submitHazardReport({
        category: result.category,
        confidence: result.confidence,
        label: result.label,
        lat,
        lng,
        workerId: user.id,
        imageThumb: thumbnail,
      });

      updateUser({ safetyScore: newSafetyScore });
      showToast(t('scan.reportSentToast'), 'success');
      setIsReportOpen(false);
    } catch {
      showToast('Could not submit hazard report.', 'error');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const activeGuidance = result ? HAZARD_GUIDANCE[result.category] || HAZARD_GUIDANCE.unknown : null;
  const isConfidenceLow = !result || result.confidence < CONFIDENCE_THRESHOLD || result.category === 'unknown';
  const isGeneralScrap = result?.category === 'general' && !isConfidenceLow;

  const resultTitle = isGeneralScrap
    ? t('scan.looksSafe')
    : isConfidenceLow
    ? t('scan.unknownHazard')
    : t('scan.hazardDetected');

  const resultBorderColor = isGeneralScrap
    ? 'border-brand-500'
    : isConfidenceLow
    ? 'border-danger-700 ring-2 ring-danger-100'
    : 'border-danger-700';

  const speechText = result && activeGuidance
    ? `${resultTitle}. ${result.label}. ${
        isConfidenceLow ? t('scan.unknownWarning') : ''
      }. ${t('guide.dosTitle')}: ${activeGuidance.dosKeys.map((k) => t(k)).join('. ')}`
    : '';

  const handleListenResult = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(speechText, () => {
        showToast(t('common.speechNotAvailable'), 'info');
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4">
      {/* State A: Capture */}
      {scanState === 'capture' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-ink-900">
                {t('scan.title')}
              </h1>
              <p className="text-xs text-ink-500 mt-0.5">
                {t('scan.subtitle')}
              </p>
            </div>

            {modelStatus === 'loading' ? (
              <span className="inline-flex items-center text-[10px] font-bold text-info-600 bg-info-100 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                {t('scan.aiLoading', { percent: modelProgress })}
              </span>
            ) : modelStatus === 'ready' ? (
              <span className="inline-flex items-center text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 mr-1" />
                {t('scan.aiReady')}
              </span>
            ) : (
              <Badge variant="sample">{t('scan.demoClassifierBadge')}</Badge>
            )}
          </div>

          {/* Camera Viewport with Corner Brackets */}
          <div className="relative w-full aspect-[4/3] rounded-3xl bg-ink-900 overflow-hidden flex items-center justify-center border-2 border-brand-700 shadow-card">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Corner Brackets Overlay */}
                <div className="absolute inset-4 pointer-events-none border-2 border-dashed border-white/50 rounded-2xl flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-t-4 border-l-4 border-brand-500" />
                    <div className="w-5 h-5 border-t-4 border-r-4 border-brand-500" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-b-4 border-l-4 border-brand-500" />
                    <div className="w-5 h-5 border-b-4 border-r-4 border-brand-500" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-white/80">
                <Camera className="w-12 h-12 mb-3 text-brand-500" />
                <p className="text-xs max-w-xs leading-relaxed">
                  {cameraError || 'Tap "Start camera" to capture scrap or choose a photo below.'}
                </p>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="grid grid-cols-2 gap-2.5">
            {!cameraActive ? (
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold shadow-md"
                leftIcon={<Camera className="w-4 h-4" />}
                onClick={startCamera}
              >
                {t('scan.startCamera')}
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full font-bold shadow-md"
                  leftIcon={<Camera className="w-4 h-4" />}
                  onClick={captureFromVideo}
                >
                  {t('scan.takePhoto')}
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full border border-ink-100 bg-white"
                  onClick={stopCamera}
                >
                  {t('scan.stopCamera')}
                </Button>
              </>
            )}

            {/* Gallery Upload & Mobile Capture */}
            <Button
              variant="secondary"
              size="md"
              className={`font-semibold ${cameraActive ? 'col-span-2' : ''}`}
              leftIcon={<Upload className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
            >
              {t('scan.uploadGallery')}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Sample Picker */}
          <div className="pt-2">
            <div className="flex items-center space-x-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-brand-700" />
              <h2 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
                {t('scan.samplePicker')}
              </h2>
            </div>

            <div className="flex space-x-2.5 overflow-x-auto pb-2 no-scrollbar">
              {SAMPLE_ITEMS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="flex-shrink-0 w-24 p-2 bg-white rounded-xl border border-ink-100 shadow-xs hover:border-brand-500 hover:shadow-sm text-center flex flex-col items-center min-h-[44px] transition-all"
                >
                  <div className="w-16 h-14 rounded-lg bg-ink-100/70 overflow-hidden flex items-center justify-center mb-1.5 relative">
                    <img
                      src={`/samples/${sample.id}.jpg`}
                      alt={sample.caption}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <ImageIcon className="w-6 h-6 text-ink-400 absolute pointer-events-none" />
                  </div>
                  <span className="text-[11px] font-semibold text-ink-900 leading-tight line-clamp-2">
                    {sample.caption}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* State B: Analyzing */}
      {scanState === 'analyzing' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="relative w-48 h-48 rounded-3xl overflow-hidden border-2 border-brand-700 shadow-xl bg-black">
            {capturedImage && (
              <img src={capturedImage} alt="Scanning target" className="w-full h-full object-cover opacity-80" />
            )}
            {/* Pulsing scanning beam line */}
            <div className="absolute inset-x-0 h-1 bg-brand-500 shadow-[0_0_15px_#2E9E6B] animate-bounce top-1/2" />
          </div>

          <div>
            <h2 className="text-base font-bold text-ink-900 animate-pulse">
              {t('scan.checkingHazards')}
            </h2>
            <p className="text-xs text-ink-500 mt-1">
              Analyzing photo for toxic chemicals, needles, biohazards & glass...
            </p>
          </div>
        </div>
      )}

      {/* State C: Result */}
      {scanState === 'result' && result && activeGuidance && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Main Classification Result Banner Card */}
          <div className={`p-4 rounded-3xl bg-white border-2 shadow-card ${resultBorderColor}`}>
            <div className="flex items-start space-x-3.5">
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt={result.label}
                  className="w-20 h-20 rounded-2xl object-cover border border-ink-100 flex-shrink-0 shadow-sm"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant={isGeneralScrap ? 'verified' : 'danger'}>
                    {result.source === 'mock'
                      ? t('scan.demoClassifierBadge')
                      : t('scan.aiModelBadge')}
                  </Badge>
                  <span className="text-[11px] font-mono text-ink-500 font-bold">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>

                <h1 className="text-base font-extrabold text-ink-900 leading-tight">
                  {resultTitle}
                </h1>
                <p className="text-xs font-bold text-brand-700 mt-0.5 truncate">
                  {result.label}
                </p>
              </div>
            </div>

            {/* Confidence progress bar */}
            <div className="w-full bg-ink-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isGeneralScrap ? 'bg-brand-500' : 'bg-danger-700'
                }`}
                style={{ width: `${Math.round(result.confidence * 100)}%` }}
              />
            </div>
          </div>

          {/* Danger warning for unknown or low-confidence */}
          {isConfidenceLow && (
            <div className="p-3.5 bg-danger-100/90 border border-danger-700/30 rounded-2xl flex items-start space-x-2.5 text-danger-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block mb-0.5">{t('scan.unknownHazard')}</span>
                <span>{t('scan.unknownWarning')}</span>
              </div>
            </div>
          )}

          {/* Do and Don't Lists */}
          <div className="space-y-3">
            <Card padding="md" className="border-brand-500/30 bg-brand-100/20">
              <h3 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 text-brand-700 mr-1.5" />
                <span>{t('guide.dosTitle')}</span>
              </h3>
              <ul className="space-y-1.5">
                {activeGuidance.dosKeys.map((k) => (
                  <li key={k} className="flex items-start text-xs text-ink-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-1.5 mr-2 flex-shrink-0" />
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card padding="md" className="border-danger-700/30 bg-danger-100/20">
              <h3 className="text-xs font-bold text-danger-700 uppercase tracking-wider mb-2 flex items-center">
                <XCircle className="w-4 h-4 text-danger-700 mr-1.5" />
                <span>{t('guide.dontsTitle')}</span>
              </h3>
              <ul className="space-y-1.5">
                {activeGuidance.dontsKeys.map((k) => (
                  <li key={k} className="flex items-start text-xs text-ink-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger-700 mt-1.5 mr-2 flex-shrink-0" />
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Report hazard (Hidden for general safe scrap) */}
            {!isGeneralScrap && (
              <Button
                variant="danger"
                size="md"
                className="w-full font-bold shadow-sm"
                leftIcon={<Send className="w-4 h-4" />}
                onClick={() => setIsReportOpen(true)}
              >
                {t('scan.reportHazard')}
              </Button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="md"
                className="border border-ink-100 bg-white"
                leftIcon={isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-700" />}
                onClick={handleListenResult}
              >
                {isSpeaking ? t('scan.stop') : t('scan.listen')}
              </Button>

              <Button
                variant="primary"
                size="md"
                className="font-bold shadow-sm"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={handleResetScan}
              >
                {t('scan.scanAnother')}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="border border-ink-100 text-xs bg-white"
                leftIcon={<GraduationCap className="w-3.5 h-3.5 text-brand-700" />}
                onClick={() => navigate(ROUTES.training)}
              >
                {t('scan.viewTraining')}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="border border-ink-100 text-xs bg-white"
                leftIcon={<BookOpen className="w-3.5 h-3.5 text-brand-700" />}
                onClick={() => navigate(ROUTES.guideCategory(result.category))}
              >
                {t('guide.readGuide')}
              </Button>
            </div>

            {/* "I Got Hurt" entry point for dangerous categories */}
            {!isGeneralScrap && (
              <Button
                variant="danger"
                size="sm"
                className="w-full text-xs font-semibold bg-danger-100 text-danger-700 hover:bg-danger-100/80 shadow-none border border-danger-700/30"
                leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-danger-700" />}
                onClick={() => navigate(ROUTES.hurt)}
              >
                {t('guide.gotHurt')}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Hazard Report Confirm Sheet */}
      <Sheet
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title={t('scan.reportModalTitle')}
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-500">
            {t('scan.reportModalDesc')}
          </p>

          {result && (
            <div className="p-3 rounded-xl bg-ink-100/60 border border-ink-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-ink-900">{result.label}</span>
              <span className="font-mono text-danger-700 font-bold uppercase">{result.category}</span>
            </div>
          )}

          <label className="flex items-center space-x-2.5 p-2 bg-brand-100/40 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={includeLocation}
              onChange={(e) => setIncludeLocation(e.target.checked)}
              className="w-4 h-4 rounded text-brand-700 focus:ring-brand-500"
            />
            <div className="flex items-center text-xs font-medium text-brand-900">
              <MapPin className="w-3.5 h-3.5 mr-1 text-brand-700" />
              <span>{t('scan.includeLocation')}</span>
            </div>
          </label>

          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant="ghost"
              className="flex-1 border border-ink-100"
              onClick={() => setIsReportOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              className="flex-1 font-bold"
              isLoading={isSubmittingReport}
              onClick={handleConfirmReport}
            >
              {t('scan.confirmReport')}
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
};
