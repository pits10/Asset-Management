'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAssets } from '@/lib/hooks/useAssets';
import { AssetForm } from '@/components/assets/asset-form';
import { AssetList } from '@/components/assets/asset-list';
import { AssetDonutChart } from '@/components/assets/asset-donut-chart';
import type { Asset } from '@/types';

export default function AssetsPage() {
  const {
    assets,
    loading,
    createAsset,
    updateAsset,
    deleteAsset,
    getTotalAssets,
    getCategoryTotals,
  } = useAssets();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>();

  const handleOpenForm = () => {
    setEditingAsset(undefined);
    setFormOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setFormOpen(true);
  };

  const handleSubmit = async (
    data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingAsset) {
      await updateAsset(editingAsset.id, data);
    } else {
      await createAsset(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAsset(id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const totalAssets = getTotalAssets();
  const categoryTotals = getCategoryTotals();

  return (
    <div className="min-h-screen bg-background">
      <Header title="Assets" description="Manage your assets and investments" />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Assets
              </CardTitle>
              <Button onClick={handleOpenForm}>
                <Plus className="mr-2 h-4 w-4" />
                追加
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(totalAssets)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {assets.length} 件の資産
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AssetDonutChart data={categoryTotals} />
            </CardContent>
          </Card>
        </div>

        {/* Asset List */}
        <Card>
          <CardHeader>
            <CardTitle>Asset List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">読み込み中...</p>
              </div>
            ) : (
              <AssetList
                assets={assets}
                onEdit={handleEditAsset}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Asset Form Modal */}
      <AssetForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={editingAsset}
        mode={editingAsset ? 'edit' : 'create'}
      />
    </div>
  );
}
