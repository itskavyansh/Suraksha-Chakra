import { describe, it, expect } from 'vitest';
import { evaluateModelScores, clampConfidence } from './decision';
import { HazardCategory } from '@/types';

describe('decision.ts - Safety Evaluation Rules', () => {
  it('correctly classifies high confidence sharps hazard', () => {
    const masses: Record<HazardCategory, number> = {
      sharps: 0.85,
      glass: 0.02,
      batteries: 0.01,
      chemicals: 0.01,
      medical: 0.01,
      general: 0.10,
      unknown: 0.0,
    };

    const res = evaluateModelScores(masses, 'Syringe / Medical Needle');
    expect(res.category).toBe('sharps');
    expect(res.confidence).toBeGreaterThanOrEqual(0.85);
    expect(res.source).toBe('model');
    expect(res.label).toBe('Syringe / Medical Needle');
  });

  it('triggers hazard warning when hazard mass exceeds 20% even if general is dominant', () => {
    const masses: Record<HazardCategory, number> = {
      sharps: 0.05,
      glass: 0.22,
      batteries: 0.01,
      chemicals: 0.0,
      medical: 0.0,
      general: 0.68,
      unknown: 0.04,
    };

    // Total hazard mass is 0.05 + 0.22 + 0.01 = 0.28 (> 0.20)
    const res = evaluateModelScores(masses, 'Broken Glass Shards');
    expect(res.category).toBe('glass');
    expect(res.confidence).toBeGreaterThanOrEqual(0.55);
  });

  it('classifies as general scrap when general mass >= 70% and hazard mass <= 20%', () => {
    const masses: Record<HazardCategory, number> = {
      sharps: 0.02,
      glass: 0.02,
      batteries: 0.01,
      chemicals: 0.0,
      medical: 0.0,
      general: 0.85,
      unknown: 0.10,
    };

    const res = evaluateModelScores(masses, 'Cardboard Box');
    expect(res.category).toBe('general');
    expect(res.confidence).toBe(0.85);
  });

  it('falls back to safe-side unknown for ambiguous or low-confidence distributions', () => {
    const masses: Record<HazardCategory, number> = {
      sharps: 0.08,
      glass: 0.06,
      batteries: 0.03,
      chemicals: 0.01,
      medical: 0.01,
      general: 0.55,
      unknown: 0.26,
    };

    // Total hazard mass is 0.19 (<= 0.20), but general mass is 0.55 (< 0.70)
    const res = evaluateModelScores(masses, 'Uncertain Item');
    expect(res.category).toBe('unknown');
    expect(res.confidence).toBe(0.50);
    expect(res.label).toBe('Unknown: Treat as Hazardous');
  });

  it('clamps confidence between 0.50 and 0.99', () => {
    expect(clampConfidence(0.20)).toBe(0.50);
    expect(clampConfidence(1.20)).toBe(0.99);
    expect(clampConfidence(0.764)).toBe(0.76);
  });
});
