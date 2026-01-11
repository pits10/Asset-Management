"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TrajectoryChart } from "@/components/trajectory/trajectory-chart";
import { useMonthlyStates } from "@/lib/hooks/useMonthlyStates";
import {
  calculateProjection,
  formatCurrency,
  formatCompactCurrency,
} from "@/lib/utils/projection";

export default function TrajectoryPage() {
  const { getLatest } = useMonthlyStates();
  const [currentNetWorth, setCurrentNetWorth] = useState(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [horizonYears, setHorizonYears] = useState(10);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Load current net worth from latest monthly state
  useEffect(() => {
    getLatest().then((state) => {
      if (state) {
        setCurrentNetWorth(state.netWorth);
      }
    });
  }, [getLatest]);

  // Calculate projection
  const projection = useMemo(() => {
    return calculateProjection({
      currentNetWorth,
      monthlyContribution: monthlyInvestment,
      annualReturn: expectedReturn,
      years: horizonYears,
    });
  }, [currentNetWorth, monthlyInvestment, expectedReturn, horizonYears]);

  const futureValue = projection[projection.length - 1];

  return (
    <div className="container mx-auto max-w-lg space-y-6 px-4 py-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-medium text-foreground">Trajectory</h1>
        <p className="text-sm text-foreground-secondary">Touch the future</p>
      </header>

      {/* Hero Number */}
      <div className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm text-foreground-secondary">
            In {horizonYears} {horizonYears === 1 ? "year" : "years"}
          </p>
          <h2 className="text-4xl font-medium text-accent-growth numeric tracking-tight">
            {formatCompactCurrency(futureValue?.totalValue || 0)}
          </h2>
          <p className="text-xs text-foreground-muted">Estimated trajectory</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-4">
        <TrajectoryChart data={projection} />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card p-5 space-y-5">
          {/* Monthly Investment */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm text-foreground-secondary">
                Monthly Investment
              </label>
              <span className="text-lg font-medium text-foreground numeric">
                ¥{monthlyInvestment.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              step="5000"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-growth [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-growth [&::-moz-range-thumb]:border-0"
            />
            <div className="flex justify-between text-xs text-foreground-muted">
              <span>¥0</span>
              <span>¥500K</span>
            </div>
          </div>

          {/* Expected Return */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm text-foreground-secondary">
                Expected Annual Return
              </label>
              <span className="text-lg font-medium text-foreground numeric">
                {expectedReturn}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-growth [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-growth [&::-moz-range-thumb]:border-0"
            />
            <div className="flex justify-between text-xs text-foreground-muted">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Horizon */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-sm text-foreground-secondary">
                Time Horizon
              </label>
              <span className="text-lg font-medium text-foreground numeric">
                {horizonYears} {horizonYears === 1 ? "year" : "years"}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={horizonYears}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-growth [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-growth [&::-moz-range-thumb]:border-0"
            />
            <div className="flex justify-between text-xs text-foreground-muted">
              <span>1 year</span>
              <span>50 years</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
        >
          <span className="text-sm font-medium text-foreground">Breakdown</span>
          {showBreakdown ? (
            <ChevronUp className="h-4 w-4 text-foreground-secondary" />
          ) : (
            <ChevronDown className="h-4 w-4 text-foreground-secondary" />
          )}
        </button>
        {showBreakdown && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-foreground-secondary">
                Starting Amount
              </span>
              <span className="text-base font-medium text-foreground numeric">
                {formatCurrency(currentNetWorth)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-foreground-secondary">
                Total Contributions
              </span>
              <span className="text-base font-medium text-foreground numeric">
                {formatCurrency(futureValue?.contributions || 0)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-foreground-secondary">
                Estimated Growth
              </span>
              <span className="text-base font-medium text-accent-growth numeric">
                {formatCurrency(futureValue?.growth || 0)}
              </span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <span className="text-sm font-medium text-foreground-secondary">
                Total
              </span>
              <span className="text-lg font-medium text-foreground numeric">
                {formatCurrency(futureValue?.totalValue || 0)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-foreground-muted text-center px-4">
        Projections are estimates, not guarantees.
      </p>
    </div>
  );
}
