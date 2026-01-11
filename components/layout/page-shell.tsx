'use client';

import { ReactNode } from 'react';
import { BottomNav } from './bottom-nav';
import { OnboardingWizard } from '@/components/profile/onboarding-wizard';
import { useUserProfile } from '@/lib/hooks/useUserProfile';

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  const { profile, loading, saveProfile, isOnboarded } = useUserProfile();

  const handleOnboardingComplete = async (data: {
    name: string;
    baseCurrency: 'JPY' | 'USD';
    displayCurrency: 'JPY' | 'USD';
    targetNetWorth: number | null;
  }) => {
    await saveProfile({
      name: data.name,
      baseCurrency: data.baseCurrency,
      displayCurrency: data.displayCurrency,
      targetNetWorth: data.targetNetWorth || undefined,
      onboardingCompleted: true,
    });
  };

  // Don't show anything while loading to avoid flash
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-growth border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <OnboardingWizard open={!isOnboarded} onComplete={handleOnboardingComplete} />

      <div className="flex min-h-screen flex-col">
        <main className="flex-1 pb-20">{children}</main>
        <BottomNav />
      </div>
    </>
  );
}
