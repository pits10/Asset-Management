'use client';

import { useForm } from 'react-hook-form';
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
import type { Expense, ExpenseType, ExpenseCategory } from '@/types';

const expenseFormSchema = z.object({
  type: z.enum(['fixed', 'variable']),
  category: z.enum([
    'housing',
    'utilities',
    'telecom',
    'subscription',
    'insurance',
    'food',
    'transport',
    'entertainment',
    'clothing',
    'other',
  ]),
  amount: z.number().min(0, '金額は0以上で入力してください'),
  date: z.string().min(1, '日付を入力してください'),
  memo: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Expense;
  mode: 'create' | 'edit';
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

const fixedCategories: ExpenseCategory[] = [
  'housing',
  'utilities',
  'telecom',
  'subscription',
  'insurance',
];

const variableCategories: ExpenseCategory[] = [
  'food',
  'transport',
  'entertainment',
  'clothing',
  'other',
];

export function ExpenseForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: initialData
      ? {
          type: initialData.type,
          category: initialData.category,
          amount: initialData.amount,
          date: new Date(initialData.date).toISOString().split('T')[0],
          memo: initialData.memo || '',
        }
      : {
          type: 'variable',
          category: 'food',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          memo: '',
        },
  });

  const expenseType = watch('type');
  const category = watch('category');

  const onSubmitForm = async (data: ExpenseFormData) => {
    try {
      await onSubmit({
        type: data.type,
        category: data.category,
        amount: data.amount,
        date: new Date(data.date),
        memo: data.memo || undefined,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit expense:', error);
    }
  };

  const availableCategories =
    expenseType === 'fixed' ? fixedCategories : variableCategories;

  // カテゴリがタイプに合わなくなったら自動調整
  if (!availableCategories.includes(category)) {
    setValue('category', availableCategories[0]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '支出を追加' : '支出を編集'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">タイプ</Label>
            <Select
              value={expenseType}
              onValueChange={(value) => setValue('type', value as ExpenseType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="タイプを選択" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">カテゴリ</Label>
            <Select
              value={category}
              onValueChange={(value) =>
                setValue('category', value as ExpenseCategory)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">金額 (円)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">日付</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">メモ (任意)</Label>
            <Input id="memo" placeholder="備考" {...register('memo')} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
