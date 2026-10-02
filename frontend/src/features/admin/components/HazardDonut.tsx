import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { HazardReport, HazardCategory } from '../../../types';

interface HazardDonutProps {
  reports: HazardReport[];
}

const CATEGORY_COLORS: Record<HazardCategory, string> = {
  sharps: '#DC2626',
  glass: '#0284C7',
  batteries: '#D97706',
  chemicals: '#7C3AED',
  medical: '#E11D48',
  general: '#16A34A',
  unknown: '#64748B',
};

export const HazardDonut: React.FC<HazardDonutProps> = ({ reports }) => {
  const { t } = useTranslation();

  const counts: Record<HazardCategory, number> = {
    sharps: 0,
    glass: 0,
    batteries: 0,
    chemicals: 0,
    medical: 0,
    general: 0,
    unknown: 0,
  };

  for (const r of reports) {
    if (counts[r.category] !== undefined) {
      counts[r.category]++;
    } else {
      counts.unknown++;
    }
  }

  const total = reports.length || 1;

  const data = (Object.keys(counts) as HazardCategory[])
    .filter((cat) => counts[cat] > 0)
    .map((cat) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      category: cat,
      value: counts[cat],
      pct: Math.round((counts[cat] / total) * 100),
      color: CATEGORY_COLORS[cat] || '#64748B',
    }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      <h3 className="font-bold text-sm text-slate-900 mb-3">
        {t('admin.hazard_donut_title')}
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Donut Chart */}
        <div className="w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val: any) => [`${val} reports`, 'Count']}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  fontSize: '12px',
                }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={68}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with percentages */}
        <div className="flex-1 w-full grid grid-cols-2 gap-2 text-xs">
          {data.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 truncate">{item.name}</span>
              <span className="ml-auto font-bold text-slate-900">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
