'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Scenario } from '@/types';

interface ScenarioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Scenario;
  defaultNetWorth: number;
}

export function ScenarioFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  defaultNetWorth,
}: ScenarioFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    years: '10',
    expectedReturn: '7',
    monthlyInvestment: '50000',
    monthlySpending: '200000',
    incomeGrowth: '2',
    baselineIncome: '300000',
    currentNetWorth: defaultNetWorth.toString(),
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        years: initialData.years.toString(),
        expectedReturn: initialData.expectedReturn.toString(),
        monthlyInvestment: initialData.monthlyInvestment.toString(),
        monthlySpending: initialData.monthlySpending.toString(),
        incomeGrowth: initialData.incomeGrowth.toString(),
        baselineIncome: initialData.baselineIncome.toString(),
        currentNetWorth: initialData.currentNetWorth.toString(),
      });
    } else if (open) {
      setFormData({
        name: '',
        years: '10',
        expectedReturn: '7',
        monthlyInvestment: '50000',
        monthlySpending: '200000',
        incomeGrowth: '2',
        baselineIncome: '300000',
        currentNetWorth: defaultNetWorth.toString(),
      });
    }
  }, [initialData, open, defaultNetWorth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        name: formData.name,
        years: parseInt(formData.years) || 10,
        expectedReturn: parseFloat(formData.expectedReturn) || 7,
        monthlyInvestment: parseFloat(formData.monthlyInvestment) || 0,
        monthlySpending: parseFloat(formData.monthlySpending) || 0,
        incomeGrowth: parseFloat(formData.incomeGrowth) || 0,
        baselineIncome: parseFloat(formData.baselineIncome) || 0,
        currentNetWorth: parseFloat(formData.currentNetWorth) || defaultNetWorth,
      });
    } catch (error) {
      console.error('Failed to save scenario:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Scenario' : 'New Scenario'}</DialogTitle>
          <DialogDescription>Create a what-if projection to compare different strategies</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Scenario Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Aggressive Savings, Conservative Plan"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="years">Years *</Label>
              <Input
                id="years"
                type="number"
                min="1"
                max="50"
                value={formData.years}
                onChange={(e) => setFormData({ ...formData, years: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedReturn">Return (%) *</Label>
              <Input
                id="expectedReturn"
                type="number"
                step="0.1"
                value={formData.expectedReturn}
                onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentNetWorth">Starting Net Worth *</Label>
            <Input
              id="currentNetWorth"
              type="number"
              value={formData.currentNetWorth}
              onChange={(e) => setFormData({ ...formData, currentNetWorth: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyInvestment">Monthly Investment *</Label>
            <Input
              id="monthlyInvestment"
              type="number"
              value={formData.monthlyInvestment}
              onChange={(e) => setFormData({ ...formData, monthlyInvestment: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="baselineIncome">Monthly Income *</Label>
            <Input
              id="baselineIncome"
              type="number"
              value={formData.baselineIncome}
              onChange={(e) => setFormData({ ...formData, baselineIncome: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlySpending">Monthly Spending *</Label>
            <Input
              id="monthlySpending"
              type="number"
              value={formData.monthlySpending}
              onChange={(e) => setFormData({ ...formData, monthlySpending: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="incomeGrowth">Income Growth (% per year) *</Label>
            <Input
              id="incomeGrowth"
              type="number"
              step="0.1"
              value={formData.incomeGrowth}
              onChange={(e) => setFormData({ ...formData, incomeGrowth: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !formData.name.trim()}>
              {submitting ? 'Saving...' : initialData ? 'Update' : 'Create Scenario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
