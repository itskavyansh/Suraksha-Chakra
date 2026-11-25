import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/app/routes';
import { AdminStats, HazardReport } from '@/types';
import { api } from '@/data/api';
import { AdminKpiCards } from './components/AdminKpiCards';
import { AdminHazardMap } from './components/AdminHazardMap';
import { AdminDonutChart } from './components/AdminDonutChart';
import { AdminReportsTab } from './tabs/AdminReportsTab';
import { AdminWorkersTab } from './tabs/AdminWorkersTab';
import {
  AdminJobsTab,
  AdminRecyclersTab,
  AdminTrainingTab,
  AdminAnalyticsTab,
} from './tabs/AdminOtherTabs';

export const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [adminStats, hazardReports] = await Promise.all([
          api.getAdminStats(),
          api.getHazardReports(),
        ]);
        if (mounted) {
          setStats(adminStats);
          setReports(hazardReports);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center p-12 text-xs text-ink-500">
        <div className="w-5 h-5 rounded-full border-2 border-brand-700 border-t-transparent animate-spin mr-2" />
        <span>Loading admin intelligence data...</span>
      </div>
    );
  }

  // Switch by active tab
  if (currentTab === 'reports') {
    return <AdminReportsTab reports={reports} />;
  }
  if (currentTab === 'workers') {
    return <AdminWorkersTab />;
  }
  if (currentTab === 'jobs') {
    return <AdminJobsTab />;
  }
  if (currentTab === 'recyclers') {
    return <AdminRecyclersTab />;
  }
  if (currentTab === 'training') {
    return <AdminTrainingTab />;
  }
  if (currentTab === 'analytics') {
    return <AdminAnalyticsTab />;
  }

  // Default 'dashboard' tab view
  return (
    <div className="space-y-6">
      {/* 5 KPI Cards */}
      <AdminKpiCards stats={stats} />

      {/* Main Grid: Map & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ward Hazard Intelligence Map */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-700" />
                <span>{t('admin.wardIntelligence')}</span>
              </h2>
              <p className="text-xs text-ink-500">Live GPS hazard flags from informal waste workers</p>
            </div>
            <Badge variant="sample" />
          </div>

          <AdminHazardMap reports={reports} height="400px" />
        </div>

        {/* Right 1 Col: Donut Breakdown */}
        <div className="space-y-2">
          <AdminDonutChart breakdown={stats.categoryBreakdown} />
        </div>
      </div>

      {/* Recent Hazard Reports Quick Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-ink-900">Recent Incident Reports</h2>
            <p className="text-xs text-ink-500">Latest 5 hazards flagged in Delhi NCR wards</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-brand-700 font-bold"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => navigate(`${ROUTES.admin}?tab=reports`)}
          >
            View all ({reports.length})
          </Button>
        </div>

        <Card className="overflow-hidden p-0 border border-ink-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ink-100/50 border-b border-ink-100 text-ink-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Item Label</th>
                  <th className="p-3">Worker</th>
                  <th className="p-3">Reported At</th>
                  <th className="p-3 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {reports.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-ink-100/30">
                    <td className="p-3 capitalize font-bold text-ink-900">{r.category}</td>
                    <td className="p-3 font-medium text-ink-900">{r.label}</td>
                    <td className="p-3 font-mono text-ink-500">{r.workerId}</td>
                    <td className="p-3 text-ink-500">{r.createdAt.split('T')[0]}</td>
                    <td className="p-3 text-right font-mono font-bold text-brand-700">
                      {Math.round(r.confidence * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
