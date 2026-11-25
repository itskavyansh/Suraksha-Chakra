import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Job } from '@/types';
import { SEED_JOBS } from '@/data/seed/jobs';
import { SEED_RECYCLERS } from '@/data/seed/recyclers';

// --- JOBS TAB ---
export const AdminJobsTab: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    setJobs(SEED_JOBS);
  }, []);

  const filtered = jobs.filter((j) => (statusFilter === 'all' ? true : j.status === statusFilter));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['all', 'available', 'accepted', 'completed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-ink-100 text-ink-900 hover:bg-ink-100/80'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <Badge variant="sample" />
      </div>

      <Card className="overflow-hidden p-0 border border-ink-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ink-100/50 border-b border-ink-100 text-ink-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Area</th>
                <th className="p-3">Distance</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Est. Value</th>
                <th className="p-3">Status</th>
                <th className="p-3">Posted By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((j) => (
                <tr key={j.id} className="hover:bg-ink-100/30">
                  <td className="p-3 font-semibold text-ink-900">{j.title}</td>
                  <td className="p-3 text-ink-500">{j.area}</td>
                  <td className="p-3 font-mono">{j.distanceKm} km</td>
                  <td className="p-3 font-mono">{j.estKg} kg</td>
                  <td className="p-3 font-bold text-brand-700">₹{j.estValue}</td>
                  <td className="p-3">
                    <span className="capitalize px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-100 text-brand-900">
                      {j.status}
                    </span>
                  </td>
                  <td className="p-3 text-ink-500">{j.postedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- RECYCLERS TAB ---
export const AdminRecyclersTab: React.FC = () => {
  const [filterVerified, setFilterVerified] = useState<boolean | null>(null);

  const recyclers = SEED_RECYCLERS.filter((r) =>
    filterVerified === null ? true : r.isVerified === filterVerified
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilterVerified(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              filterVerified === null ? 'bg-brand-700 text-white' : 'bg-white border border-ink-100'
            }`}
          >
            All Recyclers
          </button>
          <button
            type="button"
            onClick={() => setFilterVerified(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              filterVerified === true ? 'bg-brand-700 text-white' : 'bg-white border border-ink-100'
            }`}
          >
            Verified Only
          </button>
        </div>
        <Badge variant="sample" />
      </div>

      <Card className="overflow-hidden p-0 border border-ink-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ink-100/50 border-b border-ink-100 text-ink-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Center Name</th>
                <th className="p-3">Area</th>
                <th className="p-3">Verification</th>
                <th className="p-3">Materials Accepted</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {recyclers.map((r) => (
                <tr key={r.id} className="hover:bg-ink-100/30">
                  <td className="p-3 font-semibold text-ink-900">{r.name}</td>
                  <td className="p-3 text-ink-500">{r.area}</td>
                  <td className="p-3">
                    {r.isVerified ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                      </span>
                    ) : (
                      <span className="text-ink-500 text-[10px]">Pending</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="text-ink-500 text-xs">{r.materials.join(', ')}</span>
                  </td>
                  <td className="p-3 font-mono text-ink-900">{r.phone}</td>
                  <td className="p-3 text-ink-500">{r.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- TRAINING TAB ---
export const AdminTrainingTab: React.FC = () => {
  const chartData = [
    { name: 'Mod 1: Sharps', completed: 840 },
    { name: 'Mod 2: Glass', completed: 720 },
    { name: 'Mod 3: Batteries', completed: 540 },
    { name: 'Mod 4: Chemicals', completed: 430 },
    { name: 'Mod 5: Medical', completed: 317 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-ink-900">Training Completion by Module</h2>
          <p className="text-xs text-ink-500">2,847 total module completions logged across Delhi NCR</p>
        </div>
        <Badge variant="sample" />
      </div>

      <Card className="p-4">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5C6B64' }} interval={0} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#5C6B64' }} />
              <Tooltip
                formatter={(val: number) => [`${val} workers`, 'Completed']}
                contentStyle={{ borderRadius: '0.75rem', fontSize: '12px', border: '1px solid #EEF1EF' }}
              />
              <Bar dataKey="completed" fill="#0F5C3A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

// --- ANALYTICS TAB ---
export const AdminAnalyticsTab: React.FC = () => {
  // 30-day mock trend data
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    day: `D${i + 1}`,
    scans: Math.round(180 + Math.sin(i / 2) * 40 + i * 4),
    hazards: Math.round(25 + Math.cos(i / 3) * 10 + i * 1.5),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-ink-900">30-Day Activity & Hazard Trends</h2>
          <p className="text-xs text-ink-500">Daily scans vs dangerous hazard alerts</p>
        </div>
        <Badge variant="sample" />
      </div>

      <Card className="p-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#5C6B64' }} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: '#5C6B64' }} />
              <Tooltip
                contentStyle={{ borderRadius: '0.75rem', fontSize: '12px', border: '1px solid #EEF1EF' }}
              />
              <Line type="monotone" dataKey="scans" stroke="#0F5C3A" strokeWidth={2} dot={false} name="Total Scans" />
              <Line type="monotone" dataKey="hazards" stroke="#C62828" strokeWidth={2} dot={false} name="Hazards Flagged" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
