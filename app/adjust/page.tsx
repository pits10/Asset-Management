"use client";

import { useState, useEffect } from "react";
import { useMonthlyStates } from "@/lib/hooks/useMonthlyStates";
import { formatCurrency } from "@/lib/utils/projection";
import { calculateSavingsRate } from "@/lib/utils/direction";
import { format } from "date-fns";

export default function AdjustPage() {
  const { getLatest, upsertByMonth } = useMonthlyStates();

  // Income
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [annualBonus, setAnnualBonus] = useState("");
  const [annualGrowth, setAnnualGrowth] = useState("");

  // Lifestyle
  const [monthlyLivingCost, setMonthlyLivingCost] = useState("");

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load latest state
  useEffect(() => {
    getLatest().then((state) => {
      if (state) {
        setMonthlyIncome(state.incomeMonthly > 0 ? state.incomeMonthly.toString() : "");
        setMonthlyLivingCost(state.livingCostMonthly > 0 ? state.livingCostMonthly.toString() : "");
      }
    });
  }, [getLatest]);

  // Calculations
  const monthlyIncomeNum = parseFloat(monthlyIncome) || 0;
  const annualBonusNum = parseFloat(annualBonus) || 0;
  const monthlyLivingCostNum = parseFloat(monthlyLivingCost) || 0;

  const totalAnnualIncome = monthlyIncomeNum * 12 + annualBonusNum;
  const monthlySurplus = monthlyIncomeNum - monthlyLivingCostNum;
  const savingsRate = calculateSavingsRate(monthlyIncomeNum, monthlyLivingCostNum);

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentMonth = format(new Date(), "yyyy-MM");
      const latest = await getLatest();

      await upsertByMonth(currentMonth, {
        netWorth: latest?.netWorth || 0,
        cash: latest?.cash || 0,
        invested: latest?.invested || 0,
        incomeMonthly: monthlyIncomeNum,
        livingCostMonthly: monthlyLivingCostNum,
        monthlyInvestContribution: latest?.monthlyInvestContribution || 0,
      });

      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg space-y-6 px-4 py-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-medium text-foreground">Adjust</h1>
        <p className="text-sm text-foreground-secondary">Change the levers</p>
      </header>

      {/* Income Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Income</h2>

        <div className="rounded-lg border border-border bg-card p-5 space-y-5">
          {/* Monthly Income */}
          <div className="space-y-2">
            <label className="text-sm text-foreground-secondary">
              Monthly Income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
                ¥
              </span>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="300,000"
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 pl-7 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring numeric"
              />
            </div>
          </div>

          {/* Annual Bonus */}
          <div className="space-y-2">
            <label className="text-sm text-foreground-secondary">
              Annual Bonus <span className="text-foreground-muted">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
                ¥
              </span>
              <input
                type="number"
                value={annualBonus}
                onChange={(e) => setAnnualBonus(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 pl-7 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring numeric"
              />
            </div>
          </div>

          {/* Annual Growth */}
          <div className="space-y-2">
            <label className="text-sm text-foreground-secondary">
              Expected Annual Growth{" "}
              <span className="text-foreground-muted">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={annualGrowth}
                onChange={(e) => setAnnualGrowth(e.target.value)}
                placeholder="0"
                step="0.5"
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 pr-8 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring numeric"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted">
                %
              </span>
            </div>
          </div>

          {/* Computed Annual Income */}
          {totalAnnualIncome > 0 && (
            <div className="rounded-lg bg-secondary p-4 space-y-1">
              <p className="text-xs text-foreground-muted">Total Annual Income</p>
              <p className="text-lg font-medium text-foreground numeric">
                {formatCurrency(totalAnnualIncome)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lifestyle Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Lifestyle Cost</h2>

        <div className="rounded-lg border border-border bg-card p-5 space-y-5">
          {/* Monthly Living Cost */}
          <div className="space-y-2">
            <label className="text-sm text-foreground-secondary">
              Monthly Living Cost
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
                ¥
              </span>
              <input
                type="number"
                value={monthlyLivingCost}
                onChange={(e) => setMonthlyLivingCost(e.target.value)}
                placeholder="200,000"
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 pl-7 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring numeric"
              />
            </div>
            <p className="text-xs text-foreground-muted">
              All expenses combined (no categories needed)
            </p>
          </div>

          {/* Computed Metrics */}
          {monthlyIncomeNum > 0 && monthlyLivingCostNum > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-foreground-secondary">
                  Monthly Surplus
                </span>
                <span
                  className={`text-base font-medium numeric ${
                    monthlySurplus >= 0
                      ? "text-accent-growth"
                      : "text-accent-negative"
                  }`}
                >
                  {formatCurrency(monthlySurplus)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-foreground-secondary">
                  Savings Rate
                </span>
                <span
                  className={`text-base font-medium numeric ${
                    savingsRate >= 20
                      ? "text-accent-growth"
                      : savingsRate >= 10
                      ? "text-foreground"
                      : "text-accent-warning"
                  }`}
                >
                  {savingsRate}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || !monthlyIncomeNum}
        className="w-full rounded-lg bg-accent-growth px-4 py-3 font-medium text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {lastSaved && (
        <p className="text-xs text-center text-foreground-muted">
          Last saved: {format(lastSaved, "h:mm a")}
        </p>
      )}

      {/* Future: Allocation Section */}
      {/* <div className="opacity-40 pointer-events-none">
        <h2 className="text-lg font-medium text-foreground mb-4">
          Allocation <span className="text-sm text-foreground-muted">(Coming Soon)</span>
        </h2>
      </div> */}
    </div>
  );
}
