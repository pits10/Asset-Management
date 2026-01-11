'use client';

import { useState } from 'react';
import { Plus, Wallet, TrendingUp, Coins, Briefcase, PiggyBank } from 'lucide-react';
import { useAssets } from '@/lib/hooks/useAssets';
import { AssetCategoryLabels } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { AssetFormDialog } from '@/components/assets/asset-form-dialog';
import { AssetListItem } from '@/components/assets/asset-list-item';
import type { Asset, AssetCategory } from '@/types';

const CATEGORY_ICONS: Record<AssetCategory, typeof Wallet> = {
  deposit: PiggyBank,
  stock: TrendingUp,
  fund: Briefcase,
  crypto: Coins,
  employeeStock: Wallet,
};

export default function AssetsPage() {
  const { assets, loading, createAsset, updateAsset, deleteAsset, getTotalAssets, getCategoryTotals } = useAssets();
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

  const handleSubmit = async (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAsset) {
      await updateAsset(editingAsset.id, data);
    } else {
      await createAsset(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      await deleteAsset(id);
    }
  };

  const totalAssets = getTotalAssets();
  const categoryTotals = getCategoryTotals();

  return (
    <div className="container mx-auto max-w-lg space-y-6 px-4 py-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-medium text-foreground">Assets</h1>
        <p className="text-sm text-foreground-secondary">
          Manage your holdings across 5 asset classes
        </p>
      </header>

      {/* Total Assets Card */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-foreground-muted">Total Assets</p>
          <Button onClick={() => handleOpenForm()} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
        </div>
        <p className="text-3xl font-medium text-foreground numeric">
          {formatCurrency(totalAssets)}
        </p>
        <p className="text-sm text-foreground-muted mt-1">{assets.length} assets</p>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium text-foreground">By Category</h2>
        <div className="space-y-2">
          {Object.entries(categoryTotals).map(([category, total]) => {
            const Icon = CATEGORY_ICONS[category as AssetCategory];
            const categoryAssets = assets.filter((a) => a.category === category);

            return (
              <div
                key={category}
                className="rounded-lg border border-border bg-card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-secondary p-2">
                    <Icon className="h-5 w-5 text-accent-growth" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {AssetCategoryLabels[category as AssetCategory]}
                    </p>
                    <p className="text-xs text-foreground-muted">{categoryAssets.length} assets</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground numeric">
                  {formatCurrency(total)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Asset List */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium text-foreground">All Assets</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12 rounded-lg border border-border bg-card">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-growth border-t-transparent" />
          </div>
        ) : assets.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <Wallet className="h-12 w-12 mx-auto text-foreground-muted mb-3" />
            <p className="text-sm text-foreground-muted mb-4">No assets yet</p>
            <Button onClick={() => handleOpenForm()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Asset
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {assets.map((asset) => (
              <AssetListItem
                key={asset.id}
                asset={asset}
                onEdit={() => handleEditAsset(asset)}
                onDelete={() => handleDelete(asset.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Asset Form Dialog */}
      <AssetFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={editingAsset}
      />
    </div>
  );
}
