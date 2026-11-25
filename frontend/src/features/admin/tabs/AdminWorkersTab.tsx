import React, { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Worker, Account } from '@/types';
import { SAMPLE_WORKERS, DEMO_WORKER } from '@/data/seed/workers';

export const AdminWorkersTab: React.FC = () => {
  const [workers, setWorkers] = useState<(Worker & { isLocalDevice?: boolean })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<(Worker & { isLocalDevice?: boolean }) | null>(null);

  useEffect(() => {
    // Combine sample workers with local accounts
    try {
      const rawAccounts = localStorage.getItem('sc_accounts');
      const localAccounts: Account[] = rawAccounts ? JSON.parse(rawAccounts) : [];
      const localWithFlag = localAccounts.map((a) => ({
        ...a,
        isLocalDevice: true,
      }));

      // Include demo worker as local demo
      const demoWorkerWithFlag = { ...DEMO_WORKER, isLocalDevice: true };

      const all = [demoWorkerWithFlag, ...localWithFlag, ...SAMPLE_WORKERS];
      setWorkers(all);
    } catch {
      setWorkers([DEMO_WORKER, ...SAMPLE_WORKERS]);
    }
  }, []);

  const filtered = workers.filter((w) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.workerId.toLowerCase().includes(q) ||
      w.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search workers by name, ID or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-ink-100 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
        <Badge variant="sample" />
      </div>

      {/* Workers Table */}
      <Card className="overflow-hidden p-0 border border-ink-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ink-100/50 border-b border-ink-100 text-ink-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Worker ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">City</th>
                <th className="p-3">Safety Score</th>
                <th className="p-3">Skills</th>
                <th className="p-3">Device Origin</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((worker) => {
                const maskedPhone = worker.phone.replace(/^(\d{2})\d{4}(\d{4})$/, '$1****$2');

                return (
                  <tr
                    key={worker.id}
                    onClick={() => setSelectedWorker(worker)}
                    className="hover:bg-ink-100/30 transition-colors cursor-pointer"
                  >
                    <td className="p-3 font-mono font-bold text-ink-900">{worker.workerId}</td>
                    <td className="p-3">
                      <span className="font-semibold text-ink-900 block">{worker.name}</span>
                      <span className="text-[11px] text-ink-500 font-mono">{maskedPhone}</span>
                    </td>
                    <td className="p-3 text-ink-500">{worker.city}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-12 bg-ink-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-700 h-full rounded-full"
                            style={{ width: `${worker.safetyScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-ink-900 text-[11px]">{worker.safetyScore}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {worker.skills.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded bg-ink-100 text-[10px] text-ink-500 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                        {worker.skills.length > 2 && (
                          <span className="text-[10px] text-ink-500 font-medium">
                            +{worker.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      {worker.isLocalDevice ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-900 border border-brand-500/20">
                          This device
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-ink-100 text-ink-500">
                          Sample registry
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWorker(worker);
                        }}
                        className="p-1.5 rounded-lg hover:bg-brand-100 text-brand-700 transition-colors inline-flex items-center"
                        aria-label={`View details for ${worker.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Worker Detail Modal */}
      {selectedWorker && (
        <Modal
          isOpen={!!selectedWorker}
          onClose={() => setSelectedWorker(null)}
          title={`Worker Profile: ${selectedWorker.name}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-brand-100/40 border border-brand-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-700">Digital Passport ID</span>
                <h3 className="text-base font-bold text-brand-900">{selectedWorker.name}</h3>
                <p className="text-xs font-mono text-ink-500 mt-0.5">{selectedWorker.workerId}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-brand-700 block">Safety Score</span>
                <span className="text-xl font-black text-brand-900">{selectedWorker.safetyScore} / 100</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-ink-100">
                <span className="text-ink-500">City / Ward</span>
                <span className="font-semibold text-ink-900">{selectedWorker.city}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ink-100">
                <span className="text-ink-500">Phone</span>
                <span className="font-mono text-ink-900">
                  {selectedWorker.phone.replace(/^(\d{2})\d{4}(\d{4})$/, '$1****$2')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-ink-100">
                <span className="text-ink-500">Language</span>
                <span className="uppercase font-semibold text-ink-900">{selectedWorker.preferredLanguage}</span>
              </div>
              <div className="py-1.5">
                <span className="text-ink-500 block mb-1">Skills & Specializations</span>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedWorker.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-ink-100 text-ink-900 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Button variant="primary" className="w-full" onClick={() => setSelectedWorker(null)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
