import { describe, expect, it } from 'vitest';
import { decide } from './decision';
import type { PromptScore } from './modelConfig';

describe('decision logic (decide)', () => {
  it('clear needle -> sharps', () => {
    const scores: PromptScore[] = [
      { prompt: 'a photo of a used syringe with a needle', score: 0.85 },
      { prompt: 'a photo of a plastic water bottle', score: 0.10 },
      { prompt: 'a photo of a blurry unclear object', score: 0.05 },
    ];
    const res = decide(scores);
    expect(res.category).toBe('sharps');
    expect(res.confidence).toBe(0.85);
    expect(res.source).toBe('model');
    expect(res.label).toBe('Needle / Syringe');
  });

  it('general with mass 0.9 and hazardMass 0.05 -> general', () => {
    const scores: PromptScore[] = [
      { prompt: 'a photo of a plastic water bottle', score: 0.60 },
      { prompt: 'a photo of a cardboard box', score: 0.30 },
      { prompt: 'a photo of a razor blade', score: 0.05 },
      { prompt: 'a photo of a blurry unclear object', score: 0.05 },
    ];
    const res = decide(scores);
    expect(res.category).toBe('general');
    expect(res.confidence).toBe(0.9);
    expect(res.label).toBe('Plastic bottle');
    expect(res.source).toBe('model');
  });

  it('general with mass 0.65 -> unknown (below GENERAL_MIN_MASS 0.70)', () => {
    const scores: PromptScore[] = [
      { prompt: 'a photo of a plastic water bottle', score: 0.65 },
      { prompt: 'a photo of a blurry unclear object', score: 0.25 },
      { prompt: 'a photo of a razor blade', score: 0.10 },
    ];
    const res = decide(scores);
    expect(res.category).toBe('unknown');
    expect(res.confidence).toBe(0.3);
    expect(res.label).toBe('Unidentified item');
  });

  it('general with mass 0.8 but hazardMass 0.3 -> unknown (exceeds GENERAL_MAX_HAZARD_MASS 0.20)', () => {
    // Note: total mass here can exceed 1 in synthetic scores, but tests the rule directly
    const scores: PromptScore[] = [
      { prompt: 'a photo of a plastic water bottle', score: 0.80 },
      { prompt: 'a photo of a razor blade', score: 0.15 },
      { prompt: 'a photo of broken glass shards', score: 0.15 },
    ];
    const res = decide(scores);
    expect(res.category).toBe('unknown');
    expect(res.confidence).toBe(0.3);
    expect(res.label).toBe('Unidentified item');
  });

  it('unknown wins -> unknown with confidence capped at 0.5', () => {
    const scores: PromptScore[] = [
      { prompt: 'a photo of a blurry unclear object', score: 0.70 },
      { prompt: 'a photo of an unidentifiable object', score: 0.10 },
      { prompt: 'a photo of a plastic water bottle', score: 0.20 },
    ];
    const res = decide(scores);
    expect(res.category).toBe('unknown');
    // mass.unknown = 0.80, capped at 0.50
    expect(res.confidence).toBe(0.5);
    expect(res.label).toBe('Unidentified item');
  });

  it('label selection picks the best prompt within the winning category', () => {
    const scores: PromptScore[] = [
      { prompt: 'a photo of a used syringe with a needle', score: 0.20 },
      { prompt: 'a photo of a razor blade', score: 0.55 }, // Higher score within sharps
      { prompt: 'a photo of a sharp knife blade', score: 0.10 },
      { prompt: 'a photo of a plastic water bottle', score: 0.15 },
    ];
    const res = decide(scores);
    expect(res.category).toBe('sharps');
    expect(res.label).toBe('Blade / Razor');
  });

  it('tie-breaking is deterministic (favors earlier hazard categories)', () => {
    const scores: PromptScore[] = [
      { prompt: 'a photo of broken glass shards', score: 0.40 }, // glass
      { prompt: 'a photo of a used syringe with a needle', score: 0.40 }, // sharps comes first in CATEGORY_ORDER
      { prompt: 'a photo of a plastic water bottle', score: 0.20 },
    ];
    const res = decide(scores);
    expect(res.category).toBe('sharps');
  });

  it('confidence is always clamped within 0..1 and rounded to 2 decimals', () => {
    const scores: PromptScore[] = [
      { prompt: 'a photo of broken glass shards', score: 0.333333 },
      { prompt: 'a photo of shattered window glass', score: 0.333333 },
      { prompt: 'a photo of a plastic water bottle', score: 0.1 },
    ];
    const res = decide(scores);
    expect(res.confidence).toBe(0.67);
    expect(res.confidence).toBeGreaterThanOrEqual(0);
    expect(res.confidence).toBeLessThanOrEqual(1);

    // Empty scores edge case
    const emptyRes = decide([]);
    expect(emptyRes.confidence).toBe(0.3);
    expect(emptyRes.category).toBe('unknown');
  });
});
