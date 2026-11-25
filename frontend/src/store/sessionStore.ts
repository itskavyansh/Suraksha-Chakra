import { create } from 'zustand';
import { Worker } from '@/types';
import { DEMO_WORKER } from '@/data/seed/workers';

const STORAGE_SESSION = 'sc_session';

interface SessionState {
  user: Worker | null;
  isDemo: boolean;
  isLoading: boolean;
  setSession: (user: Worker, isDemo: boolean) => void;
  loginDemoWorker: () => Worker;
  updateUser: (updates: Partial<Worker>) => void;
  logout: () => void;
  initSession: () => void;
}

function getStoredSession(): { user: Worker | null; isDemo: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user) {
        return { user: parsed.user, isDemo: !!parsed.isDemo };
      }
    }
  } catch {
    // Ignore storage errors
  }
  return { user: null, isDemo: false };
}

export const useSessionStore = create<SessionState>((set) => {
  const initial = getStoredSession();

  return {
    user: initial.user,
    isDemo: initial.isDemo,
    isLoading: false,

    setSession: (user: Worker, isDemo: boolean) => {
      try {
        localStorage.setItem(STORAGE_SESSION, JSON.stringify({ user, isDemo }));
      } catch {
        // Ignore
      }
      set({ user, isDemo });
    },

    loginDemoWorker: () => {
      const demoUser = DEMO_WORKER;
      try {
        localStorage.setItem(STORAGE_SESSION, JSON.stringify({ user: demoUser, isDemo: true }));
      } catch {
        // Ignore
      }
      set({ user: demoUser, isDemo: true });
      return demoUser;
    },

    updateUser: (updates: Partial<Worker>) => {
      set((state) => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, ...updates };
        try {
          localStorage.setItem(
            STORAGE_SESSION,
            JSON.stringify({ user: updatedUser, isDemo: state.isDemo })
          );
        } catch {
          // Ignore
        }
        return { user: updatedUser };
      });
    },

    logout: () => {
      try {
        localStorage.removeItem(STORAGE_SESSION);
      } catch {
        // Ignore
      }
      set({ user: null, isDemo: false });
    },

    initSession: () => {
      const session = getStoredSession();
      set({ user: session.user, isDemo: session.isDemo });
    },
  };
});
