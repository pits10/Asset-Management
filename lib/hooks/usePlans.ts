'use client';

import { useState, useEffect } from 'react';
import { investmentPlansDB } from '@/lib/db/indexeddb';
import type { InvestmentPlan, AssetCategory } from '@/types';

export function usePlans() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await investmentPlansDB.getAll();
      setPlans(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const createPlan = async (
    plan: Omit<InvestmentPlan, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await investmentPlansDB.create(plan);
      await fetchPlans();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updatePlan = async (
    id: string,
    updates: Partial<Omit<InvestmentPlan, 'id' | 'createdAt'>>
  ) => {
    try {
      await investmentPlansDB.update(id, updates);
      await fetchPlans();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await investmentPlansDB.delete(id);
      await fetchPlans();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getTotalMonthlyAmount = () => {
    return plans.reduce((sum, plan) => sum + plan.monthlyAmount, 0);
  };

  const getPlansByCategory = (category: AssetCategory) => {
    return plans.filter((plan) => plan.assetCategory === category);
  };

  return {
    plans,
    loading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    getTotalMonthlyAmount,
    getPlansByCategory,
    refresh: fetchPlans,
  };
}
