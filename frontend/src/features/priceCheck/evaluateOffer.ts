export interface EvaluationResult {
  expectedMin: number;
  expectedMax: number;
  verdict: 'below' | 'within' | 'above';
  isValid: boolean;
}

export interface RateRange {
  minRate: number;
  maxRate: number;
}

/**
 * Evaluates whether a scrap buyer's offer is fair based on indicative market rates per kg.
 * Applies a 5% tolerance buffer on min and max boundaries.
 */
export function evaluateOffer(
  rate: RateRange | undefined,
  weightKg: number,
  offerAmount: number
): EvaluationResult {
  if (
    !rate ||
    isNaN(weightKg) ||
    isNaN(offerAmount) ||
    weightKg <= 0 ||
    offerAmount <= 0 ||
    rate.minRate <= 0 ||
    rate.maxRate <= 0
  ) {
    return {
      expectedMin: 0,
      expectedMax: 0,
      verdict: 'below',
      isValid: false,
    };
  }

  const expectedMin = Math.round(weightKg * rate.minRate);
  const expectedMax = Math.round(weightKg * rate.maxRate);

  // 5% tolerance boundary
  const lowerThreshold = expectedMin * 0.95;
  const upperThreshold = expectedMax * 1.05;

  let verdict: 'below' | 'within' | 'above';
  if (offerAmount < lowerThreshold) {
    verdict = 'below';
  } else if (offerAmount > upperThreshold) {
    verdict = 'above';
  } else {
    verdict = 'within';
  }

  return {
    expectedMin,
    expectedMax,
    verdict,
    isValid: true,
  };
}
