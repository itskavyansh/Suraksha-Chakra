import { describe, it, expect } from 'vitest';
import { evaluateOffer } from './evaluateOffer';

describe('Price Check: evaluateOffer', () => {
  const petRate = { minRate: 12, maxRate: 18 }; // 10 kg -> expected: 120 to 180 INR

  it('detects offers within the fair range', () => {
    // 10 kg of PET: range 120 - 180
    const res1 = evaluateOffer(petRate, 10, 150);
    expect(res1.isValid).toBe(true);
    expect(res1.verdict).toBe('within');
    expect(res1.expectedMin).toBe(120);
    expect(res1.expectedMax).toBe(180);

    const res2 = evaluateOffer(petRate, 10, 120);
    expect(res2.verdict).toBe('within');

    const res3 = evaluateOffer(petRate, 10, 180);
    expect(res3.verdict).toBe('within');
  });

  it('detects offers below the fair range', () => {
    // 10 kg of PET: min is 120. 5% tolerance lower threshold is 114.
    const res1 = evaluateOffer(petRate, 10, 100);
    expect(res1.verdict).toBe('below');

    const res2 = evaluateOffer(petRate, 10, 50);
    expect(res2.verdict).toBe('below');
  });

  it('detects offers above the fair range (good deal)', () => {
    // 10 kg of PET: max is 180. 5% tolerance upper threshold is 189.
    const res1 = evaluateOffer(petRate, 10, 200);
    expect(res1.verdict).toBe('above');

    const res2 = evaluateOffer(petRate, 10, 250);
    expect(res2.verdict).toBe('above');
  });

  it('correctly handles 5% tolerance edges', () => {
    // Expected min 120: lower threshold is 120 * 0.95 = 114
    // 115 is within tolerance
    const res1 = evaluateOffer(petRate, 10, 115);
    expect(res1.verdict).toBe('within');

    // 113 is below tolerance
    const res2 = evaluateOffer(petRate, 10, 113);
    expect(res2.verdict).toBe('below');

    // Expected max 180: upper threshold is 180 * 1.05 = 189
    // 188 is within tolerance
    const res3 = evaluateOffer(petRate, 10, 188);
    expect(res3.verdict).toBe('within');

    // 190 is above tolerance
    const res4 = evaluateOffer(petRate, 10, 190);
    expect(res4.verdict).toBe('above');
  });

  it('safely handles zero, negative, or invalid inputs', () => {
    expect(evaluateOffer(petRate, 0, 150).isValid).toBe(false);
    expect(evaluateOffer(petRate, -5, 150).isValid).toBe(false);
    expect(evaluateOffer(petRate, 10, 0).isValid).toBe(false);
    expect(evaluateOffer(petRate, 10, -50).isValid).toBe(false);
    expect(evaluateOffer(undefined, 10, 150).isValid).toBe(false);
    expect(evaluateOffer(petRate, NaN, 150).isValid).toBe(false);
  });
});
