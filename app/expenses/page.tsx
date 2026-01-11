'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { ExpenseList } from '@/components/expenses/expense-list';
import { ExpensePieChart } from '@/components/expenses/expense-pie-chart';
import type { Expense } from '@/types';

export default function ExpensesPage() {
  const {
    expenses,
    loading,
    createExpense,
    updateExpense,
    deleteExpense,
    getMonthlyTotal,
    getTypeTotal,
    getCategoryTotals,
  } = useExpenses();

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();

  const handleOpenForm = () => {
    setEditingExpense(undefined);
    setFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const handleSubmit = async (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
    } else {
      await createExpense(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const monthlyTotal = getMonthlyTotal();
  const fixedTotal = getTypeTotal('fixed');
  const variableTotal = getTypeTotal('variable');
  const categoryTotals = getCategoryTotals();

  return (
    <div className="min-h-screen bg-background">
      <Header title="Expenses" description="Track your fixed and variable expenses" />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Total
              </CardTitle>
              <Button onClick={handleOpenForm}>
                <Plus className="mr-2 h-4 w-4" />
                追加
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {formatCurrency(monthlyTotal)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                今月の総支出
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fixed Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {formatCurrency(fixedTotal)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                固定費
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Variable Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {formatCurrency(variableTotal)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                変動費
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensePieChart data={categoryTotals} />
          </CardContent>
        </Card>

        {/* Expense List */}
        <Card>
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">読み込み中...</p>
              </div>
            ) : (
              <ExpenseList
                expenses={expenses}
                onEdit={handleEditExpense}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense Form Modal */}
      <ExpenseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={editingExpense}
        mode={editingExpense ? 'edit' : 'create'}
      />
    </div>
  );
}
