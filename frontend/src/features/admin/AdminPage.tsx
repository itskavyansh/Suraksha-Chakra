import React, { useEffect, useState } from 'react';
import api from '../../data/api';
import type { AdminStats, HazardReport } from '../../types';
import { AdminSidebar, type AdminTab } from './components/AdminSidebar';
import { AdminKPIs } from './components/AdminKPIs';
import { HazardDonut } from './components/HazardDonut';
import { HazardHeatmap } from './components/HazardHeatmap';
import { ReportsTable } from './components/ReportsTable';
import { SampleView } from './components/SampleView';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([api.getAdminStats(), api.getHazardReports()])
      .then(([s, r]) => {
        if (active) {
          setStats(s);
          setReports(r);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Nav (Desktop) / Mobile Tabs */}
      <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Tab Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-8 h-8 border-3 border-brand-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <>
                <AdminKPIs stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <HazardDonut reports={reports} />
                  <HazardHeatmap reports={reports} />
                </div>

                <ReportsTable reports={reports} />
              </>
            )}

            {activeTab === 'reports' && (
              <>
                <HazardHeatmap reports={reports} />
                <ReportsTable reports={reports} />
              </>
            )}

            {activeTab !== 'dashboard' && activeTab !== 'reports' && (
              <SampleView tab={activeTab} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
