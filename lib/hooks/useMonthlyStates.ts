"use client";

import { useState, useEffect } from "react";
import { monthlyStatesDB } from "@/lib/db/indexeddb";
import type { MonthlyState } from "@/types";

export function useMonthlyStates() {
  const [states, setStates] = useState<MonthlyState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const data = await monthlyStatesDB.getAll();
      setStates(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const createState = async (
    state: Omit<MonthlyState, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await monthlyStatesDB.create(state);
      await fetchStates();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateState = async (
    id: string,
    updates: Partial<Omit<MonthlyState, "id" | "createdAt">>
  ) => {
    try {
      await monthlyStatesDB.update(id, updates);
      await fetchStates();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const upsertByMonth = async (
    month: string,
    state: Omit<MonthlyState, "id" | "month" | "createdAt" | "updatedAt">
  ) => {
    try {
      await monthlyStatesDB.upsertByMonth(month, state);
      await fetchStates();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteState = async (id: string) => {
    try {
      await monthlyStatesDB.delete(id);
      await fetchStates();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getLatest = async () => {
    try {
      return await monthlyStatesDB.getLatest();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getRecent = async (count: number) => {
    try {
      return await monthlyStatesDB.getRecent(count);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    states,
    loading,
    error,
    createState,
    updateState,
    upsertByMonth,
    deleteState,
    getLatest,
    getRecent,
    refresh: fetchStates,
  };
}
