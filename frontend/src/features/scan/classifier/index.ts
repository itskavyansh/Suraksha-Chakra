import type { Classifier } from './types';
import { MockClassifier } from './mockClassifier';
import { ModelClassifier } from './modelClassifier';

/** Phase 3: return ModelClassifier by default, or MockClassifier if VITE_USE_MOCK=1 */
export function getClassifier(): Classifier {
  if (import.meta.env.VITE_USE_MOCK === '1') {
    return new MockClassifier();
  }
  return new ModelClassifier();
}

/**
 * Any result with confidence below this threshold OR category 'unknown'
 * is displayed as "Unknown: treat as hazardous".
 */
export const CONFIDENCE_THRESHOLD = 0.6;
