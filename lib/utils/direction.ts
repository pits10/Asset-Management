import type { MonthlyState } from "@/types";

export type DirectionStatus = "growth" | "flat" | "risk";

export interface DirectionAnalysis {
  status: DirectionStatus;
  label: string;
  description: string;
  color: string;
  icon: "up" | "flat" | "down";
}

/**
 * Analyze financial direction based on recent monthly states
 * Simple heuristic:
 * - Growth: Net worth increasing AND positive savings rate
 * - Flat: Net worth stable OR low savings rate
 * - Risk: Net worth decreasing OR negative savings rate OR low cash runway
 */
export function analyzeDirection(recentStates: MonthlyState[]): DirectionAnalysis {
  if (recentStates.length < 2) {
    return {
      status: "flat",
      label: "Getting Started",
      description: "Add more data to see your direction.",
      color: "text-foreground-secondary",
      icon: "flat",
    };
  }

  const latest = recentStates[0];
  const oldest = recentStates[recentStates.length - 1];

  // Calculate net worth trend
  const netWorthChange = latest.netWorth - oldest.netWorth;
  const netWorthGrowthRate = (netWorthChange / oldest.netWorth) * 100;

  // Calculate savings rate
  const savingsRate =
    latest.incomeMonthly > 0
      ? ((latest.incomeMonthly - latest.livingCostMonthly) / latest.incomeMonthly) * 100
      : 0;

  // Calculate cash runway (months)
  const cashRunway =
    latest.livingCostMonthly > 0 ? latest.cash / latest.livingCostMonthly : 0;

  // Decision logic
  if (netWorthGrowthRate > 5 && savingsRate > 10) {
    return {
      status: "growth",
      label: "Stable Growth",
      description: "Based on the last 6 months.",
      color: "text-accent-growth",
      icon: "up",
    };
  }

  if (netWorthGrowthRate < -5 || savingsRate < 0 || cashRunway < 3) {
    return {
      status: "risk",
      label: "At Risk",
      description: "Based on the last 6 months.",
      color: "text-accent-negative",
      icon: "down",
    };
  }

  return {
    status: "flat",
    label: "Flat",
    description: "Based on the last 6 months.",
    color: "text-foreground-secondary",
    icon: "flat",
  };
}

/**
 * Calculate cash runway in months
 */
export function calculateCashRunway(cash: number, monthlyExpenses: number): number {
  if (monthlyExpenses <= 0) return 0;
  return Math.floor(cash / monthlyExpenses);
}

/**
 * Calculate savings rate as percentage
 */
export function calculateSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  return Math.round(((income - expenses) / income) * 100);
}
