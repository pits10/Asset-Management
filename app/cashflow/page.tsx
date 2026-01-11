'use client';

import { Wallet } from 'lucide-react';

export default function CashflowPage() {
  return (
    <div className="container mx-auto max-w-lg space-y-6 px-4 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-medium text-foreground">Cashflow</h1>
        <p className="text-sm text-foreground-secondary">
          Track monthly income, spending, and investment
        </p>
      </header>

      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-card">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Wallet className="h-12 w-12 text-foreground-muted" />
          </div>
          <p className="text-sm text-foreground-muted">Cashflow screen coming soon</p>
        </div>
      </div>
    </div>
  );
}
