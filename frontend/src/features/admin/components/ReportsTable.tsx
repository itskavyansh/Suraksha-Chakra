import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import type { HazardReport } from '../../../types';

interface ReportsTableProps {
  reports: HazardReport[];
}

export const ReportsTable: React.FC<ReportsTableProps> = ({ reports }) => {
  const { t } = useTranslation();

  // Sort by latest created first
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900">
          {t('admin.recent_reports')}
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {reports.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold">
              <th className="pb-2.5 pr-3">{t('admin.table_time')}</th>
              <th className="pb-2.5 pr-3">{t('admin.table_category')}</th>
              <th className="pb-2.5 pr-3">{t('admin.table_label')}</th>
              <th className="pb-2.5 pr-3">{t('admin.table_conf')}</th>
              <th className="pb-2.5">{t('admin.table_loc')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedReports.map((r) => {
              const dateStr = new Date(r.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });
              const timeStr = new Date(r.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">
                    <span className="font-medium text-slate-700 block">{dateStr}</span>
                    <span className="text-[10px] text-slate-400">{timeStr}</span>
                  </td>

                  <td className="py-3 pr-3 whitespace-nowrap">
                    <Badge
                      variant={
                        r.category === 'sharps' || r.category === 'chemicals'
                          ? 'danger'
                          : r.category === 'glass' || r.category === 'batteries'
                            ? 'warn'
                            : 'neutral'
                      }
                    >
                      <span className="capitalize text-[11px]">{r.category}</span>
                    </Badge>
                  </td>

                  <td className="py-3 pr-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      {r.imageThumb ? (
                        <img
                          src={r.imageThumb}
                          alt={r.label}
                          className="w-7 h-7 rounded-md object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                          <ImageIcon className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="truncate max-w-[140px] sm:max-w-[200px]">{r.label}</span>
                    </div>
                  </td>

                  <td className="py-3 pr-3 text-slate-700 font-bold whitespace-nowrap">
                    {Math.round(r.confidence * 100)}%
                  </td>

                  <td className="py-3 text-slate-500 whitespace-nowrap">
                    {r.lat !== null && r.lng !== null ? (
                      <span className="flex items-center gap-1 font-mono text-[11px] text-slate-700">
                        <MapPin className="w-3 h-3 text-brand-700 flex-shrink-0" />
                        {r.lat.toFixed(2)}, {r.lng.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">
                        {t('admin.not_shared')}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
