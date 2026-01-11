import type { Asset, AssetCategory } from '@/types';

/**
 * 資産の評価額を計算
 */
export function calculateAssetValue(asset: Asset): number {
  switch (asset.category) {
    case 'deposit':
      return asset.balance || 0;

    case 'stock':
      // 現在評価額がある場合はそれを使用、なければ保有株数×平均取得単価
      return asset.currentValue || (asset.shares * asset.averagePrice);

    case 'fund':
      // 現在評価額がある場合はそれを使用、なければ数量×平均取得単価
      return asset.currentValue || (asset.quantity * (asset.averagePrice || 0));

    case 'crypto':
      // 現在評価額がある場合はそれを使用、なければ数量×平均取得単価
      return asset.currentValue || (asset.quantity * (asset.averagePrice || 0));

    case 'employeeStock':
      // 現在評価額がある場合はそれを使用、なければ株数×取得単価
      return asset.currentValue || (asset.sharesOrRights * asset.averagePriceOrStrikePrice);

    default:
      return 0;
  }
}

/**
 * 株式の含み益を計算
 * 含み益 = 現在評価額 - (保有株数 * 平均取得単価)
 * 現在評価額が入力されている場合のみ計算
 */
export function calculateUnrealizedGain(asset: Asset): number | undefined {
  if (asset.category === 'stock' && asset.currentValue !== undefined) {
    const costBasis = asset.shares * asset.averagePrice;
    return asset.currentValue - costBasis;
  }

  if (asset.category === 'fund' && asset.currentValue !== undefined && asset.averagePrice) {
    const costBasis = asset.quantity * asset.averagePrice;
    return asset.currentValue - costBasis;
  }

  if (asset.category === 'crypto' && asset.currentValue !== undefined && asset.averagePrice) {
    const costBasis = asset.quantity * asset.averagePrice;
    return asset.currentValue - costBasis;
  }

  if (asset.category === 'employeeStock' && asset.currentValue !== undefined) {
    const costBasis = asset.sharesOrRights * asset.averagePriceOrStrikePrice;
    return asset.currentValue - costBasis;
  }

  return undefined;
}

/**
 * カテゴリ別の資産合計を計算
 */
export function calculateCategoryTotals(assets: Asset[]): Record<AssetCategory, number> {
  const totals: Record<AssetCategory, number> = {
    deposit: 0,
    stock: 0,
    fund: 0,
    crypto: 0,
    employeeStock: 0,
  };

  assets.forEach((asset) => {
    totals[asset.category] += calculateAssetValue(asset);
  });

  return totals;
}

/**
 * 総資産を計算
 */
export function calculateTotalAssets(assets: Asset[]): number {
  return assets.reduce((sum, asset) => sum + calculateAssetValue(asset), 0);
}

/**
 * 資産の表示名を取得（カテゴリに応じた識別情報）
 */
export function getAssetDisplayName(asset: Asset): string {
  switch (asset.category) {
    case 'deposit':
      return asset.accountName || asset.financialInstitution || '現金・預金';

    case 'stock':
      return asset.stockName || asset.ticker || '株式';

    case 'fund':
      return asset.fundName;

    case 'crypto':
      return asset.cryptoCurrency || '暗号資産';

    case 'employeeStock':
      return asset.companyName;

    default:
      return '資産';
  }
}
