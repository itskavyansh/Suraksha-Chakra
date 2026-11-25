import { ClassificationResult } from '@/types';

export const CONFIDENCE_THRESHOLD = 0.6;

export interface Classifier {
  classify: (
    input: HTMLCanvasElement | ImageData | string,
    hint?: string
  ) => Promise<ClassificationResult>;
}

export class MockClassifier implements Classifier {
  async classify(
    _input: HTMLCanvasElement | ImageData | string,
    hint?: string
  ): Promise<ClassificationResult> {
    // Artificial inference delay 700-1100ms
    const delay = 700 + Math.random() * 400;
    await new Promise((res) => setTimeout(res, delay));

    switch (hint) {
      case 'needle':
        return {
          category: 'sharps',
          confidence: 0.92,
          source: 'mock',
          label: 'Needle / Syringe',
        };
      case 'broken-glass':
        return {
          category: 'glass',
          confidence: 0.88,
          source: 'mock',
          label: 'Broken glass',
        };
      case 'battery':
        return {
          category: 'batteries',
          confidence: 0.90,
          source: 'mock',
          label: 'Battery (Li-ion / cell)',
        };
      case 'chemical-can':
        return {
          category: 'chemicals',
          confidence: 0.85,
          source: 'mock',
          label: 'Chemical container',
        };
      case 'medical':
        return {
          category: 'medical',
          confidence: 0.87,
          source: 'mock',
          label: 'Medical waste',
        };
      case 'bottle':
        return {
          category: 'general',
          confidence: 0.94,
          source: 'mock',
          label: 'Plastic bottle',
        };
      case 'cardboard':
        return {
          category: 'general',
          confidence: 0.91,
          source: 'mock',
          label: 'Cardboard',
        };
      case 'unknown-item':
        return {
          category: 'unknown',
          confidence: 0.31,
          source: 'mock',
          label: 'Unidentified item',
        };
      default:
        // Arbitrary camera or gallery upload with no sample hint
        return {
          category: 'unknown',
          confidence: 0.30,
          source: 'mock',
          label: 'Unidentified item',
        };
    }
  }
}

// Global classifier provider (Later: swap to the real model in Stage 11)
let activeClassifier: Classifier = new MockClassifier();

export function setClassifier(c: Classifier): void {
  activeClassifier = c;
}

export function getClassifier(): Classifier {
  return activeClassifier;
}
