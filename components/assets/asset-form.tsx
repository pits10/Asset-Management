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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Asset, DepositAsset } from '@/types';

// TODO: Phase 2で詳細なカテゴリ別フォームに置き換える
// 現在は暫定的にdeposit（現金・預金）のみサポート
const assetFormSchema = z.object({
  category: z.literal('deposit'),
  balance: z.number().min(0, '残高は0以上で入力してください'),
  accountName: z.string().optional(),
  financialInstitution: z.string().optional(),
});

type AssetFormData = z.infer<typeof assetFormSchema>;

interface AssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Asset;
  mode: 'create' | 'edit';
}

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
    reset,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues:
      initialData && initialData.category === 'deposit'
        ? {
            category: 'deposit' as const,
            balance: initialData.balance,
            accountName: initialData.accountName || '',
            financialInstitution: initialData.financialInstitution || '',
          }
        : {
            category: 'deposit' as const,
            balance: 0,
            accountName: '',
            financialInstitution: '',
          },
  });

  const onSubmitForm = async (data: AssetFormData) => {
    try {
      const assetData: Omit<DepositAsset, 'id' | 'createdAt' | 'updatedAt'> = {
        category: 'deposit',
        balance: data.balance,
        accountName: data.accountName || undefined,
        financialInstitution: data.financialInstitution || undefined,
      };

      await onSubmit(assetData);
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
            {mode === 'create' ? '資産を追加（現金・預金）' : '資産を編集'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="financialInstitution">金融機関（任意）</Label>
            <Input
              id="financialInstitution"
              placeholder="例: 三菱UFJ"
              {...register('financialInstitution')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">口座名（任意）</Label>
            <Input
              id="accountName"
              placeholder="例: 普通預金"
              {...register('accountName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">残高 (円)</Label>
            <Input
              id="balance"
              type="number"
              placeholder="0"
              {...register('balance', { valueAsNumber: true })}
            />
            {errors.balance && (
              <p className="text-sm text-red-500">{errors.balance.message}</p>
            )}
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
