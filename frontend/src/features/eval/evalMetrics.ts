import type { HazardCategory } from '../../types';

export const EVAL_CLASSES: readonly HazardCategory[] = [
  'sharps',
  'glass',
  'batteries',
  'chemicals',
  'medical',
  'general',
] as const;

export const PRED_COLUMNS: readonly HazardCategory[] = [
  'sharps',
  'glass',
  'batteries',
  'chemicals',
  'medical',
  'general',
  'unknown',
] as const;

export interface ImageEvalResult {
  filename: string;
  trueClass: HazardCategory;
  predClass: HazardCategory;
  confidence: number;
  inferenceMs: number;
}

export interface ClassStats {
  class: HazardCategory;
  count: number;
  precision: number;
  recall: number;
}

export interface EvalReport {
  timestamp: string;
  modelId: string;
  totalImages: number;
  overallAccuracy: number;
  medianInferenceMs: number;
  p95InferenceMs: number;
  dangerousMissRate: number;
  safeSideRate: number;
  falseAlarmRate: number;
  perClassStats: ClassStats[];
  confusionMatrix: Record<HazardCategory, Record<HazardCategory, number>>;
}

export function computeEvalReport(
  results: ImageEvalResult[],
  modelId: string,
): EvalReport {
  const matrix: Record<string, Record<string, number>> = {};
  for (const row of EVAL_CLASSES) {
    matrix[row] = {};
    for (const col of PRED_COLUMNS) {
      matrix[row][col] = 0;
    }
  }

  let correctCount = 0;
  for (const r of results) {
    if (matrix[r.trueClass]) {
      matrix[r.trueClass][r.predClass] = (matrix[r.trueClass][r.predClass] || 0) + 1;
    }
    if (r.trueClass === r.predClass) {
      correctCount++;
    }
  }

  const perClassStats: ClassStats[] = EVAL_CLASSES.map((c) => {
    const tp = matrix[c]?.[c] || 0;
    let totalTrue = 0;
    for (const col of PRED_COLUMNS) {
      totalTrue += matrix[c]?.[col] || 0;
    }

    let totalPred = 0;
    for (const row of EVAL_CLASSES) {
      totalPred += matrix[row]?.[c] || 0;
    }

    const precision = totalPred > 0 ? tp / totalPred : 0;
    const recall = totalTrue > 0 ? tp / totalTrue : 0;

    return {
      class: c,
      count: totalTrue,
      precision: Math.round(precision * 1000) / 1000,
      recall: Math.round(recall * 1000) / 1000,
    };
  });

  const hazardClasses: HazardCategory[] = [
    'sharps',
    'glass',
    'batteries',
    'chemicals',
    'medical',
  ];

  let totalHazard = 0;
  let dangerousMisses = 0;
  let safeSideHits = 0;

  for (const hc of hazardClasses) {
    for (const col of PRED_COLUMNS) {
      const count = matrix[hc]?.[col] || 0;
      totalHazard += count;
      if (col === 'general') {
        dangerousMisses += count;
      }
      if (col === hc || col === 'unknown') {
        safeSideHits += count;
      }
    }
  }

  let totalGeneral = 0;
  let falseAlarms = 0;
  for (const col of PRED_COLUMNS) {
    const count = matrix.general?.[col] || 0;
    totalGeneral += count;
    if (col !== 'general') {
      falseAlarms += count;
    }
  }

  const times = results.map((r) => r.inferenceMs).sort((a, b) => a - b);
  const medianMs = times.length > 0 ? times[Math.floor(times.length * 0.5)] : 0;
  const p95Ms = times.length > 0 ? times[Math.floor(times.length * 0.95)] : 0;

  return {
    timestamp: new Date().toISOString(),
    modelId,
    totalImages: results.length,
    overallAccuracy:
      results.length > 0 ? Math.round((correctCount / results.length) * 1000) / 1000 : 0,
    medianInferenceMs: Math.round(medianMs),
    p95InferenceMs: Math.round(p95Ms),
    dangerousMissRate:
      totalHazard > 0 ? Math.round((dangerousMisses / totalHazard) * 1000) / 1000 : 0,
    safeSideRate:
      totalHazard > 0 ? Math.round((safeSideHits / totalHazard) * 1000) / 1000 : 0,
    falseAlarmRate:
      totalGeneral > 0 ? Math.round((falseAlarms / totalGeneral) * 1000) / 1000 : 0,
    perClassStats,
    confusionMatrix: matrix as Record<HazardCategory, Record<HazardCategory, number>>,
  };
}
