import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layers } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import type { AdminTab } from './AdminSidebar';

interface SampleViewProps {
  tab: AdminTab;
}

export const SampleView: React.FC<SampleViewProps> = ({ tab }) => {
  const { t } = useTranslation();

  const sampleRows: Record<
    string,
    { col1: string; col2: string; col3: string; status: string }[]
  > = {
    workers: [
      { col1: 'Ramesh Kumar (SC-DEL-000142)', col2: 'Janakpuri / Delhi', col3: '85 Safety Score', status: 'Active' },
      { col1: 'Sita Devi (SC-DEL-000219)', col2: 'Dwarka / Delhi', col3: '92 Safety Score', status: 'Active' },
      { col1: 'Mohan Lal (SC-DEL-000304)', col2: 'Rohini / Delhi', col3: '78 Safety Score', status: 'Active' },
    ],
    jobs: [
      { col1: 'Bulk Packaging Clearout', col2: 'Pitampura Market (35 kg)', col3: '₹450 Est.', status: 'Open' },
      { col1: 'Society Office Paper', col2: 'Lajpat Nagar IV (20 kg)', col3: '₹240 Est.', status: 'Accepted' },
      { col1: 'RWA Dry Waste Collection', col2: 'Dwarka Sector 12 (25 kg)', col3: '₹340 Est.', status: 'Done' },
    ],
    recyclers: [
      { col1: 'Sample Recycler: Narela Hub', col2: 'Narela Industrial Area', col3: 'PET, Cardboard, Iron', status: 'Verified' },
      { col1: 'Sample Recycler: Mayapuri Metal', col2: 'Mayapuri Phase 2', col3: 'Iron, Aluminium, Copper', status: 'Verified' },
      { col1: 'Sample Recycler: Ghazipur Local', col2: 'Ghazipur Mandi Road', col3: 'Cardboard, Glass', status: 'Standard' },
    ],
    training: [
      { col1: 'Safe Handling of Sharps', col2: '4 min duration', col3: '840 workers passed', status: '94% Pass' },
      { col1: 'Broken Glass & Sharp Metal', col2: '5 min duration', col3: '720 workers passed', status: '89% Pass' },
      { col1: 'Batteries & E-Waste Handling', col2: '4 min duration', col3: '650 workers passed', status: '91% Pass' },
    ],
    analytics: [
      { col1: 'Hazard Scan Accuracy (CLIP In-Browser)', col2: 'Zero-shot Quantized WASM', col3: '0.0% Dangerous Miss Rate', status: 'Optimal' },
      { col1: 'Worker Daily Active Participation', col2: 'Delhi Municipal Wards', col3: '1,284 Verified Enrolled', status: 'Growing' },
      { col1: 'Direct Waste Value Realization', col2: 'Aggregated Local Recyclers', col3: '₹42,800 Generated MTD', status: 'Audited' },
    ],
  };

  const rows = sampleRows[tab] || sampleRows.workers;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-700" />
          <h3 className="font-bold text-sm text-slate-900 capitalize">
            {t(`admin.nav.${tab}`)} — {t('admin.sample_view')}
          </h3>
        </div>
        <Badge variant="neutral">{t('common.sample_data')}</Badge>
      </div>

      <p className="text-xs text-slate-500">
        {t('admin.sample_view_desc')}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold">
              <th className="pb-2">Details</th>
              <th className="pb-2">Location / Scope</th>
              <th className="pb-2">Metrics</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 font-semibold text-slate-900">{r.col1}</td>
                <td className="py-3 text-slate-600">{r.col2}</td>
                <td className="py-3 text-slate-600 font-medium">{r.col3}</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
