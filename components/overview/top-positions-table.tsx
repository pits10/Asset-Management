'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils/format';
import { calculateAssetValue, getAssetDisplayName } from '@/lib/utils/asset-helpers';
import { AssetCategoryLabels } from '@/types';
import type { Asset } from '@/types';

interface TopPositionsTableProps {
  assets: Asset[];
  limit?: number;
}

export function TopPositionsTable({ assets, limit = 5 }: TopPositionsTableProps) {
  // Calculate value and sort by value descending
  const sortedAssets = [...assets]
    .map((asset) => ({
      asset,
      value: calculateAssetValue(asset),
      name: getAssetDisplayName(asset),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  // Calculate unrealized gain for each
  const assetsWithGain = sortedAssets.map(({ asset, value, name }) => {
    let unrealizedGain = 0;
    let costBasis = 0;

    if (asset.category === 'stock') {
      costBasis = asset.shares * asset.averagePrice;
      unrealizedGain = value - costBasis;
    } else if (asset.category === 'fund' && asset.averagePrice) {
      costBasis = asset.quantity * asset.averagePrice;
      unrealizedGain = value - costBasis;
    } else if (asset.category === 'crypto' && asset.averagePrice) {
      costBasis = asset.quantity * asset.averagePrice;
      unrealizedGain = value - costBasis;
    } else if (asset.category === 'employeeStock') {
      costBasis = asset.sharesOrRights * asset.averagePriceOrStrikePrice;
      unrealizedGain = value - costBasis;
    }

    const gainPercent = costBasis > 0 ? (unrealizedGain / costBasis) * 100 : 0;

    return {
      asset,
      name,
      value,
      unrealizedGain,
      gainPercent,
      category: AssetCategoryLabels[asset.category],
    };
  });

  if (assetsWithGain.length === 0) {
    return (
      <div className="text-center py-6 text-foreground-muted text-sm">No assets</div>
    );
  }

  return (
    <div className="space-y-2">
      {assetsWithGain.map(({ asset, name, value, unrealizedGain, gainPercent, category }, index) => (
        <div
          key={asset.id}
          className="rounded-lg border border-border bg-background-secondary p-3 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{name}</p>
              <p className="text-xs text-foreground-muted">{category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground numeric">{formatCurrency(value)}</p>
              {unrealizedGain !== 0 && (
                <div className="flex items-center justify-end gap-1">
                  {unrealizedGain >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-accent-growth" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-accent-negative" />
                  )}
                  <span
                    className={`text-xs ${
                      unrealizedGain >= 0 ? 'text-accent-growth' : 'text-accent-negative'
                    }`}
                  >
                    {gainPercent >= 0 ? '+' : ''}
                    {formatPercent(gainPercent)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
