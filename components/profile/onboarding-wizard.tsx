'use client';

import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, parseCurrency } from '@/lib/utils/format';
import type { Currency } from '@/lib/utils/format';

interface OnboardingData {
  name: string;
  baseCurrency: Currency;
  displayCurrency: Currency;
  targetNetWorth: number | null;
}

interface OnboardingWizardProps {
  open: boolean;
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingWizard({ open, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    baseCurrency: 'JPY',
    displayCurrency: 'JPY',
    targetNetWorth: null,
  });

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) {
      return; // Name is required
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = () => {
    if (!formData.name.trim()) return;

    onComplete({
      ...formData,
      name: formData.name.trim(),
    });
  };

  const handleTargetNetWorthChange = (value: string) => {
    if (value === '') {
      setFormData({ ...formData, targetNetWorth: null });
    } else {
      const parsed = parseCurrency(value);
      setFormData({ ...formData, targetNetWorth: parsed || null });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {step === 1 && 'Welcome to Personal Wealth OS'}
            {step === 2 && 'Currency Settings'}
            {step === 3 && 'Set Your Goal'}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Let's get started by setting up your profile"}
            {step === 2 && 'Choose your preferred currencies'}
            {step === 3 && 'Optional: Set a target net worth goal'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseCurrency">Base Currency</Label>
                <Select
                  value={formData.baseCurrency}
                  onValueChange={(value: Currency) =>
                    setFormData({ ...formData, baseCurrency: value, displayCurrency: value })
                  }
                >
                  <SelectTrigger id="baseCurrency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                    <SelectItem value="USD" disabled>
                      USD ($) - US Dollar (Coming Soon)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-foreground-muted">
                  This is the currency for all your financial data
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayCurrency">Display Currency</Label>
                <Select
                  value={formData.displayCurrency}
                  onValueChange={(value: Currency) =>
                    setFormData({ ...formData, displayCurrency: value })
                  }
                >
                  <SelectTrigger id="displayCurrency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                    <SelectItem value="USD" disabled>
                      USD ($) - US Dollar (Coming Soon)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-foreground-muted">
                  Currently only JPY is supported
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetNetWorth">Target Net Worth (Optional)</Label>
                <Input
                  id="targetNetWorth"
                  placeholder={formatCurrency(10000000, formData.baseCurrency)}
                  value={
                    formData.targetNetWorth !== null
                      ? formatCurrency(formData.targetNetWorth, formData.baseCurrency)
                      : ''
                  }
                  onChange={(e) => handleTargetNetWorthChange(e.target.value)}
                />
                <p className="text-sm text-foreground-muted">
                  Set a long-term net worth goal to track your progress
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between gap-2">
          <div className="flex-1">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="w-full">
                Back
              </Button>
            )}
          </div>
          <div className="flex-1">
            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={step === 1 && !formData.name.trim()}
                className="w-full"
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={!formData.name.trim()} className="w-full">
                Complete Setup
              </Button>
            )}
          </div>
        </DialogFooter>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 pb-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full ${
                i === step ? 'bg-accent-growth' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
