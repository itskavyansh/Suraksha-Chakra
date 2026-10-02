import { create } from 'zustand';
import { MODEL_LOAD_TIMEOUT_MS, type PromptScore } from './modelConfig';

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

interface ModelStatusState {
  status: ModelStatus;
  progress: number; // 0..100
  errorMessage: string | null;
  setStatus: (status: ModelStatus, errorMessage?: string | null) => void;
  setProgress: (progress: number) => void;
}

export const useModelStatusStore = create<ModelStatusState>((set) => ({
  status: 'idle',
  progress: 0,
  errorMessage: null,
  setStatus: (status, errorMessage = null) =>
    set((state) => ({
      status,
      errorMessage,
      progress: status === 'ready' ? 100 : state.progress,
    })),
  setProgress: (progress) =>
    set({
      progress: Math.max(0, Math.min(100, Math.round(progress))),
    }),
}));

// Worker singleton and request registry
let workerInstance: Worker | null = null;
let loadTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
const pendingRequests = new Map<
  string,
  {
    resolve: (scores: PromptScore[]) => void;
    reject: (err: Error) => void;
  }
>();

export function getOrCreateWorker(): Worker {
  if (workerInstance) return workerInstance;

  workerInstance = new Worker(new URL('./clip.worker.ts', import.meta.url), {
    type: 'module',
  });

  workerInstance.onmessage = (e: MessageEvent) => {
    const { type, id, scores, progress, error } = e.data || {};

    if (type === 'progress') {
      if (typeof progress === 'number') {
        useModelStatusStore.getState().setProgress(progress);
      }
    } else if (type === 'ready') {
      if (loadTimeoutTimer) {
        clearTimeout(loadTimeoutTimer);
        loadTimeoutTimer = null;
      }
      useModelStatusStore.getState().setStatus('ready');
    } else if (type === 'error') {
      if (loadTimeoutTimer) {
        clearTimeout(loadTimeoutTimer);
        loadTimeoutTimer = null;
      }
      useModelStatusStore.getState().setStatus('error', error || 'Failed to load AI model');
    } else if (type === 'classify_result') {
      const handler = pendingRequests.get(id);
      if (handler) {
        pendingRequests.delete(id);
        handler.resolve(scores || []);
      }
    } else if (type === 'classify_error') {
      const handler = pendingRequests.get(id);
      if (handler) {
        pendingRequests.delete(id);
        handler.reject(new Error(error || 'Classification failed'));
      }
    }
  };

  workerInstance.onerror = (err) => {
    if (loadTimeoutTimer) {
      clearTimeout(loadTimeoutTimer);
      loadTimeoutTimer = null;
    }
    useModelStatusStore.getState().setStatus('error', err.message || 'Worker runtime error');
  };

  return workerInstance;
}

function startModelLoad(): void {
  const currentStatus = useModelStatusStore.getState().status;
  if (currentStatus === 'loading' || currentStatus === 'ready') {
    return; // Idempotent
  }

  useModelStatusStore.getState().setStatus('loading', null);
  useModelStatusStore.getState().setProgress(0);

  const worker = getOrCreateWorker();
  worker.postMessage({ type: 'init' });

  // Timeout guard
  if (loadTimeoutTimer) {
    clearTimeout(loadTimeoutTimer);
  }
  loadTimeoutTimer = setTimeout(() => {
    const status = useModelStatusStore.getState().status;
    if (status === 'loading') {
      useModelStatusStore
        .getState()
        .setStatus('error', `Model load timed out after ${MODEL_LOAD_TIMEOUT_MS / 1000}s`);
    }
  }, MODEL_LOAD_TIMEOUT_MS);
}

/**
 * Preload the model in the background.
 * Idempotent: calling it multiple times will not re-initiate loading.
 * Uses requestIdleCallback with a setTimeout fallback.
 */
export function preload(): void {
  const schedule =
    typeof window !== 'undefined' && 'requestIdleCallback' in window
      ? (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 1);

  try {
    schedule(() => {
      startModelLoad();
    });
  } catch {
    startModelLoad();
  }
}

/**
 * Send an image blob to the worker for zero-shot classification scores.
 */
export async function requestClassification(imageBlob: Blob): Promise<PromptScore[]> {
  const worker = getOrCreateWorker();
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // If status is idle, trigger load
  if (useModelStatusStore.getState().status === 'idle') {
    startModelLoad();
  }

  return new Promise<PromptScore[]>((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });
    worker.postMessage({ type: 'classify', id, imageBlob });
  });
}
