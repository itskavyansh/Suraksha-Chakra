import type { Worker, Job, TrainingModule, Recycler } from '../types';

// Mock seed data
const MOCK_WORKER: Worker = {
  id: 'worker-001',
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  city: 'Delhi',
  skills: ['Segregation', 'Door-to-door collection'],
  joinedAt: '2023-04-15',
  safetyScore: 82,
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const randomDelay = () => delay(200 + Math.random() * 200);

// ─────────────────────────────────────────────────
//  Data access layer — swap only this file for a
//  real backend without touching any component.
// ─────────────────────────────────────────────────
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
};

export default api;
