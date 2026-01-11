import { useState, useEffect, useCallback } from 'react';
import { userProfileDB } from '@/lib/db/indexeddb';
import type { UserProfile } from '@/types';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userProfileDB.get();
      setProfile(data || null);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load user profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = useCallback(
    async (data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setError(null);
        await userProfileDB.set(data);
        await loadProfile(); // Reload to get the saved profile
      } catch (err) {
        setError(err as Error);
        console.error('Failed to save user profile:', err);
        throw err;
      }
    },
    [loadProfile]
  );

  const updateProfile = useCallback(
    async (updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>) => {
      if (!profile) {
        throw new Error('No profile to update');
      }

      try {
        setError(null);
        await userProfileDB.update(profile.id, updates);
        await loadProfile(); // Reload to get the updated profile
      } catch (err) {
        setError(err as Error);
        console.error('Failed to update user profile:', err);
        throw err;
      }
    },
    [profile, loadProfile]
  );

  return {
    profile,
    loading,
    error,
    saveProfile,
    updateProfile,
    refresh: loadProfile,
    isOnboarded: profile?.onboardingCompleted ?? false,
  };
}
