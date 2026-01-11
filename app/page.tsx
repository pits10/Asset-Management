'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Minus, Plus, AlertCircle, Wallet, ArrowLeftRight } from 'lucide-react';
import { useMonthlyStates } from '@/lib/hooks/useMonthlyStates';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useAssets } from '@/lib/hooks/useAssets';
import { useCashflow } from '@/lib/hooks/useCashflow';
import { OverviewChart } from '@/components/overview/overview-chart';
import { AssetAllocationChart } from '@/components/overview/asset-allocation-chart';
import { TopPositionsTable } from '@/components/overview/top-positions-table';
import { analyzeDirection, calculateCashRunway, calculateSavingsRate } from '@/lib/utils/direction';
import { formatCurrency, formatCompactCurrency, getGreeting, formatPercent } from '@/lib/utils/format';
import { calculatePercentageChange } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import type { MonthlyState } from '@/types';

export default function OverviewPage() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const { getRecent } = useMonthlyStates();
  const { assets, getTotalAssets, getCategoryTotals } = useAssets();
  const { entries: cashflowEntries } = useCashflow();
  const [recentStates, setRecentStates] = useState<MonthlyState[]>([]);

  // Load recent states
  useEffect(() => {
    getRecent(6).then((states) => {
      setRecentStates(states.reverse()); // Oldest to newest for chart
    });
  }, [getRecent]);

  const direction = analyzeDirection(recentStates);
  const latest = recentStates[recentStates.length - 1];
  const totalAssets = getTotalAssets();
  const categoryTotals = getCategoryTotals();

  // Calculate YoY change if we have enough data
  const yoyChange = recentStates.length >= 2 ? calculatePercentageChange(recentStates[0].netWorth, latest?.netWorth || 0) : 0;

  const DirectionIcon = {
    up: TrendingUp,
    down: TrendingDown,
    flat: Minus,
  }[direction.icon];

  const hasAssets = assets.length > 0;
  const hasCashflow = cashflowEntries.length > 0;
  const hasMonthlyData = recentStates.length > 0;

  return (
    <div className="container mx-auto max-w-lg space-y-6 px-4 py-6">
      {/* Header with Greeting */}
      <header className="space-y-2">
        <h1 className="text-2xl font-medium text-foreground">
          {getGreeting()}, {profile?.name || 'User'}
        </h1>
        <p className="text-sm text-foreground-secondary">Here's your financial snapshot</p>
      </header>

      {/* Action Prompts (if data missing) */}
      {(!hasAssets || !hasCashflow) && (
        <div className="space-y-2">
          {!hasAssets && (
            <div className="rounded-lg border border-accent-warning/20 bg-accent-warning/5 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Add your assets</p>
                <p className="text-xs text-foreground-muted mt-1">
                  Start tracking your cash, investments, and equity compensation
                </p>
                <Button size="sm" variant="outline" className="mt-3 gap-2" onClick={() => router.push('/assets')}>
                  <Wallet className="h-4 w-4" />
                  Go to Assets
                </Button>
              </div>
            </div>
          )}

          {!hasCashflow && (
            <div className="rounded-lg border border-accent-warning/20 bg-accent-warning/5 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Track your cashflow</p>
                <p className="text-xs text-foreground-muted mt-1">
                  Add monthly income, spending, and investment data
                </p>
                <Button size="sm" variant="outline" className="mt-3 gap-2" onClick={() => router.push('/cashflow')}>
                  <ArrowLeftRight className="h-4 w-4" />
                  Go to Cashflow
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Direction Card */}
      {hasMonthlyData && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                direction.status === 'growth'
                  ? 'bg-accent-growth/10'
                  : direction.status === 'risk'
                  ? 'bg-accent-negative/10'
                  : 'bg-secondary'
              }`}
            >
              <DirectionIcon className={`h-6 w-6 ${direction.color}`} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-medium ${direction.color}`}>{direction.label}</h2>
              <p className="text-sm text-foreground-muted">{direction.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          {/* Net Worth */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-foreground-muted">Net Worth</p>
            <p className="text-xl font-medium text-foreground numeric">{formatCurrency(latest.netWorth)}</p>
            {recentStates.length >= 2 && (
              <p className={`text-xs ${yoyChange >= 0 ? 'text-accent-growth' : 'text-accent-negative'}`}>
                {yoyChange >= 0 ? '+' : ''}
                {formatPercent(yoyChange)} vs. {recentStates.length} mo ago
              </p>
            )}
          </div>

          {/* Cash Ratio */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-foreground-muted">Cash Ratio</p>
            <p className="text-xl font-medium text-foreground numeric">
              {formatPercent((latest.cash / latest.netWorth) * 100)}
            </p>
            <p className="text-xs text-foreground-muted">{formatCurrency(latest.cash)}</p>
          </div>

          {/* Monthly Savings */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-foreground-muted">Monthly Savings</p>
            <p className="text-xl font-medium text-accent-growth numeric">
              {formatCurrency(latest.incomeMonthly - latest.livingCostMonthly)}
            </p>
            <p className="text-xs text-foreground-muted">Income - Spending</p>
          </div>

          {/* Savings Rate */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-foreground-muted">Savings Rate</p>
            <p className="text-xl font-medium text-accent-growth">
              {formatPercent(calculateSavingsRate(latest.incomeMonthly, latest.livingCostMonthly))}
            </p>
            <p className="text-xs text-foreground-muted">Of income saved</p>
          </div>
        </div>
      )}

      {/* Net Worth Trend Chart */}
      {recentStates.length > 1 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-sm font-medium text-foreground">Net Worth Trend</h3>
            <p className="text-xs text-foreground-muted">Last {recentStates.length} months</p>
          </div>
          <OverviewChart data={recentStates} />
        </div>
      )}

      {/* Asset Allocation Chart */}
      {hasAssets && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-foreground">Asset Allocation</h3>
            <p className="text-xs text-foreground-muted">Total: {formatCurrency(totalAssets)}</p>
          </div>
          <AssetAllocationChart data={categoryTotals} />
        </div>
      )}

      {/* Top Positions Table */}
      {assets.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-foreground">Top Positions</h3>
            <p className="text-xs text-foreground-muted">{assets.length} assets</p>
          </div>
          <TopPositionsTable assets={assets} limit={5} />
        </div>
      )}

      {/* Monthly Cashflow Summary */}
      {latest && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-foreground">Monthly Cashflow</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-muted">Income</span>
              <span className="font-medium text-accent-growth numeric">{formatCurrency(latest.incomeMonthly)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-muted">Spending</span>
              <span className="font-medium text-accent-negative numeric">
                {formatCurrency(latest.livingCostMonthly)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-muted">Investment</span>
              <span className="font-medium text-accent-growth numeric">
                {formatCurrency(latest.monthlyInvestContribution)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
              <span className="text-foreground">Surplus</span>
              <span
                className={`font-medium numeric ${
                  latest.incomeMonthly - latest.livingCostMonthly >= 0 ? 'text-accent-growth' : 'text-accent-negative'
                }`}
              >
                {latest.incomeMonthly - latest.livingCostMonthly >= 0 ? '+' : ''}
                {formatCurrency(latest.incomeMonthly - latest.livingCostMonthly)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!latest && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-foreground-muted mb-4">No data yet. Get started by adding your information.</p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push('/assets')} className="gap-2">
              <Wallet className="h-4 w-4" />
              Add Assets
            </Button>
            <Button onClick={() => router.push('/cashflow')} variant="outline" className="gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Track Cashflow
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
