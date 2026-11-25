import { HazardCategory, ClassificationResult } from '@/types';
import { HAZARD_CATEGORIES } from './modelConfig';

export const HAZARD_MASS_THRESHOLD = 0.20;
export const GENERAL_MASS_THRESHOLD = 0.70;
export const MIN_CONFIDENCE = 0.50;
export const MAX_CONFIDENCE = 0.99;

export function clampConfidence(val: number): number {
  if (isNaN(val)) return MIN_CONFIDENCE;
  const clamped = Math.min(MAX_CONFIDENCE, Math.max(MIN_CONFIDENCE, val));
  return Math.round(clamped * 100) / 100;
}

export function evaluateModelScores(
  categoryMasses: Record<HazardCategory, number>,
  topLabel: string
): ClassificationResult {
  // 1. Calculate aggregated hazard mass
  let hazardMass = 0;
  let winningHazardCategory: HazardCategory = 'sharps';
  let maxHazardScore = -1;

  for (const cat of HAZARD_CATEGORIES) {
    const score = categoryMasses[cat] || 0;
    hazardMass += score;
    if (score > maxHazardScore) {
      maxHazardScore = score;
      winningHazardCategory = cat;
    }
  }

  const generalMass = categoryMasses['general'] || 0;

  // 2. Safety Rule A: If cumulative hazard mass exceeds 20%, trigger hazard warning
  if (hazardMass > HAZARD_MASS_THRESHOLD) {
    const confidence = clampConfidence(Math.max(0.55, hazardMass));
    return {
      category: winningHazardCategory,
      confidence,
      source: 'model',
      label: topLabel,
    };
  }

  // 3. Safety Rule B: Must have >= 70% general mass AND <= 20% hazard mass to be deemed safe
  if (generalMass >= GENERAL_MASS_THRESHOLD && hazardMass <= HAZARD_MASS_THRESHOLD) {
    const confidence = clampConfidence(generalMass);
    return {
      category: 'general',
      confidence,
      source: 'model',
      label: topLabel,
    };
  }

  // 4. Safety Rule C: Safe-side fallback for any ambiguous distribution
  return {
    category: 'unknown',
    confidence: MIN_CONFIDENCE,
    source: 'model',
    label: 'Unknown: Treat as Hazardous',
  };
}
