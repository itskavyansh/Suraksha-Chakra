// ─────────────────────────────────────────────
//  Shared TypeScript types for Suraksha Chakra
// ─────────────────────────────────────────────

export interface Worker {
  id: string;
  name: string;
  phone: string;
  city: string;
  skills: string[];
  joinedAt: string; // ISO date string
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
  rating: number; // 1–5
  distanceKm: number;
}

export type Language = 'en' | 'hi';

export interface AppState {
  user: Worker | null;
  language: Language;
}
