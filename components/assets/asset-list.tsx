'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { calculateAssetValue, getAssetDisplayName } from '@/lib/utils/asset-helpers';
import type { Asset, AssetCategory } from '@/types';
import { AssetCategoryLabels } from '@/types';

interface AssetListProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<AssetCategory, string> = {
  deposit: 'bg-blue-500/10 text-blue-500',
  stock: 'bg-green-500/10 text-green-500',
  fund: 'bg-purple-500/10 text-purple-500',
  crypto: 'bg-amber-500/10 text-amber-500',
  employeeStock: 'bg-red-500/10 text-red-500',
};

export function AssetList({ assets, onEdit, onDelete }: AssetListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  if (assets.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">資産がまだ登録されていません</p>
          <p className="text-sm mt-2">「+ 追加」ボタンから資産を登録してください</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>カテゴリ</TableHead>
          <TableHead>資産名</TableHead>
          <TableHead className="text-right">評価額</TableHead>
          <TableHead>更新日</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.id}>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  categoryColors[asset.category]
                }`}
              >
                {AssetCategoryLabels[asset.category]}
              </span>
            </TableCell>
            <TableCell className="font-medium">
              {getAssetDisplayName(asset)}
              {asset.category === 'stock' && asset.ticker && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({asset.ticker})
                </span>
              )}
              {asset.category === 'employeeStock' && asset.ticker && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({asset.ticker})
                </span>
              )}
            </TableCell>
            <TableCell className="text-right font-mono">
              {formatCurrency(calculateAssetValue(asset))}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {format(new Date(asset.updatedAt), 'yyyy/MM/dd')}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(asset)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">編集</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(asset.id)}
                  className={
                    deleteConfirm === asset.id
                      ? 'text-red-500 hover:text-red-600'
                      : ''
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">削除</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
