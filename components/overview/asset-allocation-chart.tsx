'use client';

import { AssetCategoryLabels } from '@/types';
import { formatCurrency, formatPercent } from '@/lib/utils/format';
import type { AssetCategory } from '@/types';

interface AssetAllocationChartProps {
  data: Record<string, number>;
}

const COLORS: Record<AssetCategory, string> = {
  deposit: '#4DFFE5',
  stock: '#60A5FA',
  fund: '#A78BFA',
  crypto: '#FFB020',
  employeeStock: '#10B981',
};

export function AssetAllocationChart({ data }: AssetAllocationChartProps) {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);

  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([category, value]) => ({
      category: category as AssetCategory,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      label: AssetCategoryLabels[category as AssetCategory],
      color: COLORS[category as AssetCategory],
    }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-foreground-muted text-sm">
        No asset data
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="space-y-2">
        {chartData.map((item) => (
          <div key={item.category} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground-secondary">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-foreground-muted">{formatPercent(item.percentage)}</span>
              <span className="font-medium text-foreground numeric min-w-[100px] text-right">
                {formatCurrency(item.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
