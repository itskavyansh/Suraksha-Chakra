import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Scan, AlertTriangle, GraduationCap, HeartPulse } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AdminStats } from '@/types';

interface AdminKpiCardsProps {
  stats: AdminStats;
}

export const AdminKpiCards: React.FC<AdminKpiCardsProps> = ({ stats }) => {
  const { t } = useTranslation();

  const kpis = [
    {
      label: t('admin.kpiWorkers'),
      value: stats.workersRegistered.toLocaleString('en-IN'),
      icon: Users,
      color: 'text-brand-700',
      bg: 'bg-brand-100',
    },
    {
      label: t('admin.kpiScans'),
      value: stats.safetyScans.toLocaleString('en-IN'),
      icon: Scan,
      color: 'text-info-600',
      bg: 'bg-info-100',
    },
    {
      label: t('admin.kpiHazards'),
      value: stats.hazardsReported.toLocaleString('en-IN'),
      icon: AlertTriangle,
      color: 'text-danger-700',
      bg: 'bg-danger-100',
    },
    {
      label: t('admin.kpiTraining'),
      value: stats.trainingCompleted.toLocaleString('en-IN'),
      icon: GraduationCap,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: t('admin.kpiInjuries'),
      value: stats.injuriesLogged.toLocaleString('en-IN'),
      icon: HeartPulse,
      color: 'text-warn-500',
      bg: 'bg-warn-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <Card key={idx} className="p-3.5 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <Badge variant="sample" />
            </div>

            <div className="mt-2.5">
              <span className="text-xl sm:text-2xl font-black text-ink-900 block leading-tight">
                {kpi.value}
              </span>
              <span className="text-[11px] font-medium text-ink-500 line-clamp-1 mt-0.5">
                {kpi.label}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
