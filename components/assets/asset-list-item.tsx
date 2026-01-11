'use client';

import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { calculateAssetValue, getAssetDisplayName } from '@/lib/utils/asset-helpers';
import { AssetCategoryLabels } from '@/types';
import { Button } from '@/components/ui/button';
import type { Asset } from '@/types';

interface AssetListItemProps {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => void;
}

export function AssetListItem({ asset, onEdit, onDelete }: AssetListItemProps) {
  const value = calculateAssetValue(asset);
  const displayName = getAssetDisplayName(asset);

  // Calculate unrealized gain if applicable
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

  const hasGain = unrealizedGain !== 0;
  const gainPercent = costBasis > 0 ? (unrealizedGain / costBasis) * 100 : 0;

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
          <p className="text-xs text-foreground-muted">{AssetCategoryLabels[asset.category]}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-accent-negative hover:text-accent-negative"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted">Value</p>
          <p className="text-lg font-medium text-foreground numeric">{formatCurrency(value)}</p>
        </div>

        {hasGain && (
          <div className="text-right">
            <p className="text-sm text-foreground-muted">Gain/Loss</p>
            <div className="flex items-center gap-1">
              {unrealizedGain >= 0 ? (
                <TrendingUp className="h-4 w-4 text-accent-growth" />
              ) : (
                <TrendingDown className="h-4 w-4 text-accent-negative" />
              )}
              <p
                className={`text-sm font-medium numeric ${
                  unrealizedGain >= 0 ? 'text-accent-growth' : 'text-accent-negative'
                }`}
              >
                {unrealizedGain >= 0 ? '+' : ''}
                {formatCurrency(unrealizedGain)}
              </p>
              <span
                className={`text-xs ${
                  unrealizedGain >= 0 ? 'text-accent-growth' : 'text-accent-negative'
                }`}
              >
                ({gainPercent >= 0 ? '+' : ''}
                {gainPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Additional details based on asset type */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground-muted pt-2 border-t border-border">
        {asset.category === 'stock' && (
          <>
            <div>Shares: {asset.shares.toLocaleString()}</div>
            <div>Avg Cost: {formatCurrency(asset.averagePrice)}</div>
          </>
        )}
        {asset.category === 'fund' && (
          <>
            <div>Units: {asset.quantity.toLocaleString()}</div>
            {asset.averagePrice && <div>Avg Cost: {formatCurrency(asset.averagePrice)}</div>}
          </>
        )}
        {asset.category === 'crypto' && (
          <>
            <div>Amount: {asset.quantity.toLocaleString(undefined, { maximumFractionDigits: 8 })}</div>
            {asset.averagePrice && <div>Avg Cost: {formatCurrency(asset.averagePrice)}</div>}
          </>
        )}
        {asset.category === 'employeeStock' && (
          <>
            <div>Shares/Rights: {asset.sharesOrRights.toLocaleString()}</div>
            <div>Grant Price: {formatCurrency(asset.averagePriceOrStrikePrice)}</div>
          </>
        )}
        {asset.category === 'deposit' && asset.financialInstitution && (
          <div className="col-span-2">Bank: {asset.financialInstitution}</div>
        )}
      </div>
    </div>
  );
}
