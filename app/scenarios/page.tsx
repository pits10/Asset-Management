'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { useScenarios } from '@/lib/hooks/useScenarios';
import { useMonthlyStates } from '@/lib/hooks/useMonthlyStates';
import { calculateProjection } from '@/lib/utils/projection';
import { formatCurrency, formatPercent } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { ScenarioFormDialog } from '@/components/scenarios/scenario-form-dialog';
import type { Scenario } from '@/types';

export default function ScenariosPage() {
  const { scenarios, loading, createScenario, updateScenario, deleteScenario } = useScenarios();
  const { getLatest } = useMonthlyStates();
  const [formOpen, setFormOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | undefined>();
  const [currentNetWorth, setCurrentNetWorth] = useState(0);

  // Load current net worth
  useState(() => {
    getLatest().then((state) => {
      if (state) {
        setCurrentNetWorth(state.netWorth);
      }
    });
  });

  const handleOpenForm = () => {
    setEditingScenario(undefined);
    setFormOpen(true);
  };

  const handleEditScenario = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setFormOpen(true);
  };

  const handleSubmit = async (data: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingScenario) {
      await updateScenario(editingScenario.id, data);
    } else {
      await createScenario(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this scenario?')) {
      await deleteScenario(id);
    }
  };

  // Calculate projections for each scenario
  const scenariosWithProjections = scenarios.map((scenario) => {
    const projection = calculateProjection({
      currentNetWorth: scenario.currentNetWorth,
      monthlyContribution: scenario.monthlyInvestment,
      annualReturn: scenario.expectedReturn,
      years: scenario.years,
    });
    const finalValue = projection[projection.length - 1];
    return {
      scenario,
      finalValue: finalValue?.totalValue || 0,
      totalGrowth: finalValue?.growth || 0,
      totalContributions: finalValue?.contributions || 0,
    };
  });

  return (
    <div className="container mx-auto max-w-lg space-y-6 px-4 py-6">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium text-foreground">Scenarios</h1>
          <p className="text-sm text-foreground-secondary">Save and compare what-if projections</p>
        </div>
        <Button onClick={handleOpenForm} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New
        </Button>
      </header>

      {/* Scenarios List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12 rounded-lg border border-border bg-card">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-growth border-t-transparent" />
          </div>
        ) : scenarios.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-foreground-muted mb-3" />
            <p className="text-sm text-foreground-muted mb-4">No scenarios yet</p>
            <Button onClick={handleOpenForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Scenario
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {scenariosWithProjections.map(({ scenario, finalValue }) => {
              const surplus = scenario.baselineIncome - scenario.monthlySpending;
              const savingsRate = scenario.baselineIncome > 0 ? (surplus / scenario.baselineIncome) * 100 : 0;

              return (
                <div key={scenario.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-foreground truncate">{scenario.name}</h3>
                      <p className="text-xs text-foreground-muted">{scenario.years}-year projection</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditScenario(scenario)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(scenario.id)}
                        className="h-8 w-8 p-0 text-accent-negative hover:text-accent-negative"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Final Value */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-foreground-muted mb-1">Projected Final Value</p>
                    <p className="text-2xl font-medium text-accent-growth numeric">{formatCurrency(finalValue)}</p>
                  </div>

                  {/* Parameters Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Starting</span>
                      <span className="font-medium text-foreground numeric">
                        {formatCurrency(scenario.currentNetWorth)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Monthly Invest</span>
                      <span className="font-medium text-foreground numeric">
                        {formatCurrency(scenario.monthlyInvestment)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Return</span>
                      <span className="font-medium text-foreground">{formatPercent(scenario.expectedReturn)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Savings Rate</span>
                      <span className="font-medium text-accent-growth">{formatPercent(savingsRate)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scenario Form Dialog */}
      <ScenarioFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={editingScenario}
        defaultNetWorth={currentNetWorth}
      />
    </div>
  );
}
