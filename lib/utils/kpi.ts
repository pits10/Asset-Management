import { startOfMonth, endOfMonth } from 'date-fns';
import { assetsDB, expensesDB, incomesDB, snapshotsDB } from '@/lib/db/indexeddb';
import type { KPIData } from '@/types';

/**
 * KPI計算ユーティリティ
 */
export class KPICalculator {
  /**
   * 全KPIデータを計算
   */
  static async calculateKPIs(date: Date = new Date()): Promise<KPIData> {
    const [
      netWorthChange,
      monthlyBalance,
      savingsRate,
      liquidityRatio,
      monthlyExpenses,
      assetAllocation,
    ] = await Promise.all([
      this.getNetWorthChange(),
      this.getMonthlyBalance(date),
      this.getSavingsRate(date),
      this.getLiquidityRatio(),
      this.getMonthlyExpenses(date),
      this.getAssetAllocation(),
    ]);

    return {
      netWorthChange,
      monthlyBalance,
      savingsRate,
      liquidityRatio,
      monthlyExpenses,
      assetAllocation,
    };
  }

  /**
   * 純資産増減（期間開始時との差分）
   */
  static async getNetWorthChange(): Promise<number> {
    const snapshots = await snapshotsDB.getAll();
    if (snapshots.length === 0) return 0;

    const latest = snapshots[0]; // 最新
    const oldest = snapshots[snapshots.length - 1]; // 最古

    return latest.totalAssets - oldest.totalAssets;
  }

  /**
   * 月間収支（収入 - 支出）
   */
  static async getMonthlyBalance(date: Date = new Date()): Promise<number> {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const [incomes, expenses] = await Promise.all([
      incomesDB.getByDateRange(start, end),
      expensesDB.getByDateRange(start, end),
    ]);

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return totalIncome - totalExpense;
  }

  /**
   * 貯蓄率（月間収支 ÷ 収入 × 100）
   */
  static async getSavingsRate(date: Date = new Date()): Promise<number> {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const [incomes, expenses] = await Promise.all([
      incomesDB.getByDateRange(start, end),
      expensesDB.getByDateRange(start, end),
    ]);

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    if (totalIncome === 0) return 0;

    return ((totalIncome - totalExpense) / totalIncome) * 100;
  }

  /**
   * 流動性比率（現金・預金 ÷ 総資産 × 100）
   */
  static async getLiquidityRatio(): Promise<number> {
    const assets = await assetsDB.getAll();
    const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);

    if (totalAssets === 0) return 0;

    const cash = assets
      .filter((asset) => asset.category === 'cash')
      .reduce((sum, asset) => sum + asset.amount, 0);

    return (cash / totalAssets) * 100;
  }

  /**
   * 月間総支出
   */
  static async getMonthlyExpenses(date: Date = new Date()): Promise<number> {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const expenses = await expensesDB.getByDateRange(start, end);
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  /**
   * 資産構成比
   */
  static async getAssetAllocation(): Promise<{
    cash: number;
    investment: number;
    realEstate: number;
    other: number;
  }> {
    const assets = await assetsDB.getAll();

    const allocation = {
      cash: 0,
      investment: 0,
      realEstate: 0,
      other: 0,
    };

    assets.forEach((asset) => {
      allocation[asset.category] += asset.amount;
    });

    return allocation;
  }
}
