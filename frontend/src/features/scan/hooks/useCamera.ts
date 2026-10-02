import { useRef, useState, useCallback, useEffect } from 'react';
import { processSource } from '../imageUtils';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isReady: boolean;
  isStarting: boolean;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureFrame: () => { canvas: HTMLCanvasElement; thumb: string } | null;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch {
      // ignore
    }
    setIsReady(false);
  }, []);

  // Stop camera on unmount
  useEffect(() => () => { stopCamera(); }, [stopCamera]);

  const startCamera = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new DOMException('getUserMedia not supported', 'NotSupportedError');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
        setIsReady(true);
      } else {
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {
      const err = e instanceof DOMException ? e : new Error('Camera unavailable');
      // Map DOMException names to a simple error key the UI will translate
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('denied');
      } else {
        setError('unavailable');
      }
    } finally {
      setIsStarting(false);
    }
  }, []);

  const captureFrame = useCallback((): { canvas: HTMLCanvasElement; thumb: string } | null => {
    const video = videoRef.current;
    if (!video || !isReady || video.videoWidth === 0) return null;
    try {
      const result = processSource(video);
      stopCamera();
      return result;
    } catch {
      return null;
    }
  }, [isReady, stopCamera]);

  return { videoRef, isReady, isStarting, error, startCamera, stopCamera, captureFrame };
}
