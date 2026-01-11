'use client';

import { GitCompare } from 'lucide-react';

export default function ScenariosPage() {
  return (
    <div className="container mx-auto max-w-lg space-y-6 px-4 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-medium text-foreground">Scenarios</h1>
        <p className="text-sm text-foreground-secondary">
          Save and compare what-if projections
        </p>
      </header>

      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-card">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <GitCompare className="h-12 w-12 text-foreground-muted" />
          </div>
          <p className="text-sm text-foreground-muted">Scenarios screen coming soon</p>
        </div>
      </div>
    </div>
  );
}
