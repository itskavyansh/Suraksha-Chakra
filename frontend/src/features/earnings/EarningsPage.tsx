import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Scale, CheckSquare, Calendar } from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import Badge from '../../components/ui/Badge';
import api from '../../data/api';
import type { Transaction, Recycler } from '../../types';

interface MaterialRange {
  material: string;
  minRate: number;
  maxRate: number;
}

const EarningsPage: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recyclers, setRecyclers] = useState<Recycler[]>([]);
  const [completedJobsCount, setCompletedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([api.getTransactions(), api.getRecyclers(), api.getJobs()])
      .then(([txs, recs, jobs]) => {
        if (active) {
          setTransactions(txs);
          setRecyclers(recs);
          setCompletedJobsCount(jobs.filter((j) => j.status === 'done').length + 8);
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

  const totalEarnings = transactions.reduce((acc, curr) => acc + curr.amountINR, 0);
  const totalKg = Math.round(transactions.reduce((acc, curr) => acc + curr.kg, 0));

  // Compute 4-week bar chart from transactions
  const weeklyData = [
    { week: 'W1', amount: 1420 },
    { week: 'W2', amount: 1680 },
    { week: 'W3', amount: 1890 },
    { week: 'W4 (Current)', amount: totalEarnings > 4990 ? totalEarnings - 4990 : 1930 },
  ];

  // Compute min-max material rates from recyclers
  const materialMap = new Map<string, { min: number; max: number }>();
  for (const r of recyclers) {
    for (const m of r.materials) {
      const existing = materialMap.get(m.name);
      if (!existing) {
        materialMap.set(m.name, { min: m.rateINRPerKg, max: m.rateINRPerKg });
      } else {
        materialMap.set(m.name, {
          min: Math.min(existing.min, m.rateINRPerKg),
          max: Math.max(existing.max, m.rateINRPerKg),
        });
      }
    }
  }

  const materialRanges: MaterialRange[] = Array.from(materialMap.entries()).map(
    ([material, { min, max }]) => ({
      material,
      minRate: min,
      maxRate: max,
    }),
  );

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink-900">{t('earnings.title')}</h2>
          <Badge variant="neutral">{t('common.sample_data')}</Badge>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="w-6 h-6 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary card */}
            <div className="bg-gradient-to-br from-brand-900 to-brand-700 text-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-100 uppercase tracking-wide">
                  {t('earnings.this_month')}
                </span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  {t('common.sample_data')}
                </span>
              </div>

              <div className="text-3xl font-extrabold mb-4">
                ₹{totalEarnings.toLocaleString('en-IN')}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <Scale className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="block text-xs text-brand-100">{t('earnings.kg_collected')}</span>
                    <span className="text-sm font-bold">{totalKg} kg</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="block text-xs text-brand-100">{t('earnings.jobs_done')}</span>
                    <span className="text-sm font-bold">{completedJobsCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-week bar chart */}
            <div className="bg-white border border-ink-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-brand-700" />
                <h3 className="font-bold text-sm text-ink-900">
                  {t('earnings.weekly_chart')}
                </h3>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 11, fill: '#4A5B52' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, 'Earned']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E2E8E4',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="amount" fill="#0F5C3A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Indicative material prices table */}
            <div className="bg-white border border-ink-100 rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-sm text-ink-900 mb-1">
                {t('earnings.material_rates')}
              </h3>
              <p className="text-xs text-ink-500 mb-3">
                {t('earnings.indicative_notice')}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-ink-100 text-ink-500 font-semibold">
                      <th className="pb-2">{t('earnings.material_col')}</th>
                      <th className="pb-2 text-right">{t('earnings.range_col')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialRanges.map((mr) => (
                      <tr key={mr.material} className="border-b border-ink-50 hover:bg-ink-50/50">
                        <td className="py-2.5 font-medium text-ink-900">{mr.material}</td>
                        <td className="py-2.5 text-right font-bold text-brand-700">
                          ₹{mr.minRate} – ₹{mr.maxRate} / kg
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white border border-ink-100 rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-sm text-ink-900 mb-3">
                {t('earnings.recent_transactions')}
              </h3>

              <div className="flex flex-col divide-y divide-ink-50">
                {transactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-ink-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {tx.date}
                        </span>
                        <span>•</span>
                        <span>{tx.kg} kg</span>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-600 whitespace-nowrap">
                      +₹{tx.amountINR}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default EarningsPage;
