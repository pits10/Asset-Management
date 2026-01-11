'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCurrentMonth } from '@/lib/utils/format';
import type { CashflowEntry } from '@/types';

interface CashflowFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<CashflowEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: CashflowEntry;
}

export function CashflowFormDialog({ open, onOpenChange, onSubmit, initialData }: CashflowFormDialogProps) {
  const [formData, setFormData] = useState({
    month: getCurrentMonth(),
    baselineIncome: '',
    baselineSpending: '',
    monthlyInvestment: '',
    bonusAmount: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        month: initialData.month,
        baselineIncome: initialData.baselineIncome.toString(),
        baselineSpending: initialData.baselineSpending.toString(),
        monthlyInvestment: initialData.monthlyInvestment.toString(),
        bonusAmount: initialData.bonusAmount?.toString() || '',
        notes: initialData.notes || '',
      });
    } else if (open) {
      setFormData({
        month: getCurrentMonth(),
        baselineIncome: '',
        baselineSpending: '',
        monthlyInvestment: '',
        bonusAmount: '',
        notes: '',
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        month: formData.month,
        baselineIncome: parseFloat(formData.baselineIncome) || 0,
        baselineSpending: parseFloat(formData.baselineSpending) || 0,
        monthlyInvestment: parseFloat(formData.monthlyInvestment) || 0,
        bonusAmount: formData.bonusAmount ? parseFloat(formData.bonusAmount) : undefined,
        notes: formData.notes || undefined,
      });
    } catch (error) {
      console.error('Failed to save cashflow entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Cashflow Entry' : 'Add Cashflow Entry'}</DialogTitle>
          <DialogDescription>Track your monthly income, spending, and investment</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="month">Month *</Label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="baselineIncome">Monthly Income (Salary) *</Label>
            <Input
              id="baselineIncome"
              type="number"
              step="0.01"
              value={formData.baselineIncome}
              onChange={(e) => setFormData({ ...formData, baselineIncome: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bonusAmount">Bonus (Optional)</Label>
            <Input
              id="bonusAmount"
              type="number"
              step="0.01"
              value={formData.bonusAmount}
              onChange={(e) => setFormData({ ...formData, bonusAmount: e.target.value })}
              placeholder="0"
            />
            <p className="text-xs text-foreground-muted">Additional income for this month</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baselineSpending">Monthly Spending *</Label>
            <Input
              id="baselineSpending"
              type="number"
              step="0.01"
              value={formData.baselineSpending}
              onChange={(e) => setFormData({ ...formData, baselineSpending: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyInvestment">Monthly Investment *</Label>
            <Input
              id="monthlyInvestment"
              type="number"
              step="0.01"
              value={formData.monthlyInvestment}
              onChange={(e) => setFormData({ ...formData, monthlyInvestment: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes for this month"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : initialData ? 'Update' : 'Add Entry'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
