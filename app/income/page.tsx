'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { IncomeForm } from '@/components/income/income-form';
import { IncomeList } from '@/components/income/income-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIncomes } from '@/lib/hooks/useIncomes';
import type { Income } from '@/types';

export default function IncomePage() {
  const {
    incomes,
    loading,
    createIncome,
    updateIncome,
    deleteIncome,
    getMonthlyTotal,
    getTypeTotal,
  } = useIncomes();

  const [formOpen, setFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const handleCreate = () => {
    setEditingIncome(undefined);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleSubmit = async (data: Omit<Income, 'id' | 'createdAt'>) => {
    if (formMode === 'create') {
      await createIncome(data);
    } else if (editingIncome) {
      await updateIncome(editingIncome.id, data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteIncome(id);
  };

  const monthlyTotal = getMonthlyTotal();
  const salaryTotal = getTypeTotal('salary');
  const bonusTotal = getTypeTotal('bonus');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header
        title="Income"
        description="月給・賞与の履歴を管理し、将来の収入を予測します"
      />

      <div className="p-6 space-y-6">

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              今月の収入合計
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
                notation: 'compact',
              }).format(monthlyTotal)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              今月の給与
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
                notation: 'compact',
              }).format(salaryTotal)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              今月の賞与
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
                notation: 'compact',
              }).format(bonusTotal)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>収入履歴</CardTitle>
          <Button onClick={handleCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            追加
          </Button>
        </CardHeader>
        <CardContent>
          <IncomeList
            incomes={incomes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <IncomeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={editingIncome}
        mode={formMode}
      />
      </div>
    </div>
  );
}
