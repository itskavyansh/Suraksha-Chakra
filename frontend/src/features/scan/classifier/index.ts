import type { Classifier } from './types';
import { MockClassifier } from './mockClassifier';

/** Phase 3: swap this to the real model */
export function getClassifier(): Classifier {
  return new MockClassifier();
}

/**
 * Any result with confidence below this threshold OR category 'unknown'
 * is displayed as "Unknown: treat as hazardous".
 */
export const CONFIDENCE_THRESHOLD = 0.6;
