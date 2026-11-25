import React, { useState } from 'react';
import {
  Download,
  Search,
  MapPin,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { HazardReport } from '@/types';
import { AdminHazardMap, CATEGORY_COLORS } from '../components/AdminHazardMap';
import { useToast } from '@/components/ui/Toast';

interface AdminReportsTabProps {
  reports: HazardReport[];
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({ reports }) => {
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [focusedReport, setFocusedReport] = useState<HazardReport | null>(null);

  const categories = ['all', 'sharps', 'glass', 'batteries', 'chemicals', 'medical', 'general', 'unknown'];

  const filtered = reports.filter((r) => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.label.toLowerCase().includes(q) ||
        r.workerId.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageReports = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'Category', 'Label', 'Confidence', 'Latitude', 'Longitude', 'WorkerID', 'CreatedAt'];
      const rows = sorted.map((r) => [
        r.id,
        r.category,
        `"${r.label.replace(/"/g, '""')}"`,
        r.confidence,
        r.lat ?? '',
        r.lng ?? '',
        r.workerId,
        r.createdAt,
      ]);
      const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `suraksha-hazard-reports-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Exported CSV report', 'success');
    } catch {
      showToast('Failed to export CSV', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search reports by hazard label or worker ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-ink-100 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center space-x-1 px-3 py-2 bg-white rounded-xl border border-ink-100 text-xs font-semibold text-ink-900 hover:bg-ink-100/60 min-h-[44px]"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-700" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>

          <Button
            size="sm"
            variant="ghost"
            className="border border-ink-100 text-xs font-bold bg-white text-brand-700"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = categoryFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategoryFilter(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-colors min-h-[36px] ${
                isSelected
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-ink-100 text-ink-900 hover:bg-ink-100/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden p-0 border border-ink-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ink-100/50 border-b border-ink-100 text-ink-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Label</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Location</th>
                <th className="p-3">Worker ID</th>
                <th className="p-3">Reported</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {pageReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-ink-500">
                    No hazard reports found matching current filters.
                  </td>
                </tr>
              ) : (
                pageReports.map((report) => {
                  const catColor = CATEGORY_COLORS[report.category] || '#5C6B64';
                  const hasGeo = typeof report.lat === 'number' && typeof report.lng === 'number';

                  return (
                    <tr key={report.id} className="hover:bg-ink-100/30 transition-colors">
                      <td className="p-3">
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase inline-block"
                          style={{
                            color: catColor,
                            backgroundColor: `${catColor}15`,
                            border: `1px solid ${catColor}30`,
                          }}
                        >
                          {report.category}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-ink-900">{report.label}</td>
                      <td className="p-3 font-mono text-ink-500">{Math.round(report.confidence * 100)}%</td>
                      <td className="p-3">
                        {hasGeo ? (
                          <span className="flex items-center text-ink-900 font-mono text-[11px]">
                            <MapPin className="w-3 h-3 mr-1 text-brand-700 shrink-0" />
                            {report.lat!.toFixed(3)}, {report.lng!.toFixed(3)}
                          </span>
                        ) : (
                          <span className="text-ink-500 text-[11px]">No GPS</span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-ink-900">{report.workerId}</td>
                      <td className="p-3 text-ink-500 whitespace-nowrap">
                        {report.createdAt.split('T')[0]}
                      </td>
                      <td className="p-3 text-right">
                        {hasGeo && (
                          <button
                            type="button"
                            onClick={() => setFocusedReport(report)}
                            className="p-1.5 rounded-lg hover:bg-brand-100 text-brand-700 transition-colors inline-flex items-center"
                            aria-label={`View ${report.label} on map`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-white border-t border-ink-100 flex items-center justify-between text-xs text-ink-500">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} reports
          </span>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded-lg border border-ink-100 disabled:opacity-40 hover:bg-ink-100 min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-ink-900">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded-lg border border-ink-100 disabled:opacity-40 hover:bg-ink-100 min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Map Focus Modal */}
      {focusedReport && (
        <Modal
          isOpen={!!focusedReport}
          onClose={() => setFocusedReport(null)}
          title={`Hazard Location: ${focusedReport.label}`}
        >
          <div className="space-y-3">
            <AdminHazardMap
              reports={[focusedReport]}
              height="280px"
              center={[focusedReport.lat!, focusedReport.lng!]}
              zoom={14}
            />
            <div className="p-3 rounded-xl bg-ink-100/50 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-ink-500">Reported by:</span>
                <span className="font-mono font-bold text-ink-900">{focusedReport.workerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Coordinates:</span>
                <span className="font-mono text-ink-900">{focusedReport.lat}, {focusedReport.lng}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Confidence:</span>
                <span className="font-bold text-brand-700">{Math.round(focusedReport.confidence * 100)}%</span>
              </div>
            </div>
            <Button variant="primary" className="w-full" onClick={() => setFocusedReport(null)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
