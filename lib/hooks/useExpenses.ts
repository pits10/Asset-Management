'use client';

import { useState, useEffect } from 'react';
import { expensesDB } from '@/lib/db/indexeddb';
import type { Expense, ExpenseType, ExpenseCategory } from '@/types';
import { startOfMonth, endOfMonth } from 'date-fns';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expensesDB.getAll();
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const createExpense = async (
    expense: Omit<Expense, 'id' | 'createdAt'>
  ) => {
    try {
      await expensesDB.create(expense);
      await fetchExpenses();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateExpense = async (
    id: string,
    updates: Partial<Omit<Expense, 'id' | 'createdAt'>>
  ) => {
    try {
      await expensesDB.update(id, updates);
      await fetchExpenses();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expensesDB.delete(id);
      await fetchExpenses();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getMonthlyTotal = (date: Date = new Date()) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getExpensesByType = (type: ExpenseType) => {
    return expenses.filter((expense) => expense.type === type);
  };

  const getTypeTotal = (type: ExpenseType, date: Date = new Date()) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expense.type === type && expenseDate >= start && expenseDate <= end;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getCategoryTotals = (date: Date = new Date()) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });

    const totals: Record<ExpenseCategory, number> = {
      housing: 0,
      utilities: 0,
      telecom: 0,
      subscription: 0,
      insurance: 0,
      food: 0,
      transport: 0,
      entertainment: 0,
      clothing: 0,
      other: 0,
    };

    monthlyExpenses.forEach((expense) => {
      totals[expense.category] += expense.amount;
    });

    return totals;
  };

  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    getMonthlyTotal,
    getExpensesByType,
    getTypeTotal,
    getCategoryTotals,
    refresh: fetchExpenses,
  };
}
