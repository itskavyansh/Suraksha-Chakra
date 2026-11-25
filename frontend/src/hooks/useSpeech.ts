import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export interface UseSpeechReturn {
  speak: (text: string, onUnavailable?: () => void) => void;
  stop: () => void;
  isSpeaking: boolean;
}

export function useSpeech(): UseSpeechReturn {
  const { i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // Ignore
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, onUnavailable?: () => void) => {
      try {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
          onUnavailable?.();
          return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.95;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
          setIsSpeaking(false);
          onUnavailable?.();
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
        onUnavailable?.();
      }
    },
    [i18n.language]
  );

  // Stop on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { speak, stop, isSpeaking };
}
