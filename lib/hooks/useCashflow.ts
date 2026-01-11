import { useState, useEffect, useCallback } from 'react';
import { cashflowEntriesDB } from '@/lib/db/indexeddb';
import type { CashflowEntry } from '@/types';

export function useCashflow() {
  const [entries, setEntries] = useState<CashflowEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cashflowEntriesDB.getAll();
      setEntries(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load cashflow entries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const createEntry = useCallback(
    async (entry: Omit<CashflowEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setError(null);
        await cashflowEntriesDB.create(entry);
        await fetchEntries();
      } catch (err) {
        setError(err as Error);
        console.error('Failed to create cashflow entry:', err);
        throw err;
      }
    },
    [fetchEntries]
  );

  const updateEntry = useCallback(
    async (id: string, updates: Partial<Omit<CashflowEntry, 'id' | 'createdAt'>>) => {
      try {
        setError(null);
        await cashflowEntriesDB.update(id, updates);
        await fetchEntries();
      } catch (err) {
        setError(err as Error);
        console.error('Failed to update cashflow entry:', err);
        throw err;
      }
    },
    [fetchEntries]
  );

  const upsertByMonth = useCallback(
    async (month: string, entry: Omit<CashflowEntry, 'id' | 'month' | 'createdAt' | 'updatedAt'>) => {
      try {
        setError(null);
        await cashflowEntriesDB.upsertByMonth(month, entry);
        await fetchEntries();
      } catch (err) {
        setError(err as Error);
        console.error('Failed to upsert cashflow entry:', err);
        throw err;
      }
    },
    [fetchEntries]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await cashflowEntriesDB.delete(id);
        await fetchEntries();
      } catch (err) {
        setError(err as Error);
        console.error('Failed to delete cashflow entry:', err);
        throw err;
      }
    },
    [fetchEntries]
  );

  const getByMonth = useCallback(
    (month: string) => {
      return entries.find((entry) => entry.month === month);
    },
    [entries]
  );

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    upsertByMonth,
    deleteEntry,
    getByMonth,
    refresh: fetchEntries,
  };
}
