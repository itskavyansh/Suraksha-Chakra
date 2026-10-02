import { env, pipeline } from '@huggingface/transformers';
import {
  CANDIDATE_LABELS,
  MODEL_ID,
  type PromptScore,
} from './modelConfig';

// Configure transformers environment for web worker
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.proxy = false; // Already inside web worker
}
env.useBrowserCache = true;

// Pipeline instance reference
let classifierPromise: Promise<any> | null = null;

// Progress tracking across files
const fileProgress = new Map<string, number>();

function reportProgress(data: any): void {
  if (data?.status === 'progress' && data?.file) {
    fileProgress.set(data.file, data.progress || 0);
    let totalPct = 0;
    for (const val of fileProgress.values()) {
      totalPct += val;
    }
    // Calculate aggregate percentage
    const avg = Math.round(totalPct / Math.max(fileProgress.size, 1));
    const clamped = Math.min(99, Math.max(1, avg));
    self.postMessage({ type: 'progress', progress: clamped });
  } else if (data?.status === 'ready' || data?.status === 'done') {
    // Single file done
  }
}

async function getOrInitClassifier(): Promise<any> {
  if (classifierPromise) return classifierPromise;

  classifierPromise = (async () => {
    try {
      const pipe = await pipeline(
        'zero-shot-image-classification',
        MODEL_ID,
        {
          dtype: 'q8',
          device: 'wasm',
          progress_callback: reportProgress,
        } as any,
      );
      self.postMessage({ type: 'progress', progress: 100 });
      self.postMessage({ type: 'ready' });
      return pipe;
    } catch (err: unknown) {
      classifierPromise = null;
      const errMsg = err instanceof Error ? err.message : String(err);
      self.postMessage({ type: 'error', error: errMsg });
      throw err;
    }
  })();

  return classifierPromise;
}

self.onmessage = async (e: MessageEvent) => {
  const { type, id, imageBlob } = e.data || {};

  if (type === 'init') {
    try {
      await getOrInitClassifier();
    } catch {
      // Error is already posted to parent
    }
    return;
  }

  if (type === 'classify') {
    try {
      const classifier = await getOrInitClassifier();
      const output = await classifier(imageBlob, CANDIDATE_LABELS, {
        hypothesis_template: '{}',
      });

      const scores: PromptScore[] = (output || []).map((item: any) => ({
        prompt: String(item.label),
        score: Number(item.score),
      }));

      self.postMessage({ type: 'classify_result', id, scores });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      self.postMessage({ type: 'classify_error', id, error: errMsg });
    }
  }
};
