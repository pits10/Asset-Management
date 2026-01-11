"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Calendar, Sparkles, Trash2 } from "lucide-react";
import { useMonthlyStates } from "@/lib/hooks/useMonthlyStates";
import { formatCurrency, formatCompactCurrency } from "@/lib/utils/projection";
import { generateDemoData, clearAllData } from "@/lib/utils/demo-data";
import type { MonthlyState } from "@/types";

export default function ProfilePage() {
  const { states, loading, refresh } = useMonthlyStates();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortedStates, setSortedStates] = useState<MonthlyState[]>([]);

  useEffect(() => {
    const sorted = [...states].sort((a, b) => {
      return sortOrder === "desc"
        ? b.month.localeCompare(a.month)
        : a.month.localeCompare(b.month);
    });
    setSortedStates(sorted);
  }, [states, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const handleGenerateDemo = async () => {
    await generateDemoData();
    await refresh();
  };

  const handleClearData = async () => {
    if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      await clearAllData();
      await refresh();
    }
  };

  return (
    <div className="container mx-auto max-w-lg space-y-6 px-4 py-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-medium text-foreground">Profile</h1>
        <p className="text-sm text-foreground-secondary">Records & control</p>
      </header>

      {/* Monthly History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Monthly History</h2>
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-foreground-secondary hover:bg-secondary transition-colors"
          >
            <Calendar className="h-4 w-4" />
            {sortOrder === "desc" ? (
              <>
                Newest <ChevronDown className="h-3 w-3" />
              </>
            ) : (
              <>
                Oldest <ChevronUp className="h-3 w-3" />
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-foreground-secondary">Loading...</p>
          </div>
        ) : sortedStates.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-foreground-secondary">
              No monthly data yet. Use the Adjust screen to add your first entry.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedStates.map((state) => (
              <div
                key={state.id}
                className="rounded-lg border border-border bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-foreground">
                    {formatMonth(state.month)}
                  </h3>
                  <span className="text-sm text-foreground-muted">{state.month}</span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Net Worth</span>
                    <span className="font-medium text-foreground numeric">
                      {formatCompactCurrency(state.netWorth)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Cash</span>
                    <span className="font-medium text-foreground numeric">
                      {formatCompactCurrency(state.cash)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Income</span>
                    <span className="font-medium text-foreground numeric">
                      {formatCompactCurrency(state.incomeMonthly)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Living Cost</span>
                    <span className="font-medium text-foreground numeric">
                      {formatCompactCurrency(state.livingCostMonthly)}
                    </span>
                  </div>

                  <div className="flex justify-between col-span-2">
                    <span className="text-foreground-muted">Monthly Investment</span>
                    <span className="font-medium text-accent-growth numeric">
                      {formatCompactCurrency(state.monthlyInvestContribution)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Settings</h2>

        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          {/* Base Currency */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Base Currency</p>
              <p className="text-xs text-foreground-muted">Default currency for all values</p>
            </div>
            <div className="rounded-lg bg-secondary px-3 py-1.5">
              <span className="text-sm font-medium text-foreground">JPY (¥)</span>
            </div>
          </div>

          {/* Data Export (placeholder) */}
          <div className="pt-2 border-t border-border">
            <button
              disabled
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground-muted opacity-50 cursor-not-allowed"
            >
              Export Data (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      {sortedStates.length === 0 && !loading && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Quick Start</h2>

          <div className="rounded-lg border border-accent-growth/20 bg-accent-growth/5 p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-accent-growth flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Try Demo Data
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">
                    Generate 6 months of sample data to explore the app
                  </p>
                </div>
                <button
                  onClick={handleGenerateDemo}
                  className="w-full rounded-lg bg-accent-growth px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
                >
                  Generate Demo Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data (only show if there's data) */}
      {sortedStates.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5">
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-accent-negative/20 px-4 py-2.5 text-sm font-medium text-accent-negative hover:bg-accent-negative/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </button>
        </div>
      )}

      {/* App Info */}
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <p className="text-xs text-foreground-muted">
          Financial Trajectory v1.0
        </p>
        <p className="text-xs text-foreground-muted mt-1">
          Understanding your financial direction
        </p>
      </div>
    </div>
  );
}
