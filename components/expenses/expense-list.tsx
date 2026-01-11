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
import type { Expense, ExpenseType, ExpenseCategory } from '@/types';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const typeLabels: Record<ExpenseType, string> = {
  fixed: '固定費',
  variable: '変動費',
};

const categoryLabels: Record<ExpenseCategory, string> = {
  housing: '住居',
  utilities: '光熱費',
  telecom: '通信費',
  subscription: 'サブスク',
  insurance: '保険',
  food: '食費',
  transport: '交通費',
  entertainment: '娯楽',
  clothing: '衣服',
  other: 'その他',
};

const typeColors: Record<ExpenseType, string> = {
  fixed: 'bg-orange-500/10 text-orange-500',
  variable: 'bg-blue-500/10 text-blue-500',
};

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
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

  // Sort by date descending
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (expenses.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">支出がまだ登録されていません</p>
          <p className="text-sm mt-2">「+ 追加」ボタンから支出を登録してください</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>タイプ</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead className="text-right">金額</TableHead>
          <TableHead>日付</TableHead>
          <TableHead>メモ</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedExpenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  typeColors[expense.type]
                }`}
              >
                {typeLabels[expense.type]}
              </span>
            </TableCell>
            <TableCell className="font-medium">
              {categoryLabels[expense.category]}
            </TableCell>
            <TableCell className="text-right font-mono text-red-500">
              {formatCurrency(expense.amount)}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {format(new Date(expense.date), 'yyyy/MM/dd')}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {expense.memo || '-'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(expense)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">編集</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(expense.id)}
                  className={
                    deleteConfirm === expense.id
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
