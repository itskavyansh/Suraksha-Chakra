import type { ClassificationResult } from '../../../types';
import type { Classifier } from './types';
import { decide } from './decision';
import { requestClassification, useModelStatusStore } from './modelStatus';
import { MockClassifier } from './mockClassifier';

export class ModelClassifier implements Classifier {
  private mockFallback = new MockClassifier();

  async classify(
    input: ImageBitmap | HTMLCanvasElement,
    hint?: string,
  ): Promise<ClassificationResult> {
    const status = useModelStatusStore.getState().status;

    // If hint is passed (e.g. sample image missing or mock fallback), use mock directly
    if (hint) {
      return this.mockFallback.classify(input, hint);
    }

    // If model has error state and no hint, return safe unknown
    if (status === 'error') {
      return {
        category: 'unknown',
        confidence: 0.3,
        source: 'model',
        label: 'Unidentified item',
      };
    }

    try {
      const blob = await this.toJpegBlob(input);
      const scores = await requestClassification(blob);
      return decide(scores);
    } catch (err) {
      console.error('ModelClassifier inference error:', err);
      // Safe fallback on inference failure
      return {
        category: 'unknown',
        confidence: 0.3,
        source: 'model',
        label: 'Unidentified item',
      };
    }
  }

  private async toJpegBlob(input: ImageBitmap | HTMLCanvasElement): Promise<Blob> {
    let canvas: HTMLCanvasElement;
    if (input instanceof HTMLCanvasElement) {
      canvas = input;
    } else {
      canvas = document.createElement('canvas');
      canvas.width = input.width;
      canvas.height = input.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2D canvas context');
      ctx.drawImage(input, 0, 0);
    }

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create JPEG blob from canvas'));
        },
        'image/jpeg',
        0.85,
      );
    });
  }
}
