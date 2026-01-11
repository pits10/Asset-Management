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
import type { Asset, AssetCategory } from '@/types';

const assetFormSchema = z.object({
  category: z.enum(['cash', 'investment', 'realEstate', 'other']),
  name: z.string().min(1, '資産名を入力してください'),
  amount: z.number().min(0, '金額は0以上で入力してください'),
  ticker: z.string().optional(),
});

type AssetFormData = z.infer<typeof assetFormSchema>;

interface AssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Asset;
  mode: 'create' | 'edit';
}

const categoryLabels: Record<AssetCategory, string> = {
  cash: '現金・預金',
  investment: '投資',
  realEstate: '不動産',
  other: 'その他',
};

export function AssetForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: AssetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: initialData
      ? {
          category: initialData.category,
          name: initialData.name,
          amount: initialData.amount,
          ticker: initialData.ticker || '',
        }
      : {
          category: 'cash',
          name: '',
          amount: 0,
          ticker: '',
        },
  });

  const category = watch('category');

  const onSubmitForm = async (data: AssetFormData) => {
    try {
      await onSubmit({
        category: data.category,
        name: data.name,
        amount: data.amount,
        ticker: data.ticker || undefined,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit asset:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '資産を追加' : '資産を編集'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">カテゴリ</Label>
            <Select
              value={category}
              onValueChange={(value) =>
                setValue('category', value as AssetCategory)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">資産名</Label>
            <Input
              id="name"
              placeholder="例: 三菱UFJ普通預金"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
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

          {category === 'investment' && (
            <div className="space-y-2">
              <Label htmlFor="ticker">ティッカーシンボル (任意)</Label>
              <Input
                id="ticker"
                placeholder="例: AAPL"
                {...register('ticker')}
              />
              <p className="text-xs text-muted-foreground">
                株式の場合、ティッカーを入力すると自動で株価を取得します
              </p>
            </div>
          )}

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
