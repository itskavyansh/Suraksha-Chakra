import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CATEGORY_COLORS } from './AdminHazardMap';

interface AdminDonutChartProps {
  breakdown: Record<string, number>;
}

export const AdminDonutChart: React.FC<AdminDonutChartProps> = ({ breakdown }) => {
  const data = Object.entries(breakdown)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      category,
      count,
      color: CATEGORY_COLORS[category] || '#5C6B64',
    }));

  const total = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-ink-900">Hazard Categories</h2>
          <p className="text-xs text-ink-500">Breakdown of reported safety threats</p>
        </div>
        <Badge variant="sample" />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-48 h-48 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} reports`, 'Count']}
                contentStyle={{ borderRadius: '0.75rem', fontSize: '12px', border: '1px solid #EEF1EF' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-ink-900">{total}</span>
            <span className="text-[10px] text-ink-500 uppercase font-semibold">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-2 gap-2 w-full text-xs">
          {data.map((item) => {
            const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={item.category} className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-ink-500 truncate flex-1">{item.name}</span>
                <span className="font-bold text-ink-900">{item.count}</span>
                <span className="text-[10px] text-ink-500 font-mono">({percent}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
