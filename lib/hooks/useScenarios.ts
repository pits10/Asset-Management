import { useState, useEffect, useCallback } from 'react';
import { scenariosDB } from '@/lib/db/indexeddb';
import type { Scenario } from '@/types';

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchScenarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scenariosDB.getAll();
      setScenarios(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load scenarios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const createScenario = useCallback(
    async (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setError(null);
        await scenariosDB.create(scenario);
        await fetchScenarios();
      } catch (err) {
        setError(err as Error);
        console.error('Failed to create scenario:', err);
        throw err;
      }
    },
    [fetchScenarios]
  );

  const updateScenario = useCallback(
    async (id: string, updates: Partial<Omit<Scenario, 'id' | 'createdAt'>>) => {
      try {
        setError(null);
        await scenariosDB.update(id, updates);
        await fetchScenarios();
      } catch (err) {
        setError(err as Error);
        console.error('Failed to update scenario:', err);
        throw err;
      }
    },
    [fetchScenarios]
  );

  const deleteScenario = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await scenariosDB.delete(id);
        await fetchScenarios();
      } catch (err) {
        setError(err as Error);
        console.error('Failed to delete scenario:', err);
        throw err;
      }
    },
    [fetchScenarios]
  );

  return {
    scenarios,
    loading,
    error,
    createScenario,
    updateScenario,
    deleteScenario,
    refresh: fetchScenarios,
  };
}
