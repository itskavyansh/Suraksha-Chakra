import type {
  Worker,
  Job,
  TrainingModule,
  TrainingProgress,
  Recycler,
  Transaction,
  AdminStats,
  HazardReport,
  HazardCategory,
} from '../types';
import { SEED_TRAINING_MODULES, SEED_TRAINING_PROGRESS } from './seed/training';
import { SEED_JOBS } from './seed/jobs';
import { SEED_RECYCLERS } from './seed/recyclers';
import { SEED_TRANSACTIONS } from './seed/transactions';

// ─── Mock worker ─────────────────────────────────────────────────────────────

const MOCK_WORKER: Worker = {
  id: 'SC-DEL-000142',
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  city: 'Delhi',
  skills: ['Segregation', 'Door-to-door collection', 'Hazard Safety'],
  joinedAt: '2023-04-15',
  safetyScore: 85,
};

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

const SEED_REPORTS: HazardReport[] = [
  { id: 'seed-01', category: 'sharps', confidence: 0.92, label: 'Needle / Syringe', lat: 28.6139, lng: 77.2090, createdAt: daysAgo(1), workerId: 'SC-DEL-000142', imageThumb: null },
  { id: 'seed-02', category: 'glass', confidence: 0.88, label: 'Broken glass', lat: 28.6304, lng: 77.2177, createdAt: daysAgo(2), workerId: 'worker-002', imageThumb: null },
  { id: 'seed-03', category: 'batteries', confidence: 0.90, label: 'Battery (Li-ion)', lat: 28.5672, lng: 77.3211, createdAt: daysAgo(3), workerId: 'SC-DEL-000142', imageThumb: null },
  { id: 'seed-04', category: 'chemicals', confidence: 0.85, label: 'Chemical container', lat: 28.7041, lng: 77.1025, createdAt: daysAgo(4), workerId: 'worker-003', imageThumb: null },
  { id: 'seed-05', category: 'medical', confidence: 0.87, label: 'Medical waste', lat: 28.4595, lng: 77.0266, createdAt: daysAgo(5), workerId: 'worker-002', imageThumb: null },
  { id: 'seed-06', category: 'sharps', confidence: 0.91, label: 'Broken syringe', lat: 28.6519, lng: 77.2315, createdAt: daysAgo(7), workerId: 'worker-004', imageThumb: null },
  { id: 'seed-07', category: 'unknown', confidence: 0.31, label: 'Unidentified item', lat: 28.5355, lng: 77.3910, createdAt: daysAgo(8), workerId: 'SC-DEL-000142', imageThumb: null },
  { id: 'seed-08', category: 'chemicals', confidence: 0.83, label: 'Paint can', lat: 28.7201, lng: 77.1770, createdAt: daysAgo(10), workerId: 'worker-003', imageThumb: null },
  { id: 'seed-09', category: 'glass', confidence: 0.86, label: 'Shattered bottle', lat: 28.6130, lng: 77.0890, createdAt: daysAgo(12), workerId: 'worker-002', imageThumb: null },
  { id: 'seed-10', category: 'batteries', confidence: 0.89, label: 'AA batteries (leaking)', lat: 28.4862, lng: 77.0732, createdAt: daysAgo(15), workerId: 'worker-004', imageThumb: null },
  { id: 'seed-11', category: 'medical', confidence: 0.84, label: 'IV bag / tubing', lat: 28.6600, lng: 77.3050, createdAt: daysAgo(20), workerId: 'SC-DEL-000142', imageThumb: null },
  { id: 'seed-12', category: 'sharps', confidence: 0.93, label: 'Razor blade', lat: 28.5498, lng: 77.2643, createdAt: daysAgo(28), workerId: 'worker-002', imageThumb: null },
];

// ─── Session storage helpers ──────────────────────────────────────────────────

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore sessionStorage errors
  }
}

const STORAGE_KEYS = {
  REPORTS: 'sc_reports',
  TRAINING_PROGRESS: 'sc_training_progress',
  JOBS: 'sc_jobs',
  TRANSACTIONS: 'sc_transactions',
};

let _userReports: HazardReport[] = getStored<HazardReport[]>(STORAGE_KEYS.REPORTS, []);
let _trainingProgress: TrainingProgress[] = getStored<TrainingProgress[]>(
  STORAGE_KEYS.TRAINING_PROGRESS,
  SEED_TRAINING_PROGRESS,
);
let _jobs: Job[] = getStored<Job[]>(STORAGE_KEYS.JOBS, SEED_JOBS);
let _transactions: Transaction[] = getStored<Transaction[]>(
  STORAGE_KEYS.TRANSACTIONS,
  SEED_TRANSACTIONS,
);

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const randomDelay = () => delay(200 + Math.random() * 200);

function genId(prefix = 'id'): string {
  try {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  } catch {
    return `${prefix}-${Date.now().toString(36)}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Data access layer
// ─────────────────────────────────────────────────────────────────────────────
const api = {
  async getCurrentWorker(): Promise<Worker> {
    await randomDelay();
    return { ...MOCK_WORKER };
  },

  async getTrainingModules(): Promise<TrainingModule[]> {
    await randomDelay();
    return [...SEED_TRAINING_MODULES];
  },

  async getTrainingProgress(): Promise<TrainingProgress[]> {
    await randomDelay();
    return [..._trainingProgress];
  },

  async completeTrainingModule(id: string, score: number): Promise<TrainingProgress> {
    await randomDelay();
    const existingIdx = _trainingProgress.findIndex((p) => p.moduleId === id);
    const updated: TrainingProgress = {
      moduleId: id,
      completed: true,
      score,
      completedAt: new Date().toISOString(),
    };
    if (existingIdx >= 0) {
      _trainingProgress = [
        ..._trainingProgress.slice(0, existingIdx),
        updated,
        ..._trainingProgress.slice(existingIdx + 1),
      ];
    } else {
      _trainingProgress = [..._trainingProgress, updated];
    }
    setStored(STORAGE_KEYS.TRAINING_PROGRESS, _trainingProgress);
    return updated;
  },

  async getJobs(): Promise<Job[]> {
    await randomDelay();
    return [..._jobs];
  },

  async acceptJob(id: string): Promise<Job> {
    await randomDelay();
    const job = _jobs.find((j) => j.id === id);
    if (!job) throw new Error('Job not found');
    const updated: Job = { ...job, status: 'accepted' };
    _jobs = _jobs.map((j) => (j.id === id ? updated : j));
    setStored(STORAGE_KEYS.JOBS, _jobs);
    return updated;
  },

  async markJobDone(id: string): Promise<{ job: Job; transaction: Transaction }> {
    await randomDelay();
    const job = _jobs.find((j) => j.id === id);
    if (!job) throw new Error('Job not found');
    const updatedJob: Job = { ...job, status: 'done' };
    _jobs = _jobs.map((j) => (j.id === id ? updatedJob : j));
    setStored(STORAGE_KEYS.JOBS, _jobs);

    const transaction: Transaction = {
      id: genId('tx'),
      date: new Date().toISOString().slice(0, 10),
      description: `${job.area} — ${job.materials.join(', ')}`,
      kg: job.estKg,
      amountINR: job.estValueINR,
      material: job.materials.join(', '),
    };
    _transactions = [transaction, ..._transactions];
    setStored(STORAGE_KEYS.TRANSACTIONS, _transactions);

    return { job: updatedJob, transaction };
  },

  async getRecyclers(): Promise<Recycler[]> {
    await randomDelay();
    return [...SEED_RECYCLERS];
  },

  async getTransactions(): Promise<Transaction[]> {
    await randomDelay();
    return [..._transactions];
  },

  async getAdminStats(): Promise<AdminStats> {
    await randomDelay();
    return {
      workersRegistered: 1284,
      safetyScans: 8421,
      hazardsReported: 318 + _userReports.length,
      trainingCompleted: 2847,
      isSample: true,
    };
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
      category: r.category as HazardCategory,
      id: genId('rep'),
      createdAt: new Date().toISOString(),
    };
    _userReports = [report, ..._userReports];
    setStored(STORAGE_KEYS.REPORTS, _userReports);
    return report;
  },
};

export default api;
