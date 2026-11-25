import { ClassificationResult, HazardCategory } from '@/types';
import { CANONICAL_PROMPTS } from './modelConfig';
import { evaluateModelScores } from './decision';
import { useModelStatusStore } from './modelStatus';
import { mockClassifier } from './classifier';

let worker: Worker | null = null;
let reqCounter = 0;
const pendingRequests = new Map<
  number,
  { resolve: (data: { score: number; label: string }[]) => void; reject: (err: Error) => void }
>();

function getWorker(): Worker | null {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    return null;
  }

  if (!worker) {
    try {
      worker = new Worker(new URL('./clip.worker.ts', import.meta.url), { type: 'module' });

      worker.onmessage = (event: MessageEvent) => {
        const { type, id, data, progress, error } = event.data || {};
        const { setStatus } = useModelStatusStore.getState();

        if (type === 'progress') {
          setStatus('loading', progress);
        } else if (type === 'ready') {
          setStatus('ready', 100);
        } else if (type === 'error' && !id) {
          setStatus('error', 0, error);
        } else if (type === 'result' && id && pendingRequests.has(id)) {
          const { resolve } = pendingRequests.get(id)!;
          pendingRequests.delete(id);
          resolve(data);
        } else if (type === 'error' && id && pendingRequests.has(id)) {
          const { reject } = pendingRequests.get(id)!;
          pendingRequests.delete(id);
          reject(new Error(error || 'Worker error'));
        }
      };

      worker.onerror = (err) => {
        useModelStatusStore.getState().setStatus('error', 0, err.message);
      };

      // Trigger model preloading
      worker.postMessage({ type: 'load' });
    } catch {
      worker = null;
    }
  }

  return worker;
}

export const modelClassifier = {
  preload(): void {
    getWorker();
  },

  async classifyImage(
    source: HTMLCanvasElement | ImageData | string,
    hint?: string
  ): Promise<ClassificationResult> {
    const w = getWorker();
    if (!w) {
      return mockClassifier.classifyImage(source, hint);
    }

    try {
      let imageUrl: string;
      if (typeof source === 'string') {
        imageUrl = source;
      } else if (source instanceof HTMLCanvasElement) {
        imageUrl = source.toDataURL('image/jpeg', 0.85);
      } else {
        // ImageData to temporary canvas
        const canvas = document.createElement('canvas');
        canvas.width = source.width;
        canvas.height = source.height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.putImageData(source, 0, 0);
        imageUrl = canvas.toDataURL('image/jpeg', 0.85);
      }

      const candidateLabels = CANONICAL_PROMPTS.map((p) => p.prompt);
      const reqId = ++reqCounter;

      const rawResults = await new Promise<{ score: number; label: string }[]>((resolve, reject) => {
        pendingRequests.set(reqId, { resolve, reject });
        w.postMessage({
          type: 'classify',
          id: reqId,
          payload: { image: imageUrl, labels: candidateLabels },
        });

        // 15 second timeout safety net
        setTimeout(() => {
          if (pendingRequests.has(reqId)) {
            pendingRequests.delete(reqId);
            reject(new Error('Classification timeout'));
          }
        }, 15000);
      });

      // Aggregate category masses
      const categoryMasses: Record<HazardCategory, number> = {
        sharps: 0,
        glass: 0,
        batteries: 0,
        chemicals: 0,
        medical: 0,
        general: 0,
        unknown: 0,
      };

      let topScore = -1;
      let topUserLabel = 'Unidentified Item';

      for (const res of rawResults) {
        const found = CANONICAL_PROMPTS.find((p) => p.prompt === res.label);
        if (found) {
          categoryMasses[found.category] = (categoryMasses[found.category] || 0) + res.score;
          if (res.score > topScore) {
            topScore = res.score;
            topUserLabel = found.label;
          }
        }
      }

      return evaluateModelScores(categoryMasses, topUserLabel);
    } catch {
      // Graceful fallback to mock classifier
      return mockClassifier.classifyImage(source, hint);
    }
  },
};
