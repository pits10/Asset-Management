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
import type { Income, IncomeType } from '@/types';

interface IncomeListProps {
  incomes: Income[];
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
}

const incomeTypeLabels: Record<IncomeType, string> = {
  salary: '給与',
  bonus: '賞与',
  other: 'その他',
};

const incomeTypeColors: Record<IncomeType, string> = {
  salary: 'bg-green-500/10 text-green-500',
  bonus: 'bg-blue-500/10 text-blue-500',
  other: 'bg-gray-500/10 text-gray-500',
};

export function IncomeList({ incomes, onEdit, onDelete }: IncomeListProps) {
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

  if (incomes.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">収入がまだ登録されていません</p>
          <p className="text-sm mt-2">「+ 追加」ボタンから収入を登録してください</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>種類</TableHead>
          <TableHead>収入源</TableHead>
          <TableHead className="text-right">金額</TableHead>
          <TableHead>日付</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incomes.map((income) => (
          <TableRow key={income.id}>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  incomeTypeColors[income.type]
                }`}
              >
                {incomeTypeLabels[income.type]}
              </span>
            </TableCell>
            <TableCell className="font-medium">{income.source}</TableCell>
            <TableCell className="text-right font-mono">
              {formatCurrency(income.amount)}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {format(new Date(income.date), 'yyyy/MM/dd')}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(income)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">編集</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(income.id)}
                  className={
                    deleteConfirm === income.id
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
