import type { ClassificationResult } from '../../../types';

/**
 * The Classifier interface. Phase 3 swaps the implementation.
 * The input is either an ImageBitmap or an HTMLCanvasElement (max 640px side).
 * hint — only present for sample images; used by the mock for deterministic results.
 */
export interface Classifier {
  classify(
    input: ImageBitmap | HTMLCanvasElement,
    hint?: string,
  ): Promise<ClassificationResult>;
}
