'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { PlanForm } from '@/components/plan/plan-form';
import { PlanList } from '@/components/plan/plan-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlans } from '@/lib/hooks/usePlans';
import type { InvestmentPlan } from '@/types';

export default function PlanPage() {
  const {
    plans,
    loading,
    createPlan,
    updatePlan,
    deletePlan,
    getTotalMonthlyAmount,
  } = usePlans();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const handleCreate = () => {
    setEditingPlan(undefined);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleEdit = (plan: InvestmentPlan) => {
    setEditingPlan(plan);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleSubmit = async (data: Omit<InvestmentPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (formMode === 'create') {
      await createPlan(data);
    } else if (editingPlan) {
      await updatePlan(editingPlan.id, data);
    }
  };

  const handleDelete = async (id: string) => {
    await deletePlan(id);
  };

  const totalMonthlyAmount = getTotalMonthlyAmount();
  const totalAnnualAmount = totalMonthlyAmount * 12;

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
        title="Plan"
        description="毎月の積立額を管理し、資産形成の計画を立てます"
      />

      <div className="p-6 space-y-6">

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              月間積立額合計
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
                notation: 'compact',
              }).format(totalMonthlyAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              全カテゴリの合計
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              年間積立額合計
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
                notation: 'compact',
              }).format(totalAnnualAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              月間 × 12ヶ月
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>積立プラン一覧</CardTitle>
          <Button onClick={handleCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            追加
          </Button>
        </CardHeader>
        <CardContent>
          <PlanList
            plans={plans}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <PlanForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={editingPlan}
        mode={formMode}
      />
      </div>
    </div>
  );
}
