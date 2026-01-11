export interface ProjectionPoint {
  year: number;
  totalValue: number;
  contributions: number;
  growth: number;
}

export interface ProjectionParams {
  currentNetWorth: number;
  monthlyContribution: number;
  annualReturn: number; // percentage (e.g., 7 for 7%)
  years: number;
}

/**
 * Calculate financial projection with monthly compounding
 * Formula: FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]
 * Where:
 * - PV = Present Value (current net worth)
 * - r = monthly rate (annual rate / 12 / 100)
 * - n = number of months
 * - PMT = monthly payment (contribution)
 */
export function calculateProjection(params: ProjectionParams): ProjectionPoint[] {
  const { currentNetWorth, monthlyContribution, annualReturn, years } = params;

  const monthlyRate = annualReturn / 12 / 100;
  const points: ProjectionPoint[] = [];

  // Starting point (year 0)
  points.push({
    year: 0,
    totalValue: currentNetWorth,
    contributions: 0,
    growth: 0,
  });

  // Calculate for each year
  for (let year = 1; year <= years; year++) {
    const months = year * 12;
    const totalContributions = monthlyContribution * months;

    let futureValue: number;

    if (monthlyRate === 0) {
      // No growth case
      futureValue = currentNetWorth + totalContributions;
    } else {
      // Future value of initial amount
      const fvInitial = currentNetWorth * Math.pow(1 + monthlyRate, months);

      // Future value of monthly contributions (annuity)
      const fvContributions =
        monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

      futureValue = fvInitial + fvContributions;
    }

    const growth = futureValue - currentNetWorth - totalContributions;

    points.push({
      year,
      totalValue: Math.round(futureValue),
      contributions: Math.round(totalContributions),
      growth: Math.round(growth),
    });
  }

  return points;
}

/**
 * Get projection value at specific year
 */
export function getProjectionAtYear(
  params: ProjectionParams,
  targetYear: number
): ProjectionPoint | null {
  const projection = calculateProjection({ ...params, years: targetYear });
  return projection.find((p) => p.year === targetYear) || null;
}

// Re-export formatting utilities from centralized location
export { formatCurrency, formatCompactCurrency } from './format';
