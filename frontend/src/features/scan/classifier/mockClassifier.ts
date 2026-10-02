import type { Classifier } from './types';
import type { ClassificationResult, HazardCategory } from '../../../types';

interface MockEntry {
  category: HazardCategory;
  confidence: number;
  label: string;
}

const HINT_MAP: Record<string, MockEntry> = {
  needle: { category: 'sharps', confidence: 0.92, label: 'Needle / Syringe' },
  'broken-glass': { category: 'glass', confidence: 0.88, label: 'Broken glass' },
  battery: { category: 'batteries', confidence: 0.90, label: 'Battery (Li-ion / cell)' },
  'chemical-can': { category: 'chemicals', confidence: 0.85, label: 'Chemical container' },
  medical: { category: 'medical', confidence: 0.87, label: 'Medical waste' },
  bottle: { category: 'general', confidence: 0.94, label: 'Plastic bottle' },
  cardboard: { category: 'general', confidence: 0.91, label: 'Cardboard' },
  'unknown-item': { category: 'unknown', confidence: 0.31, label: 'Unidentified item' },
};

const FALLBACK: MockEntry = {
  category: 'unknown',
  confidence: 0.30,
  label: 'Unidentified item',
};

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export class MockClassifier implements Classifier {
  async classify(
    _input: ImageBitmap | HTMLCanvasElement,
    hint?: string,
  ): Promise<ClassificationResult> {
    // 700–1100 ms artificial delay
    await delay(700 + Math.random() * 400);

    const entry = hint ? (HINT_MAP[hint] ?? FALLBACK) : FALLBACK;

    return {
      category: entry.category,
      confidence: entry.confidence,
      label: entry.label,
      source: 'mock',
    };
  }
}
