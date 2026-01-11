'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ExpenseCategory } from '@/types';

interface ExpensePieChartProps {
  data: Record<ExpenseCategory, number>;
}

const COLORS: Record<ExpenseCategory, string> = {
  housing: '#ef4444',      // red
  utilities: '#f97316',    // orange
  telecom: '#eab308',      // yellow
  subscription: '#84cc16', // lime
  insurance: '#22c55e',    // green
  food: '#14b8a6',         // teal
  transport: '#06b6d4',    // cyan
  entertainment: '#3b82f6', // blue
  clothing: '#8b5cf6',     // violet
  other: '#6b7280',        // gray
};

const LABELS: Record<ExpenseCategory, string> = {
  housing: '住居',
  utilities: '光熱費',
  telecom: '通信費',
  subscription: 'サブスク',
  insurance: '保険',
  food: '食費',
  transport: '交通費',
  entertainment: '娯楽',
  clothing: '衣服',
  other: 'その他',
};

export function ExpensePieChart({ data }: ExpensePieChartProps) {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: LABELS[key as ExpenseCategory],
      value,
      category: key as ExpenseCategory,
    }));

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      notation: 'compact',
    }).format(value);
  };

  if (total === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        データがありません
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.category}
                fill={COLORS[entry.category]}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: unknown) => {
              const percentage = (((entry as {payload: {value: number}}).payload.value / total) * 100).toFixed(1);
              return `${value} (${percentage}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
