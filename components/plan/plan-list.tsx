'use client';

import { useState } from 'react';
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
import type { InvestmentPlan, AssetCategory } from '@/types';


interface PlanListProps {
  plans: InvestmentPlan[];
  onEdit: (plan: InvestmentPlan) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<AssetCategory, string> = {
  deposit: 'bg-blue-500/10 text-blue-500',
  stock: 'bg-green-500/10 text-green-500',
  fund: 'bg-purple-500/10 text-purple-500',
  crypto: 'bg-amber-500/10 text-amber-500',
  employeeStock: 'bg-red-500/10 text-red-500',
};

export function PlanList({ plans, onEdit, onDelete }: PlanListProps) {
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

  if (plans.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">積立プランがまだ登録されていません</p>
          <p className="text-sm mt-2">「+ 追加」ボタンから積立プランを登録してください</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>カテゴリ</TableHead>
          <TableHead className="text-right">月間積立額</TableHead>
          <TableHead className="text-right">期待リターン</TableHead>
          <TableHead className="text-right">年間積立額</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  categoryColors[plan.assetCategory]
                }`}
              >
                {plan.categoryName}
              </span>
            </TableCell>
            <TableCell className="text-right font-mono">
              {formatCurrency(plan.monthlyAmount)}
            </TableCell>
            <TableCell className="text-right font-mono">
              {plan.expectedReturn !== undefined
                ? `${plan.expectedReturn.toFixed(1)}%`
                : '-'}
            </TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">
              {formatCurrency(plan.monthlyAmount * 12)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(plan)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">編集</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(plan.id)}
                  className={
                    deleteConfirm === plan.id
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
