import { MaterialRate } from '@/types';

export const MATERIAL_RATES: MaterialRate[] = [
  { material: 'pet_plastic', nameKey: 'materials.petPlastic', minRate: 12, maxRate: 18, unit: 'kg' },
  { material: 'cardboard', nameKey: 'materials.cardboard', minRate: 6, maxRate: 9, unit: 'kg' },
  { material: 'mixed_paper', nameKey: 'materials.mixedPaper', minRate: 8, maxRate: 12, unit: 'kg' },
  { material: 'iron', nameKey: 'materials.iron', minRate: 24, maxRate: 32, unit: 'kg' },
  { material: 'aluminium', nameKey: 'materials.aluminium', minRate: 90, maxRate: 110, unit: 'kg' },
  { material: 'copper', nameKey: 'materials.copper', minRate: 400, maxRate: 480, unit: 'kg' },
  { material: 'glass', nameKey: 'materials.glass', minRate: 2, maxRate: 4, unit: 'kg' },
];
