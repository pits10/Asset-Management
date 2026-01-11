'use client';

import { useState, useEffect } from 'react';
import { assetsDB } from '@/lib/db/indexeddb';
import { calculateCategoryTotals, calculateTotalAssets } from '@/lib/utils/asset-helpers';
import type { Asset, AssetCategory } from '@/types';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await assetsDB.getAll();
      setAssets(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const createAsset = async (
    asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await assetsDB.create(asset);
      await fetchAssets();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateAsset = async (
    id: string,
    updates: Partial<Omit<Asset, 'id' | 'createdAt'>>
  ) => {
    try {
      await assetsDB.update(id, updates);
      await fetchAssets();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      await assetsDB.delete(id);
      await fetchAssets();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getTotalAssets = () => {
    return calculateTotalAssets(assets);
  };

  const getAssetsByCategory = (category: AssetCategory) => {
    return assets.filter((asset) => asset.category === category);
  };

  const getCategoryTotals = () => {
    return calculateCategoryTotals(assets);
  };

  return {
    assets,
    loading,
    error,
    createAsset,
    updateAsset,
    deleteAsset,
    getTotalAssets,
    getAssetsByCategory,
    getCategoryTotals,
    refresh: fetchAssets,
  };
}
