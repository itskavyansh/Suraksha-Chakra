import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Worker, Language } from '../types';
import i18n from '../i18n';

interface AppStore {
  user: Worker | null;
  language: Language;
  setDemoUser: (worker: Worker) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
}

// Safe sessionStorage wrapper
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // storage unavailable
    }
  },
  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // storage unavailable
    }
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      language: 'en',

      setDemoUser: (worker: Worker) => set({ user: worker }),

      logout: () => set({ user: null }),

      setLanguage: (lang: Language) => {
        try {
          localStorage.setItem('sc_lang', lang);
        } catch {
          // localStorage unavailable
        }
        i18n.changeLanguage(lang);
        document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
        set({ language: lang });
      },
    }),
    {
      name: 'sc_user_session',
      storage: createJSONStorage(() => safeSessionStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
