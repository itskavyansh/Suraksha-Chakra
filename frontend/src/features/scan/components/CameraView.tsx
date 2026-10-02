import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, ZapOff } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';

interface CameraViewProps {
  onCapture: (canvas: HTMLCanvasElement, thumb: string) => void;
  onFallback?: () => void;
}

/** Scan-frame corner brackets overlay */
const ScanFrame: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="relative w-56 h-56">
      {/* TL */}
      <span className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-white rounded-tl-sm" />
      {/* TR */}
      <span className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-white rounded-tr-sm" />
      {/* BL */}
      <span className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-white rounded-bl-sm" />
      {/* BR */}
      <span className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-white rounded-br-sm" />
      {/* Scan line */}
      <span className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-500 opacity-60 animate-bounce" aria-hidden="true" />
    </div>
  </div>
);

const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const { t } = useTranslation();
  const { videoRef, isReady, isStarting, error, startCamera, captureFrame } = useCamera();
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const handleCapture = () => {
    const result = captureFrame();
    if (result) onCapture(result.canvas, result.thumb);
  };

  // Camera error: show friendly message
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-ink-100 flex items-center justify-center">
          <ZapOff className="w-8 h-8 text-ink-500" aria-hidden="true" />
        </div>
        <p className="text-ink-900 font-semibold text-sm">
          {error === 'denied'
            ? t('scan.camera_denied')
            : t('scan.camera_unavailable')}
        </p>
      </div>
    );
  }

  // Before camera started
  if (!isReady && !isStarting) {
    return (
      <button
        onClick={startCamera}
        className="flex flex-col items-center gap-3 w-full py-10 bg-ink-900 rounded-2xl text-white hover:bg-black active:scale-95 transition-all"
        aria-label={t('scan.start_camera')}
      >
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <Camera className="w-8 h-8" aria-hidden="true" />
        </div>
        <span className="text-base font-semibold">{t('scan.start_camera')}</span>
      </button>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black" ref={videoContainerRef}>
      {isStarting && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        muted
        playsInline
        aria-label={t('scan.camera_preview')}
        className="w-full object-cover"
        style={{ aspectRatio: '3/4', maxHeight: '56vh' }}
      />
      <ScanFrame />
      {isReady && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <button
            onClick={handleCapture}
            aria-label={t('scan.take_photo')}
            className="w-16 h-16 rounded-full bg-white border-4 border-brand-700 shadow-lg active:scale-90 transition-transform flex items-center justify-center hover:bg-brand-100"
          >
            <Camera className="w-7 h-7 text-brand-700" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraView;
