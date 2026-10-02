import type { Worker, Job, TrainingModule, Recycler, HazardReport, HazardCategory } from '../types';

// ─── Mock seed data ──────────────────────────────────────────────────────────

const MOCK_WORKER: Worker = {
  id: 'worker-001',
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  city: 'Delhi',
  skills: ['Segregation', 'Door-to-door collection'],
  joinedAt: '2023-04-15',
  safetyScore: 82,
};

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

const SEED_REPORTS: HazardReport[] = [
  { id: 'seed-01', category: 'sharps', confidence: 0.92, label: 'Needle / Syringe', lat: 28.6139, lng: 77.2090, createdAt: daysAgo(1), workerId: 'worker-001', imageThumb: null },
  { id: 'seed-02', category: 'glass', confidence: 0.88, label: 'Broken glass', lat: 28.6304, lng: 77.2177, createdAt: daysAgo(2), workerId: 'worker-002', imageThumb: null },
  { id: 'seed-03', category: 'batteries', confidence: 0.90, label: 'Battery (Li-ion)', lat: 28.5672, lng: 77.3211, createdAt: daysAgo(3), workerId: 'worker-001', imageThumb: null },
  { id: 'seed-04', category: 'chemicals', confidence: 0.85, label: 'Chemical container', lat: 28.7041, lng: 77.1025, createdAt: daysAgo(4), workerId: 'worker-003', imageThumb: null },
  { id: 'seed-05', category: 'medical', confidence: 0.87, label: 'Medical waste', lat: 28.4595, lng: 77.0266, createdAt: daysAgo(5), workerId: 'worker-002', imageThumb: null },
  { id: 'seed-06', category: 'sharps', confidence: 0.91, label: 'Broken syringe', lat: 28.6519, lng: 77.2315, createdAt: daysAgo(7), workerId: 'worker-004', imageThumb: null },
  { id: 'seed-07', category: 'unknown', confidence: 0.31, label: 'Unidentified item', lat: 28.5355, lng: 77.3910, createdAt: daysAgo(8), workerId: 'worker-001', imageThumb: null },
  { id: 'seed-08', category: 'chemicals', confidence: 0.83, label: 'Paint can', lat: 28.7201, lng: 77.1770, createdAt: daysAgo(10), workerId: 'worker-003', imageThumb: null },
  { id: 'seed-09', category: 'glass', confidence: 0.86, label: 'Shattered bottle', lat: 28.6130, lng: 77.0890, createdAt: daysAgo(12), workerId: 'worker-002', imageThumb: null },
  { id: 'seed-10', category: 'batteries', confidence: 0.89, label: 'AA batteries (leaking)', lat: 28.4862, lng: 77.0732, createdAt: daysAgo(15), workerId: 'worker-004', imageThumb: null },
  { id: 'seed-11', category: 'medical', confidence: 0.84, label: 'IV bag / tubing', lat: 28.6600, lng: 77.3050, createdAt: daysAgo(20), workerId: 'worker-001', imageThumb: null },
  { id: 'seed-12', category: 'sharps', confidence: 0.93, label: 'Razor blade', lat: 28.5498, lng: 77.2643, createdAt: daysAgo(28), workerId: 'worker-002', imageThumb: null },
];

// Session-persistent user-created reports
const STORAGE_KEY = 'sc_reports';

function loadUserReports(): HazardReport[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HazardReport[];
  } catch {
    return [];
  }
}

function saveUserReports(reports: HazardReport[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // storage unavailable
  }
}

let _userReports: HazardReport[] = loadUserReports();

// ─── Utilities ────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const randomDelay = () => delay(200 + Math.random() * 200);

function genId(): string {
  try { return crypto.randomUUID(); } catch { return `r-${Date.now()}`; }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Data access layer — swap only this file for a real backend without
//  touching any component.
// ─────────────────────────────────────────────────────────────────────────────
const api = {
  async getCurrentWorker(): Promise<Worker> {
    await randomDelay();
    return { ...MOCK_WORKER };
  },

  async getJobs(): Promise<Job[]> {
    await randomDelay();
    return [];
  },

  async getTrainingModules(): Promise<TrainingModule[]> {
    await randomDelay();
    return [];
  },

  async getRecyclers(): Promise<Recycler[]> {
    await randomDelay();
    return [];
  },

  async getHazardReports(): Promise<HazardReport[]> {
    await randomDelay();
    return [...SEED_REPORTS, ..._userReports];
  },

  async submitHazardReport(
    r: Omit<HazardReport, 'id' | 'createdAt'>,
  ): Promise<HazardReport> {
    await randomDelay();
    const report: HazardReport = {
      ...r,
      // Ensure category is typed correctly
      category: r.category as HazardCategory,
      id: genId(),
      createdAt: new Date().toISOString(),
    };
    _userReports = [..._userReports, report];
    saveUserReports(_userReports);
    return report;
  },
};

export default api;
