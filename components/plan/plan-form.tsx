'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InvestmentPlan, AssetCategory } from '@/types';
import { AssetCategoryLabels } from '@/types';

const planFormSchema = z.object({
  assetCategory: z.enum(['deposit', 'stock', 'fund', 'crypto', 'employeeStock']),
  categoryName: z.string(),
  monthlyAmount: z.number().nonnegative('積立額は0以上で入力してください'),
  expectedReturn: z.number().optional(),
});

type PlanFormData = z.infer<typeof planFormSchema>;

interface PlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<InvestmentPlan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: InvestmentPlan;
  mode: 'create' | 'edit';
}

export function PlanForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: PlanFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
    
    setValue,
  } = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: initialData
      ? {
          assetCategory: initialData.assetCategory,
          categoryName: initialData.categoryName,
          monthlyAmount: initialData.monthlyAmount,
          expectedReturn: initialData.expectedReturn,
        }
      : {
          assetCategory: 'deposit',
          categoryName: AssetCategoryLabels['deposit'],
          monthlyAmount: 0,
          expectedReturn: 0,
        },
    mode: 'onChange',
  });


  const onSubmitForm = async (data: PlanFormData) => {
    try {
      await onSubmit({
        assetCategory: data.assetCategory,
        categoryName: data.categoryName,
        monthlyAmount: data.monthlyAmount,
        expectedReturn: data.expectedReturn,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit plan:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '積立プランを追加' : '積立プランを編集'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assetCategory">資産カテゴリ *</Label>
            <Controller
              name="assetCategory"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue('categoryName', AssetCategoryLabels[value as AssetCategory]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(AssetCategoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assetCategory && (
              <p className="text-sm text-red-500">{errors.assetCategory.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyAmount">毎月の積立額 (円) *</Label>
            <Input
              id="monthlyAmount"
              type="number"
              inputMode="numeric"
              placeholder="50000"
              {...register('monthlyAmount', { valueAsNumber: true })}
            />
            {errors.monthlyAmount && (
              <p className="text-sm text-red-500">{errors.monthlyAmount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedReturn">期待リターン (年率 %) - 任意</Label>
            <Input
              id="expectedReturn"
              type="number"
              inputMode="decimal"
              placeholder="5.0"
              step="0.1"
              {...register('expectedReturn', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              将来予測に使用されます（手入力）
            </p>
            {errors.expectedReturn && (
              <p className="text-sm text-red-500">{errors.expectedReturn.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
