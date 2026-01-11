'use client';

import { useState } from 'react';
import { Plus, TrendingUp, Edit2, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCashflow } from '@/lib/hooks/useCashflow';
import { formatCurrency, formatMonthDisplay, formatPercent, calculateSavingsRate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { CashflowFormDialog } from '@/components/cashflow/cashflow-form-dialog';
import type { CashflowEntry } from '@/types';

export default function CashflowPage() {
  const { entries, loading, createEntry, updateEntry, deleteEntry } = useCashflow();
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CashflowEntry | undefined>();

  const handleOpenForm = () => {
    setEditingEntry(undefined);
    setFormOpen(true);
  };

  const handleEditEntry = (entry: CashflowEntry) => {
    setEditingEntry(entry);
    setFormOpen(true);
  };

  const handleSubmit = async (data: Omit<CashflowEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, data);
    } else {
      await createEntry(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(id);
    }
  };

  // Sort entries by month (newest first)
  const sortedEntries = [...entries].sort((a, b) => b.month.localeCompare(a.month));

  // Calculate totals
  const totalIncome = entries.reduce((sum, e) => sum + e.baselineIncome + (e.bonusAmount || 0), 0);
  const totalSpending = entries.reduce((sum, e) => sum + e.baselineSpending, 0);
  const totalInvestment = entries.reduce((sum, e) => sum + e.monthlyInvestment, 0);
  const avgSavingsRate = entries.length > 0 ? calculateSavingsRate(totalIncome / entries.length, totalSpending / entries.length) : 0;

  return (
    <div className="container mx-auto max-w-lg space-y-6 px-4 py-6">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium text-foreground">Cashflow</h1>
          <p className="text-sm text-foreground-secondary">Monthly income, spending, and investment</p>
        </div>
        <Button onClick={handleOpenForm} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </header>

      {/* Summary Cards */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="h-4 w-4 text-accent-growth" />
              <p className="text-xs text-foreground-muted">Avg Income</p>
            </div>
            <p className="text-lg font-medium text-foreground numeric">
              {formatCurrency(totalIncome / entries.length)}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="h-4 w-4 text-accent-negative" />
              <p className="text-xs text-foreground-muted">Avg Spending</p>
            </div>
            <p className="text-lg font-medium text-foreground numeric">
              {formatCurrency(totalSpending / entries.length)}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-accent-growth" />
              <p className="text-xs text-foreground-muted">Avg Investment</p>
            </div>
            <p className="text-lg font-medium text-accent-growth numeric">
              {formatCurrency(totalInvestment / entries.length)}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-accent-growth" />
              <p className="text-xs text-foreground-muted">Avg Savings Rate</p>
            </div>
            <p className="text-lg font-medium text-accent-growth">{formatPercent(avgSavingsRate)}</p>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium text-foreground">Monthly Entries</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12 rounded-lg border border-border bg-card">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-growth border-t-transparent" />
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <ArrowLeftRight className="h-12 w-12 mx-auto text-foreground-muted mb-3" />
            <p className="text-sm text-foreground-muted mb-4">No cashflow entries yet</p>
            <Button onClick={handleOpenForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Entry
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedEntries.map((entry) => {
              const totalIncome = entry.baselineIncome + (entry.bonusAmount || 0);
              const surplus = totalIncome - entry.baselineSpending;
              const savingsRate = calculateSavingsRate(totalIncome, entry.baselineSpending);

              return (
                <div key={entry.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium text-foreground">{formatMonthDisplay(entry.month)}</h3>
                      <p className="text-xs text-foreground-muted">
                        Savings Rate: <span className="text-accent-growth">{formatPercent(savingsRate)}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditEntry(entry)} className="h-8 w-8 p-0">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="h-8 w-8 p-0 text-accent-negative hover:text-accent-negative"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Income</span>
                      <span className="font-medium text-accent-growth numeric">{formatCurrency(totalIncome)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Spending</span>
                      <span className="font-medium text-accent-negative numeric">
                        {formatCurrency(entry.baselineSpending)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Investment</span>
                      <span className="font-medium text-accent-growth numeric">
                        {formatCurrency(entry.monthlyInvestment)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Surplus</span>
                      <span
                        className={`font-medium numeric ${
                          surplus >= 0 ? 'text-accent-growth' : 'text-accent-negative'
                        }`}
                      >
                        {surplus >= 0 ? '+' : ''}
                        {formatCurrency(surplus)}
                      </span>
                    </div>

                    {entry.bonusAmount && entry.bonusAmount > 0 && (
                      <div className="flex justify-between col-span-2 pt-2 border-t border-border">
                        <span className="text-foreground-muted">Bonus</span>
                        <span className="font-medium text-accent-growth numeric">{formatCurrency(entry.bonusAmount)}</span>
                      </div>
                    )}

                    {entry.notes && (
                      <div className="col-span-2 pt-2 border-t border-border">
                        <p className="text-xs text-foreground-muted">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cashflow Form Dialog */}
      <CashflowFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleSubmit} initialData={editingEntry} />
    </div>
  );
}

// Need to export this separately due to import circular dependency
import { ArrowLeftRight } from 'lucide-react';
