'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailySnapshot } from '@/types';
import { format, parseISO } from 'date-fns';

interface NetWorthChartProps {
  snapshots: DailySnapshot[];
}

export function NetWorthChart({ snapshots }: NetWorthChartProps) {
  if (snapshots.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        データがありません。資産を登録すると自動でグラフが生成されます。
      </div>
    );
  }

  // データを日付順にソート（古い順）
  const chartData = [...snapshots]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((snapshot) => ({
      date: format(parseISO(snapshot.date), 'M/d'),
      totalAssets: snapshot.totalAssets,
      fullDate: snapshot.date,
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      notation: 'compact',
    }).format(value);
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => `日付: ${label}`}
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="totalAssets"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: '#22c55e', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
