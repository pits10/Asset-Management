'use client';

import { useState, useEffect } from 'react';
import { incomesDB } from '@/lib/db/indexeddb';
import { startOfMonth, endOfMonth } from 'date-fns';
import type { Income, IncomeType } from '@/types';

export function useIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const data = await incomesDB.getAll();
      setIncomes(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const createIncome = async (
    income: Omit<Income, 'id' | 'createdAt'>
  ) => {
    try {
      await incomesDB.create(income);
      await fetchIncomes();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateIncome = async (
    id: string,
    updates: Partial<Omit<Income, 'id' | 'createdAt'>>
  ) => {
    try {
      await incomesDB.update(id, updates);
      await fetchIncomes();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      await incomesDB.delete(id);
      await fetchIncomes();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getMonthlyTotal = (date: Date = new Date()) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    return incomes
      .filter((income) => {
        const incomeDate = new Date(income.date);
        return incomeDate >= start && incomeDate <= end;
      })
      .reduce((sum, income) => sum + income.amount, 0);
  };

  const getIncomesByType = (type: IncomeType) => {
    return incomes.filter((income) => income.type === type);
  };

  const getTypeTotal = (type: IncomeType, date: Date = new Date()) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    return incomes
      .filter((income) => {
        const incomeDate = new Date(income.date);
        return income.type === type && incomeDate >= start && incomeDate <= end;
      })
      .reduce((sum, income) => sum + income.amount, 0);
  };

  return {
    incomes,
    loading,
    error,
    createIncome,
    updateIncome,
    deleteIncome,
    getMonthlyTotal,
    getIncomesByType,
    getTypeTotal,
    refresh: fetchIncomes,
  };
}
