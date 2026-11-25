import {
  Worker,
  Account,
  Job,
  TrainingModule,
  TrainingProgress,
  Recycler,
  Transaction,
  HazardReport,
  Clinic,
  Incident,
  PublicPassport,
  PassportSnapshotData,
  MaterialRate,
  AdminStats,
} from '@/types';
import { DEMO_WORKER, INITIAL_DEMO_TRAINING_PROGRESS, SAMPLE_WORKERS } from './seed/workers';
import { TRAINING_MODULES } from './seed/training';
import { SEED_JOBS } from './seed/jobs';
import { SEED_RECYCLERS } from './seed/recyclers';
import { MATERIAL_RATES } from './seed/rates';
import { SEED_TRANSACTIONS } from './seed/transactions';
import { SEED_HAZARD_REPORTS } from './seed/reports';
import { SEED_CLINICS } from './seed/clinics';

// Storage keys
const STORAGE_ACCOUNTS = 'sc_accounts';
const STORAGE_SESSION = 'sc_session';

// Artificial delay 200-400ms
const delay = (ms?: number) =>
  new Promise((res) => setTimeout(res, ms ?? (200 + Math.random() * 200)));

// Safe SHA-256 PIN hashing with fallback
export async function hashPin(pin: string): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(pin);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Fallback if crypto.subtle is unavailable
  }
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    hash = (hash << 5) - hash + pin.charCodeAt(i);
    hash |= 0;
  }
  return 'fb_' + Math.abs(hash).toString(16);
}

// Storage helpers
function getSessionItem<T>(key: string, defaultValue: T): T {
  try {
    const val = sessionStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setSessionItem<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export const api = {
  // --- AUTH & ACCOUNTS ---
  async getCurrentWorker(): Promise<Worker | null> {
    await delay(100);
    try {
      const session = getLocalItem<{ user: Worker } | null>(STORAGE_SESSION, null);
      return session?.user || null;
    } catch {
      return null;
    }
  },

  async createAccount(
    data: Omit<Account, 'id' | 'workerId' | 'safetyScore' | 'createdAt'>
  ): Promise<Worker> {
    await delay();
    const accounts = getLocalItem<Account[]>(STORAGE_ACCOUNTS, []);

    // Check duplicate phone
    const existing = accounts.find((a) => a.phone === data.phone);
    if (existing) {
      throw new Error('DUPLICATE_PHONE');
    }

    const cityCodes: Record<string, string> = {
      Delhi: 'DEL',
      Gurugram: 'GUR',
      Noida: 'NOI',
      Ghaziabad: 'GHA',
      Faridabad: 'FAR',
    };
    const code = cityCodes[data.city] || 'OTH';
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const workerId = `SC-${code}-${randomDigits}`;
    const id = `user-${Date.now()}`;

    const newAccount: Account = {
      ...data,
      id,
      workerId,
      safetyScore: 50,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    setLocalItem(STORAGE_ACCOUNTS, accounts);

    const { pinHash: _pin, ...worker } = newAccount;
    setLocalItem(STORAGE_SESSION, { user: worker, isDemo: false });
    return worker;
  },

  async findAccountByPhone(phone: string): Promise<Account | null> {
    await delay();
    if (phone === DEMO_WORKER.phone) {
      return { ...DEMO_WORKER, pinHash: await hashPin('1234') };
    }
    const accounts = getLocalItem<Account[]>(STORAGE_ACCOUNTS, []);
    return accounts.find((a) => a.phone === phone) || null;
  },

  async verifyLogin(phone: string, pin: string): Promise<{ success: boolean; worker?: Worker }> {
    await delay();
    if (phone === DEMO_WORKER.phone && pin === '1234') {
      const worker = DEMO_WORKER;
      setLocalItem(STORAGE_SESSION, { user: worker, isDemo: true });
      return { success: true, worker };
    }

    const accounts = getLocalItem<Account[]>(STORAGE_ACCOUNTS, []);
    const account = accounts.find((a) => a.phone === phone);
    if (!account) {
      return { success: false };
    }

    const enteredHash = await hashPin(pin);
    if (account.pinHash === enteredHash) {
      const { pinHash: _pin, ...worker } = account;
      setLocalItem(STORAGE_SESSION, { user: worker, isDemo: false });
      return { success: true, worker };
    }

    return { success: false };
  },

  async updateAccount(
    userId: string,
    updates: Partial<Omit<Account, 'id' | 'workerId' | 'pinHash'>>
  ): Promise<Worker> {
    await delay();
    if (userId === DEMO_WORKER.id) {
      const updated = { ...DEMO_WORKER, ...updates };
      setLocalItem(STORAGE_SESSION, { user: updated, isDemo: true });
      return updated;
    }

    const accounts = getLocalItem<Account[]>(STORAGE_ACCOUNTS, []);
    const idx = accounts.findIndex((a) => a.id === userId);
    if (idx === -1) {
      throw new Error('User not found');
    }

    const updatedAccount = { ...accounts[idx], ...updates };
    accounts[idx] = updatedAccount;
    setLocalItem(STORAGE_ACCOUNTS, accounts);

    const { pinHash: _pin, ...worker } = updatedAccount;
    setLocalItem(STORAGE_SESSION, { user: worker, isDemo: false });
    return worker;
  },

  async deleteAccount(userId: string): Promise<boolean> {
    await delay();
    if (userId === DEMO_WORKER.id) {
      return false;
    }
    const accounts = getLocalItem<Account[]>(STORAGE_ACCOUNTS, []);
    const filtered = accounts.filter((a) => a.id !== userId);
    setLocalItem(STORAGE_ACCOUNTS, filtered);

    // Clean user session keys
    try {
      sessionStorage.removeItem(`sc_${userId}_training`);
      sessionStorage.removeItem(`sc_${userId}_jobs`);
      sessionStorage.removeItem(`sc_${userId}_transactions`);
      sessionStorage.removeItem(`sc_${userId}_incidents`);
      localStorage.removeItem(STORAGE_SESSION);
    } catch {
      // Ignore
    }
    return true;
  },

  async resetPin(phone: string, newPin: string): Promise<boolean> {
    await delay();
    const accounts = getLocalItem<Account[]>(STORAGE_ACCOUNTS, []);
    const idx = accounts.findIndex((a) => a.phone === phone);
    if (idx === -1) {
      return false;
    }
    accounts[idx].pinHash = await hashPin(newPin);
    setLocalItem(STORAGE_ACCOUNTS, accounts);
    return true;
  },

  async resetDemoData(): Promise<void> {
    await delay();
    try {
      sessionStorage.removeItem(`sc_demo-ramesh_training`);
      sessionStorage.removeItem(`sc_demo-ramesh_jobs`);
      sessionStorage.removeItem(`sc_demo-ramesh_transactions`);
      sessionStorage.removeItem(`sc_demo-ramesh_incidents`);
      setLocalItem(STORAGE_SESSION, { user: DEMO_WORKER, isDemo: true });
    } catch {
      // Ignore
    }
  },

  // --- TRAINING ---
  async getTrainingModules(): Promise<TrainingModule[]> {
    await delay();
    return TRAINING_MODULES;
  },

  async getTrainingProgress(userId: string): Promise<TrainingProgress> {
    await delay();
    const key = `sc_${userId}_training`;
    if (userId === DEMO_WORKER.id) {
      return getSessionItem<TrainingProgress>(key, INITIAL_DEMO_TRAINING_PROGRESS);
    }
    return getSessionItem<TrainingProgress>(key, {});
  },

  async completeTrainingModule(
    userId: string,
    moduleId: string,
    score: number
  ): Promise<{ progress: TrainingProgress; newSafetyScore: number }> {
    await delay();
    const key = `sc_${userId}_training`;
    const progress = await this.getTrainingProgress(userId);

    const isFirstTime = !progress[moduleId]?.completed;
    progress[moduleId] = {
      moduleId,
      completed: true,
      score,
      completedAt: new Date().toISOString(),
    };
    setSessionItem(key, progress);

    let safetyScore = 50;
    const session = getLocalItem<{ user: Worker } | null>(STORAGE_SESSION, null);
    if (session?.user && session.user.id === userId) {
      safetyScore = isFirstTime ? Math.min(100, session.user.safetyScore + 5) : session.user.safetyScore;
      session.user.safetyScore = safetyScore;
      setLocalItem(STORAGE_SESSION, session);
    }

    return { progress, newSafetyScore: safetyScore };
  },

  // --- JOBS ---
  async getJobs(userId: string): Promise<Job[]> {
    await delay();
    const key = `sc_${userId}_jobs`;
    return getSessionItem<Job[]>(key, SEED_JOBS);
  },

  async acceptJob(userId: string, jobId: string): Promise<Job> {
    await delay();
    const key = `sc_${userId}_jobs`;
    const jobs = await this.getJobs(userId);
    const job = jobs.find((j) => j.id === jobId);
    if (!job) throw new Error('Job not found');

    job.status = 'accepted';
    job.acceptedBy = userId;
    setSessionItem(key, jobs);
    return job;
  },

  async markJobDone(
    userId: string,
    jobId: string
  ): Promise<{ job: Job; transaction: Transaction; newSafetyScore: number }> {
    await delay();
    const jobsKey = `sc_${userId}_jobs`;
    const jobs = await this.getJobs(userId);
    const job = jobs.find((j) => j.id === jobId);
    if (!job) throw new Error('Job not found');

    job.status = 'completed';
    setSessionItem(jobsKey, jobs);

    // Create a transaction
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      userId,
      date: new Date().toISOString(),
      type: 'job',
      title: job.title,
      weightKg: job.estKg,
      amount: job.estValue,
    };

    const txKey = `sc_${userId}_transactions`;
    const currentTx = await this.getTransactions(userId);
    currentTx.unshift(tx);
    setSessionItem(txKey, currentTx);

    // Safety score +2
    let safetyScore = 50;
    const session = getLocalItem<{ user: Worker } | null>(STORAGE_SESSION, null);
    if (session?.user && session.user.id === userId) {
      safetyScore = Math.min(100, session.user.safetyScore + 2);
      session.user.safetyScore = safetyScore;
      setLocalItem(STORAGE_SESSION, session);
    }

    return { job, transaction: tx, newSafetyScore: safetyScore };
  },

  // --- RECYCLERS & RATES ---
  async getRecyclers(): Promise<Recycler[]> {
    await delay();
    return SEED_RECYCLERS;
  },

  async getMaterialRates(): Promise<MaterialRate[]> {
    await delay(100);
    return MATERIAL_RATES;
  },

  // --- TRANSACTIONS ---
  async getTransactions(userId: string): Promise<Transaction[]> {
    await delay();
    const key = `sc_${userId}_transactions`;
    if (userId === DEMO_WORKER.id) {
      return getSessionItem<Transaction[]>(key, SEED_TRANSACTIONS);
    }
    return getSessionItem<Transaction[]>(key, []);
  },

  // --- HAZARD REPORTS ---
  async submitHazardReport(
    reportData: Omit<HazardReport, 'id' | 'createdAt'>
  ): Promise<{ report: HazardReport; newSafetyScore: number }> {
    await delay();
    const newReport: HazardReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Store in reports list
    const reports = await this.getHazardReports();
    reports.unshift(newReport);
    setSessionItem('sc_hazard_reports', reports);

    // Safety score +5
    let safetyScore = 50;
    const session = getLocalItem<{ user: Worker } | null>(STORAGE_SESSION, null);
    if (session?.user && session.user.id === reportData.workerId) {
      safetyScore = Math.min(100, session.user.safetyScore + 5);
      session.user.safetyScore = safetyScore;
      setLocalItem(STORAGE_SESSION, session);
    }

    return { report: newReport, newSafetyScore: safetyScore };
  },

  async getHazardReports(): Promise<HazardReport[]> {
    await delay();
    return getSessionItem<HazardReport[]>('sc_hazard_reports', SEED_HAZARD_REPORTS);
  },

  // --- CLINICS & INCIDENTS ---
  async getClinics(): Promise<Clinic[]> {
    await delay();
    return SEED_CLINICS;
  },

  async saveIncident(incidentData: Omit<Incident, 'id' | 'createdAt'>): Promise<Incident> {
    await delay();
    const incident: Incident = {
      ...incidentData,
      id: `inc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const key = `sc_${incidentData.userId}_incidents`;
    const incidents = await this.getIncidents(incidentData.userId);
    incidents.unshift(incident);
    setSessionItem(key, incidents);
    return incident;
  },

  async getIncidents(userId?: string): Promise<Incident[]> {
    await delay();
    if (!userId) {
      // Return all incidents across users (for admin stats)
      const demoIncidents = getSessionItem<Incident[]>('sc_demo-ramesh_incidents', []);
      const localIncidents = getSessionItem<Incident[]>('sc_all_incidents', []);
      return [...demoIncidents, ...localIncidents];
    }
    const key = `sc_${userId}_incidents`;
    return getSessionItem<Incident[]>(key, []);
  },

  async deleteIncident(userId: string, incidentId: string): Promise<boolean> {
    await delay();
    const key = `sc_${userId}_incidents`;
    const incidents = await this.getIncidents(userId);
    const filtered = incidents.filter((i) => i.id !== incidentId);
    setSessionItem(key, filtered);
    return true;
  },

  // --- ADMIN STATS ---
  async getAdminStats(): Promise<AdminStats> {
    await delay();
    const reports = await this.getHazardReports();
    const incidents = await this.getIncidents();

    const breakdown: Record<string, number> = {
      sharps: 0,
      glass: 0,
      batteries: 0,
      chemicals: 0,
      medical: 0,
      general: 0,
      unknown: 0,
    };

    for (const r of reports) {
      if (breakdown[r.category] !== undefined) {
        breakdown[r.category]++;
      }
    }

    const localAccounts = getLocalItem<Account[]>(STORAGE_ACCOUNTS, []);
    const registeredCount = 1284 + localAccounts.length;

    return {
      workersRegistered: registeredCount,
      safetyScans: 8421 + (reports.length - SEED_HAZARD_REPORTS.length),
      hazardsReported: reports.length,
      trainingCompleted: 2847,
      injuriesLogged: 12 + incidents.length,
      categoryBreakdown: breakdown as Record<HazardReport['category'], number>,
    };
  },

  // --- PASSPORT SNAPSHOT & PUBLIC VERIFY ---
  buildPassportSnapshot(worker: Worker, completedModuleIds: string[]): string {
    try {
      const data: PassportSnapshotData = {
        name: worker.name,
        city: worker.city,
        skills: worker.skills,
        modules: completedModuleIds,
        score: worker.safetyScore,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      const json = JSON.stringify(data);
      const b64 = btoa(encodeURIComponent(json));
      return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch {
      return '';
    }
  },

  async getPublicPassport(workerId: string, snapshot?: string): Promise<PublicPassport | null> {
    await delay();
    // 1. Try decoding compact snapshot first (cross-device compatibility)
    if (snapshot) {
      try {
        if (snapshot.length < 1500) {
          const b64 = snapshot.replace(/-/g, '+').replace(/_/g, '/');
          const json = decodeURIComponent(atob(b64));
          const parsed = JSON.parse(json) as PassportSnapshotData;
          if (parsed.name && parsed.city && typeof parsed.score === 'number') {
            const modulesWithTitles = (parsed.modules || []).map((id) => {
              const mod = TRAINING_MODULES.find((m) => m.id === id);
              return { id, title: mod ? mod.id : id };
            });
            return {
              workerId,
              name: parsed.name,
              city: parsed.city,
              skills: parsed.skills || [],
              modulesCompleted: modulesWithTitles,
              safetyScore: parsed.score,
              updatedAt: parsed.updatedAt || new Date().toISOString().split('T')[0],
              isVerified: true,
            };
          }
        }
      } catch {
        // Fall back to local search or seed
      }
    }

    // 2. Fall back to demo worker SC-DEL-000142
    if (workerId === DEMO_WORKER.workerId) {
      return {
        workerId: DEMO_WORKER.workerId,
        name: DEMO_WORKER.name,
        city: DEMO_WORKER.city,
        skills: DEMO_WORKER.skills,
        modulesCompleted: [
          { id: 'mod-1', title: 'Safe Handling of Sharps' },
          { id: 'mod-2', title: 'Broken Glass and Sharp Metal' },
        ],
        safetyScore: DEMO_WORKER.safetyScore,
        updatedAt: '2024-03-01',
        isVerified: true,
      };
    }

    // 3. Check local registered accounts
    const localAccounts = getLocalItem<Account[]>(STORAGE_ACCOUNTS, []);
    const local = localAccounts.find((a) => a.workerId === workerId);
    if (local) {
      const progress = await this.getTrainingProgress(local.id);
      const completed = Object.keys(progress)
        .filter((k) => progress[k]?.completed)
        .map((k) => ({ id: k, title: k }));

      return {
        workerId: local.workerId,
        name: local.name,
        city: local.city,
        skills: local.skills,
        modulesCompleted: completed,
        safetyScore: local.safetyScore,
        updatedAt: local.createdAt.split('T')[0],
        isVerified: true,
      };
    }

    // 4. Check sample workers
    const sample = SAMPLE_WORKERS.find((w) => w.workerId === workerId);
    if (sample) {
      return {
        workerId: sample.workerId,
        name: sample.name,
        city: sample.city,
        skills: sample.skills,
        modulesCompleted: [
          { id: 'mod-1', title: 'Safe Handling of Sharps' },
        ],
        safetyScore: sample.safetyScore,
        updatedAt: sample.createdAt.split('T')[0],
        isVerified: true,
      };
    }

    return null;
  },
};
