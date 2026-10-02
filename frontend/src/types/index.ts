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

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedAt: string;
  type: 'full-time' | 'part-time' | 'contract';
  skills: string[];
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  completed: boolean;
  category: 'safety' | 'skills' | 'health';
}

export interface Recycler {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  materials: string[];
  rating: number;
  distanceKm: number;
}

// ── Phase 2: Scan / Hazard types ─────────────

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
