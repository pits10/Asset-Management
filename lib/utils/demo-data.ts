import { monthlyStatesDB } from "@/lib/db/indexeddb";
import { format, subMonths } from "date-fns";

/**
 * Generate demo monthly states for the last 6 months
 * This helps new users understand the app's value proposition
 */
export async function generateDemoData() {
  const now = new Date();
  const baseNetWorth = 5_000_000; // Starting with 5M JPY
  const baseCash = 1_500_000; // 1.5M JPY in cash
  const monthlyIncome = 450_000; // 450K JPY/month
  const monthlyLivingCost = 280_000; // 280K JPY/month
  const monthlyInvestment = 100_000; // 100K JPY/month

  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(now, i);
    const month = format(date, "yyyy-MM");

    // Simulate growth over time
    const growthFactor = (6 - i) * 0.015; // ~1.5% per month
    const netWorth = Math.round(baseNetWorth * (1 + growthFactor) + monthlyInvestment * (6 - i) * 12);
    const cash = Math.round(baseCash * (1 + growthFactor * 0.3));
    const invested = netWorth - cash;

    months.push({
      month,
      netWorth,
      cash,
      invested,
      incomeMonthly: monthlyIncome,
      livingCostMonthly: monthlyLivingCost,
      monthlyInvestContribution: monthlyInvestment,
    });
  }

  // Insert all months
  for (const state of months) {
    await monthlyStatesDB.upsertByMonth(state.month, state);
  }

  return months.length;
}

/**
 * Clear all monthly states
 */
export async function clearAllData() {
  const allStates = await monthlyStatesDB.getAll();
  for (const state of allStates) {
    await monthlyStatesDB.delete(state.id);
  }
}
