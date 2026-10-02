import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Scan, AlertTriangle, GraduationCap } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import type { AdminStats } from '../../../types';

interface AdminKPIsProps {
  stats: AdminStats | null;
}

export const AdminKPIs: React.FC<AdminKPIsProps> = ({ stats }) => {
  const { t } = useTranslation();

  const cards = [
    {
      label: t('admin.kpi_workers'),
      value: stats?.workersRegistered?.toLocaleString('en-IN') ?? '1,284',
      icon: Users,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: t('admin.kpi_scans'),
      value: stats?.safetyScans?.toLocaleString('en-IN') ?? '8,421',
      icon: Scan,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: t('admin.kpi_hazards'),
      value: stats?.hazardsReported?.toLocaleString('en-IN') ?? '318',
      icon: AlertTriangle,
      color: 'bg-rose-50 text-rose-700',
    },
    {
      label: t('admin.kpi_training'),
      value: stats?.trainingCompleted?.toLocaleString('en-IN') ?? '2,847',
      icon: GraduationCap,
      color: 'bg-purple-50 text-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <Badge variant="neutral">
                <span className="text-[10px]">{t('common.sample_data')}</span>
              </Badge>
            </div>

            <div>
              <span className="text-2xl font-extrabold text-slate-900 block leading-tight">
                {c.value}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
                {c.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
