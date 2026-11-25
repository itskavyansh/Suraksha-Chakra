export type HazardCategory =
  | 'sharps'
  | 'glass'
  | 'batteries'
  | 'chemicals'
  | 'medical'
  | 'general'
  | 'unknown';

export interface Worker {
  id: string;
  workerId: string;
  name: string;
  phone: string;
  city: string;
  skills: string[];
  preferredLanguage: 'en' | 'hi';
  safetyScore: number;
  createdAt: string;
}

export interface Account extends Worker {
  pinHash: string;
}

export interface Job {
  id: string;
  title: string;
  area: string;
  distanceKm: number;
  materials: string[];
  estKg: number;
  estValue: number;
  postedBy: string;
  status: 'available' | 'accepted' | 'completed';
  acceptedBy?: string;
}

export interface TrainingStep {
  stepNumber: number;
  titleKey: string;
  contentKey: string;
}

export interface TrainingQuizQuestion {
  id: string;
  questionKey: string;
  optionsKeys: string[];
  correctIndex: number;
  explanationKey: string;
}

export interface TrainingModule {
  id: string;
  titleKey: string;
  descKey: string;
  coverIcon: string;
  durationMins: number;
  steps: TrainingStep[];
  quiz: TrainingQuizQuestion[];
}

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  score: number;
  completedAt?: string;
}

export type TrainingProgress = Record<string, ModuleProgress>;

export interface Recycler {
  id: string;
  name: string;
  area: string;
  isVerified: boolean;
  materials: string[];
  rates: Record<string, { min: number; max: number }>;
  phone: string;
  hours: string;
  mapQuery: string;
}

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  type: 'job' | 'scrap_sale';
  title: string;
  material?: string;
  weightKg: number;
  amount: number;
}

export interface ClassificationResult {
  category: HazardCategory;
  confidence: number;
  source: 'mock' | 'model';
  label: string;
}

export interface HazardReport {
  id: string;
  category: HazardCategory;
  confidence: number;
  label: string;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  workerId: string;
  imageThumb: string | null;
}

export interface Clinic {
  id: string;
  name: string;
  area: string;
  hours: string;
  phone: string;
  mapQuery: string;
}

export interface Incident {
  id: string;
  userId: string;
  type: 'needle' | 'cut' | 'chemical' | 'other';
  title: string;
  dateTime: string;
  place: string;
  treatment: string;
  note?: string;
  createdAt: string;
}

export interface PublicPassport {
  workerId: string;
  name: string;
  city: string;
  skills: string[];
  modulesCompleted: { id: string; title: string }[];
  safetyScore: number;
  updatedAt: string;
  isVerified: boolean;
}

export interface PassportSnapshotData {
  name: string;
  city: string;
  skills: string[];
  modules: string[];
  score: number;
  updatedAt: string;
}

export interface MaterialRate {
  material: string;
  nameKey: string;
  minRate: number;
  maxRate: number;
  unit: string;
}

export interface AdminStats {
  workersRegistered: number;
  safetyScans: number;
  hazardsReported: number;
  trainingCompleted: number;
  injuriesLogged: number;
  categoryBreakdown: Record<HazardCategory, number>;
}
