import { useRef, useState, useCallback, useEffect } from 'react';

interface UseSpeechReturn {
  speak: (text: string, lang: string) => boolean;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useSpeech(): UseSpeechReturn {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const stop = useCallback(() => {
    try {
      if (isSupported) window.speechSynthesis.cancel();
    } catch { /* ignore */ }
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, [isSupported]);

  // Cancel speech on unmount
  useEffect(() => () => { stop(); }, [stop]);

  const speak = useCallback((text: string, lang: string): boolean => {
    if (!isSupported) return false;
    try {
      window.speechSynthesis.cancel();

      let voices = window.speechSynthesis.getVoices();
      // Some browsers load voices asynchronously
      if (voices.length === 0) {
        // Attempt once more after a tick
        voices = window.speechSynthesis.getVoices();
      }

      // If still no voices, we can still attempt — browser may use its default
      if (voices.length === 0 && !window.speechSynthesis.speaking) {
        // No voices loaded yet — can't confirm voice support
        return false;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;

      // Try to find a voice for the language
      const matchExact = voices.find((v) => v.lang === lang);
      const matchPartial = voices.find((v) =>
        v.lang.toLowerCase().startsWith(lang.split('-')[0]),
      );
      if (matchExact) utterance.voice = matchExact;
      else if (matchPartial) utterance.voice = matchPartial;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return false;
    }
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}
