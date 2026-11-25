import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES } from '@/app/routes';
import { Transaction, MaterialRate } from '@/types';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/sessionStore';

export const EarningsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSessionStore((state) => state.user);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rates, setRates] = useState<MaterialRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      if (!user) return;
      try {
        const [txs, materialRates] = await Promise.all([
          api.getTransactions(user.id),
          api.getMaterialRates(),
        ]);
        if (mounted) {
          setTransactions(txs);
          setRates(materialRates);
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
  }, [user]);

  const totalEarned = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const totalWeight = transactions.reduce((acc, tx) => acc + tx.weightKg, 0);
  const jobsCount = transactions.length;

  // 4-week bar chart breakdown
  const weeklyData = [
    { week: 'W1', amount: Math.round(totalEarned * 0.22) },
    { week: 'W2', amount: Math.round(totalEarned * 0.28) },
    { week: 'W3', amount: Math.round(totalEarned * 0.24) },
    { week: 'W4 (Now)', amount: Math.max(0, totalEarned - Math.round(totalEarned * 0.74)) },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-700" />
            <span>{t('earnings.title')}</span>
          </h1>
          <p className="text-xs text-ink-500 mt-0.5">Track scrap sales & collection pay</p>
        </div>
        <Badge variant="sample" />
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 bg-brand-100/30 border-brand-500/20 text-center">
          <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider block">
            {t('earnings.monthTotal')}
          </span>
          <span className="text-base font-extrabold text-brand-700 mt-0.5 block">
            ₹{totalEarned.toLocaleString('en-IN')}
          </span>
        </Card>

        <Card className="p-3 text-center">
          <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider block">
            {t('earnings.totalKg')}
          </span>
          <span className="text-base font-extrabold text-ink-900 mt-0.5 block">
            {totalWeight} kg
          </span>
        </Card>

        <Card className="p-3 text-center">
          <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider block">
            {t('earnings.jobsDone')}
          </span>
          <span className="text-base font-extrabold text-ink-900 mt-0.5 block">
            {jobsCount}
          </span>
        </Card>
      </div>

      {/* 4-Week Recharts Bar Chart */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <h2 className="font-bold text-ink-900">{t('earnings.weeklyBreakdown')}</h2>
          <Badge variant="sample" />
        </div>

        <div className="h-40 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#5C6B64' }} />
              <YAxis tick={{ fontSize: 11, fill: '#5C6B64' }} />
              <Tooltip
                formatter={(val: number) => [`₹${val}`, 'Earnings']}
                contentStyle={{ borderRadius: '0.75rem', fontSize: '12px', border: '1px solid #EEF1EF' }}
              />
              <Bar dataKey="amount" fill="#0F5C3A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Indicative Scrap Prices */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-ink-900">{t('earnings.indicativeRatesTitle')}</h2>
            <p className="text-[11px] text-ink-500">{t('earnings.indicativeRatesSubtitle')}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-brand-700 p-1 font-bold"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => navigate(ROUTES.priceCheck)}
          >
            {t('home.tilePriceCheck')}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {rates.slice(0, 4).map((rate) => (
            <div
              key={rate.material}
              className="p-2.5 rounded-xl bg-ink-100/40 border border-ink-100 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-ink-900 block">{t(rate.nameKey)}</span>
                <span className="text-[11px] text-brand-700 font-bold">
                  ₹{rate.minRate} - ₹{rate.maxRate} / {rate.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Transactions List */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-ink-900">{t('earnings.recentTransactions')}</h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-ink-500">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={<TrendingUp className="w-8 h-8 text-ink-500" />}
            title={t('earnings.emptyTitle')}
            description={t('earnings.emptyDesc')}
            actionLabel={t('earnings.findJobsBtn')}
            onAction={() => navigate(ROUTES.jobs)}
          />
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <Card key={tx.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-brand-700" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-ink-900">{tx.title}</h3>
                    <div className="flex items-center text-[11px] text-ink-500 mt-0.5">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{tx.date.split('T')[0]}</span>
                      <span className="mx-1.5">•</span>
                      <span>{tx.weightKg} kg</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-brand-700">+₹{tx.amount}</span>
                  <span className="text-[10px] text-ink-500 block uppercase font-mono">{tx.type}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
