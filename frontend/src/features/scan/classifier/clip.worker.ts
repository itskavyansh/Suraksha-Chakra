import { pipeline, env } from '@huggingface/transformers';

// Configure transformers environment for browser execution
env.allowLocalModels = false;
env.useBrowserCache = true;

type ProgressEventData = {
  status?: string;
  progress?: number;
};

type ClassifierFn = (
  image: string | Blob,
  labels: string[]
) => Promise<{ score: number; label: string }[]>;

let classifierPipeline: ClassifierFn | null = null;

async function getPipeline(progressCallback: (prog: ProgressEventData) => void): Promise<ClassifierFn> {
  if (!classifierPipeline) {
    const pipe = await pipeline(
      'zero-shot-image-classification',
      'Xenova/clip-vit-base-patch32',
      { progress_callback: progressCallback }
    );
    classifierPipeline = pipe as unknown as ClassifierFn;
  }
  return classifierPipeline;
}

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, payload, id } = event.data || {};

  if (type === 'load') {
    try {
      await getPipeline((prog) => {
        if (prog && typeof prog.progress === 'number') {
          self.postMessage({ type: 'progress', progress: Math.round(prog.progress) });
        }
      });
      self.postMessage({ type: 'ready' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load model';
      self.postMessage({ type: 'error', error: msg });
    }
    return;
  }

  if (type === 'classify') {
    try {
      const { image, labels } = payload as { image: string; labels: string[] };
      const classifier = await getPipeline((prog) => {
        if (prog && typeof prog.progress === 'number') {
          self.postMessage({ type: 'progress', progress: Math.round(prog.progress) });
        }
      });

      const output = await classifier(image, labels);
      self.postMessage({ type: 'result', id, data: output });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Classification failed';
      self.postMessage({ type: 'error', id, error: msg });
    }
  }
});
