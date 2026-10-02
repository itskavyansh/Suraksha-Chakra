// ─────────────────────────────────────────────
//  Shared TypeScript types for Suraksha Chakra
// ─────────────────────────────────────────────

export interface Worker {
  id: string;
  name: string;
  phone: string;
  city: string;
  skills: string[];
  joinedAt: string;
  safetyScore: number; // 0–100
}

export interface TrainingStep {
  textKey: string;
}

export interface QuizQuestion {
  questionKey: string;
  optionKeys: string[];
  correctIndex: number;
}

export interface TrainingModule {
  id: string;
  titleKey: string;
  durationMin: number;
  coverIcon: string;
  steps: TrainingStep[];
  quiz: QuizQuestion[];
}

export interface TrainingProgress {
  moduleId: string;
  completed: boolean;
  score: number | null;
  completedAt: string | null;
}

export interface Job {
  id: string;
  titleKey: string;
  area: string;
  distanceKm: number;
  materials: string[];
  estKg: number;
  estValueINR: number;
  postedBy: 'Household' | 'RWA' | 'BWG';
  postedAgo: string;
  status: 'open' | 'accepted' | 'done';
}

export interface RecyclerMaterial {
  name: string;
  rateINRPerKg: number;
}

export interface Recycler {
  id: string;
  name: string;
  area: string;
  verified: boolean;
  materials: RecyclerMaterial[];
  phone: string;
  hours: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO or YYYY-MM-DD
  description: string;
  kg: number;
  amountINR: number;
  material: string;
}

export interface AdminStats {
  workersRegistered: number;
  safetyScans: number;
  hazardsReported: number;
  trainingCompleted: number;
  isSample: boolean;
}

// ── Phase 2 & 3: Scan / Hazard types ─────────────

export type HazardCategory =
  | 'sharps'
  | 'glass'
  | 'batteries'
  | 'chemicals'
  | 'medical'
  | 'general'
  | 'unknown';

export interface ClassificationResult {
  category: HazardCategory;
  confidence: number; // 0..1
  source: 'mock' | 'model';
  label: string; // e.g. "Needle / Syringe"
}

export interface HazardReport {
  id: string;
  category: HazardCategory;
  confidence: number;
  label: string;
  lat: number | null;
  lng: number | null;
  createdAt: string; // ISO
  workerId: string;
  imageThumb: string | null; // small data URL, max ~240px wide
}

export type Language = 'en' | 'hi';

export interface AppState {
  user: Worker | null;
  language: Language;
}
