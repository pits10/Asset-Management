import type { InvestmentPlan } from '@/types';

export interface ForecastDataPoint {
  month: number;
  year: number;
  totalAssets: number;
  label: string;
}

/**
 * 将来資産推移を予測
 * 簡易的な月次複利計算（外部データなし）
 */
export function calculateForecast(
  currentAssets: number,
  monthlyContribution: number,
  annualReturnRate: number, // 年率% (例: 5.0)
  years: number
): ForecastDataPoint[] {
  const monthlyReturnRate = annualReturnRate / 100 / 12; // 月率に変換
  const months = years * 12;
  const data: ForecastDataPoint[] = [];

  // 現在（0ヶ月目）
  data.push({
    month: 0,
    year: 0,
    totalAssets: currentAssets,
    label: '現在',
  });

  let assets = currentAssets;

  // 月次で計算
  for (let month = 1; month <= months; month++) {
    // 月初に積立
    assets += monthlyContribution;
    // 月末にリターン適用
    assets *= 1 + monthlyReturnRate;

    // 年の終わり（12の倍数）のみ記録（データ量削減）
    if (month % 12 === 0 || month === 1 || month === 6) {
      const year = Math.floor(month / 12);
      data.push({
        month,
        year,
        totalAssets: Math.round(assets),
        label: `${year}年${month % 12}ヶ月`,
      });
    }
  }

  return data;
}

/**
 * プラン別の期待リターンから加重平均を計算
 */
export function calculateWeightedAverageReturn(plans: InvestmentPlan[]): number {
  const totalAmount = plans.reduce((sum, plan) => sum + plan.monthlyAmount, 0);

  if (totalAmount === 0) return 0;

  const weightedSum = plans.reduce((sum, plan) => {
    const returnRate = plan.expectedReturn || 0;
    return sum + plan.monthlyAmount * returnRate;
  }, 0);

  return weightedSum / totalAmount;
}
