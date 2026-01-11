"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useMonthlyStates } from "@/lib/hooks/useMonthlyStates";
import { OverviewChart } from "@/components/overview/overview-chart";
import {
  analyzeDirection,
  calculateCashRunway,
  calculateSavingsRate,
} from "@/lib/utils/direction";
import { formatCurrency, formatCompactCurrency } from "@/lib/utils/projection";
import type { MonthlyState } from "@/types";

export default function OverviewPage() {
  const { getRecent } = useMonthlyStates();
  const [recentStates, setRecentStates] = useState<MonthlyState[]>([]);
  const [greeting, setGreeting] = useState("Good evening");

  // Load recent states
  useEffect(() => {
    getRecent(6).then((states) => {
      setRecentStates(states.reverse()); // Oldest to newest for chart
    });

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, [getRecent]);

  const direction = analyzeDirection(recentStates);
  const latest = recentStates[recentStates.length - 1];

  const DirectionIcon = {
    up: TrendingUp,
    down: TrendingDown,
    flat: Minus,
  }[direction.icon];

  return (
    <div className="container mx-auto max-w-lg space-y-6 px-4 py-6">
      {/* Header */}
      <header className="space-y-1">
        <p className="text-sm text-foreground-secondary">{greeting}</p>
        <h1 className="text-2xl font-medium text-foreground">Overview</h1>
        <p className="text-sm text-foreground-muted">
          Here&apos;s where your money is heading.
        </p>
      </header>

      {/* Direction Card */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              direction.status === "growth"
                ? "bg-accent-growth/10"
                : direction.status === "risk"
                ? "bg-accent-negative/10"
                : "bg-secondary"
            }`}
          >
            <DirectionIcon
              className={`h-6 w-6 ${direction.color}`}
              strokeWidth={2.5}
            />
          </div>
          <div className="flex-1">
            <h2 className={`text-xl font-medium ${direction.color}`}>
              {direction.label}
            </h2>
            <p className="text-sm text-foreground-muted">
              {direction.description}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      {latest && (
        <div className="grid grid-cols-2 gap-4">
          {/* Net Worth */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-foreground-muted">Net Worth</p>
            <p className="text-lg font-medium text-foreground numeric">
              {formatCompactCurrency(latest.netWorth)}
            </p>
          </div>

          {/* Monthly Investment */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-foreground-muted">Monthly Investment</p>
            <p className="text-lg font-medium text-foreground numeric">
              {formatCompactCurrency(latest.monthlyInvestContribution)}
            </p>
          </div>

          {/* Cash Runway */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-foreground-muted">Cash Runway</p>
            <p className="text-lg font-medium text-foreground numeric">
              {calculateCashRunway(latest.cash, latest.livingCostMonthly)}{" "}
              <span className="text-sm text-foreground-secondary">months</span>
            </p>
          </div>

          {/* Savings Rate */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-foreground-muted">Savings Rate</p>
            <p className="text-lg font-medium text-foreground numeric">
              {calculateSavingsRate(
                latest.incomeMonthly,
                latest.livingCostMonthly
              )}
              %
            </p>
          </div>
        </div>
      )}

      {/* Net Worth Trend Chart */}
      {recentStates.length > 1 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="text-sm font-medium text-foreground">
              Net Worth Trend
            </h3>
            <p className="text-xs text-foreground-muted">
              Last {recentStates.length} months
            </p>
          </div>
          <OverviewChart data={recentStates} />
        </div>
      )}

      {/* Empty State */}
      {!latest && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-foreground-secondary">
            No data yet. Add your financial information to get started.
          </p>
        </div>
      )}
    </div>
  );
}
