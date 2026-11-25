import { create } from 'zustand';

export type ModelLoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface ModelStatusState {
  status: ModelLoadStatus;
  progress: number;
  error: string | null;
  setStatus: (status: ModelLoadStatus, progress?: number, error?: string | null) => void;
}

export const useModelStatusStore = create<ModelStatusState>((set) => ({
  status: 'idle',
  progress: 0,
  error: null,
  setStatus: (status, progress = 0, error = null) =>
    set({ status, progress, error }),
}));
