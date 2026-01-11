'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { AssetCategory } from '@/types';
import { AssetCategoryLabels } from '@/types';

interface AssetDonutChartProps {
  data: {
    deposit: number;
    stock: number;
    fund: number;
    crypto: number;
    employeeStock: number;
  };
}

const COLORS: Record<AssetCategory, string> = {
  deposit: '#3b82f6',      // blue
  stock: '#22c55e',        // green
  fund: '#a855f7',         // purple
  crypto: '#f59e0b',       // amber
  employeeStock: '#ef4444', // red
};

export function AssetDonutChart({ data }: AssetDonutChartProps) {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: AssetCategoryLabels[key as AssetCategory],
      value,
      category: key as AssetCategory,
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
            innerRadius={60}
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
