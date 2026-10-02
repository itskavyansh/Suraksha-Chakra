import type { ClassificationResult, HazardCategory } from '../../../types';
import {
  GENERAL_MAX_HAZARD_MASS,
  GENERAL_MIN_MASS,
  PROMPT_LOOKUP,
  type PromptScore,
} from './modelConfig';

const HAZARD_CATEGORIES: readonly HazardCategory[] = [
  'sharps',
  'glass',
  'batteries',
  'chemicals',
  'medical',
] as const;

const CATEGORY_ORDER: readonly HazardCategory[] = [
  'sharps',
  'glass',
  'batteries',
  'chemicals',
  'medical',
  'general',
  'unknown',
] as const;

function clampAndRound(val: number): number {
  const clamped = Math.max(0, Math.min(1, val));
  return Math.round(clamped * 100) / 100;
}

/**
 * Pure decision function for CLIP zero-shot classification scores.
 * Safety-biased: missing a dangerous item is worse than a false alarm.
 */
export function decide(scores: PromptScore[]): ClassificationResult {
  if (!scores || scores.length === 0) {
    return {
      category: 'unknown',
      confidence: 0.3,
      source: 'model',
      label: 'Unidentified item',
    };
  }

  // 1. Compute mass per category and best prompt per category
  const mass: Record<HazardCategory, number> = {
    sharps: 0,
    glass: 0,
    batteries: 0,
    chemicals: 0,
    medical: 0,
    general: 0,
    unknown: 0,
  };

  const bestPromptPerCat: Partial<Record<HazardCategory, { prompt: string; score: number; label: string }>> = {};

  for (const item of scores) {
    const info = PROMPT_LOOKUP.get(item.prompt);
    if (!info) continue;

    const cat = info.category;
    mass[cat] = (mass[cat] || 0) + item.score;

    const currentBest = bestPromptPerCat[cat];
    if (!currentBest || item.score > currentBest.score) {
      bestPromptPerCat[cat] = {
        prompt: item.prompt,
        score: item.score,
        label: info.label,
      };
    }
  }

  // 2. Hazard mass = sum of mass for sharps, glass, batteries, chemicals, medical
  const hazardMass = HAZARD_CATEGORIES.reduce((sum, cat) => sum + mass[cat], 0);

  // 3. Category with highest mass (deterministic order tie-breaker)
  let top: HazardCategory = CATEGORY_ORDER[0];
  let maxMass = -1;

  for (const cat of CATEGORY_ORDER) {
    if (mass[cat] > maxMass) {
      maxMass = mass[cat];
      top = cat;
    }
  }

  // 4. If top === 'general': return general ONLY IF mass.general >= GENERAL_MIN_MASS AND hazardMass <= GENERAL_MAX_HAZARD_MASS
  if (top === 'general') {
    if (mass.general >= GENERAL_MIN_MASS && hazardMass <= GENERAL_MAX_HAZARD_MASS) {
      const topLabel = bestPromptPerCat.general?.label || 'General waste';
      return {
        category: 'general',
        confidence: clampAndRound(mass.general),
        source: 'model',
        label: topLabel,
      };
    }
    // Failed safety threshold -> fallback to unknown
    return {
      category: 'unknown',
      confidence: 0.3,
      source: 'model',
      label: 'Unidentified item',
    };
  }

  // 5. If top is a hazard category
  if (HAZARD_CATEGORIES.includes(top)) {
    const topLabel = bestPromptPerCat[top]?.label || 'Hazardous item';
    return {
      category: top,
      confidence: clampAndRound(mass[top]),
      source: 'model',
      label: topLabel,
    };
  }

  // 6. If top === 'unknown'
  const unknownLabel = bestPromptPerCat.unknown?.label || 'Unidentified item';
  return {
    category: 'unknown',
    confidence: clampAndRound(Math.min(mass.unknown, 0.5)),
    source: 'model',
    label: unknownLabel,
  };
}
