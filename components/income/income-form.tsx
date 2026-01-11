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
import type { Income, IncomeType } from '@/types';

const incomeFormSchema = z.object({
  type: z.enum(['salary', 'bonus', 'other']),
  source: z.string().min(1, '収入源を入力してください'),
  amount: z.number().positive('金額は正の数で入力してください'),
  date: z.date(),
});

type IncomeFormData = z.infer<typeof incomeFormSchema>;

interface IncomeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Income, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Income;
  mode: 'create' | 'edit';
}

const incomeTypeLabels: Record<IncomeType, string> = {
  salary: '給与',
  bonus: '賞与',
  other: 'その他',
};

export function IncomeForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: IncomeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: initialData
      ? {
          type: initialData.type,
          source: initialData.source,
          amount: initialData.amount,
          date: new Date(initialData.date),
        }
      : {
          type: 'salary',
          source: '',
          amount: 0,
          date: new Date(),
        },
    mode: 'onChange',
  });

  const onSubmitForm = async (data: IncomeFormData) => {
    try {
      await onSubmit({
        type: data.type,
        source: data.source,
        amount: data.amount,
        date: data.date,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit income:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '収入を追加' : '収入を編集'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">種類 *</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="種類を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(incomeTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">収入源 *</Label>
            <Input
              id="source"
              placeholder="例: 会社名、副業名"
              {...register('source')}
            />
            {errors.source && (
              <p className="text-sm text-red-500">{errors.source.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">金額 (円) *</Label>
            <Input
              id="amount"
              type="number"
              inputMode="numeric"
              placeholder="300000"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">日付 *</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Input
                  id="date"
                  type="date"
                  value={field.value.toISOString().split('T')[0]}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              )}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
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
