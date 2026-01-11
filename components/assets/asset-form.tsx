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
import type { Asset, AssetCategory } from '@/types';
import { AssetCategoryLabels, FinancialInstitutions } from '@/types';

// カテゴリ別のバリデーションスキーマ
const depositSchema = z.object({
  category: z.literal('deposit'),
  financialInstitution: z.string().optional(),
  accountName: z.string().optional(),
  balance: z.number().positive('残高は正の数で入力してください'),
});

const stockSchema = z.object({
  category: z.literal('stock'),
  market: z.enum(['japan', 'us', 'other']).optional(),
  ticker: z.string().optional(),
  stockName: z.string().optional(),
  shares: z.number().positive('保有株数は正の数で入力してください'),
  averagePrice: z.number().positive('平均取得単価は正の数で入力してください'),
  currentValue: z.number().optional(),
  currency: z.enum(['JPY', 'USD']),
});

const fundSchema = z.object({
  category: z.literal('fund'),
  fundType: z.enum(['mutualFund', 'etf']).optional(),
  fundName: z.string().min(1, '商品名を入力してください'),
  quantity: z.number().positive('保有数量は正の数で入力してください'),
  averagePrice: z.number().optional(),
  currentValue: z.number().optional(),
});

const cryptoSchema = z.object({
  category: z.literal('crypto'),
  cryptoCurrency: z.string().optional(),
  quantity: z.number().positive('保有数量は正の数で入力してください'),
  averagePrice: z.number().optional(),
  currentValue: z.number().optional(),
  exchange: z.string().optional(),
});

const employeeStockSchema = z.object({
  category: z.literal('employeeStock'),
  employeeStockType: z.enum(['espp', 'rsu', 'stockOption']).optional(),
  companyName: z.string().min(1, '会社名を入力してください'),
  ticker: z.string().optional(),
  sharesOrRights: z.number().positive('保有株数 or 権利数は正の数で入力してください'),
  averagePriceOrStrikePrice: z.number().positive('平均取得単価 or 行使価格は正の数で入力してください'),
  currentValue: z.number().optional(),
  esppDiscountRate: z.number().optional(),
  esppCompanyContribution: z.number().optional(),
});

const assetFormSchema = z.discriminatedUnion('category', [
  depositSchema,
  stockSchema,
  fundSchema,
  cryptoSchema,
  employeeStockSchema,
]);

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
  const getDefaultValues = (): AssetFormData => {
    if (initialData) {
      return initialData as AssetFormData;
    }

    // 新規作成時のデフォルト値
    return {
      category: 'deposit',
      balance: 0,
    } as unknown as AssetFormData;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    watch,
    reset,
    setValue,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  const category = watch('category');

  const onSubmitForm = async (data: AssetFormData) => {
    try {
      await onSubmit(data as Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit asset:', error);
    }
  };

  // カテゴリ変更時にフォームをリセット
  const handleCategoryChange = (newCategory: AssetCategory) => {
    switch (newCategory) {
      case 'deposit':
        reset({ category: 'deposit', balance: 0 });
        break;
      case 'stock':
        reset({ category: 'stock', shares: 0, averagePrice: 0, currency: 'JPY' } as unknown as AssetFormData);
        break;
      case 'fund':
        reset({ category: 'fund', fundName: '', quantity: 0 } as unknown as AssetFormData);
        break;
      case 'crypto':
        reset({ category: 'crypto', quantity: 0 } as unknown as AssetFormData);
        break;
      case 'employeeStock':
        reset({ category: 'employeeStock', companyName: '', sharesOrRights: 0, averagePriceOrStrikePrice: 0 } as unknown as AssetFormData);
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '資産を追加' : '資産を編集'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* カテゴリ選択 */}
          <div className="space-y-2">
            <Label htmlFor="category">カテゴリ *</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCategoryChange(value as AssetCategory);
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
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* 現金・預金 */}
          {category === 'deposit' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="financialInstitution">金融機関</Label>
                <Controller
                  name="financialInstitution"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {FinancialInstitutions.map((inst) => (
                          <SelectItem key={inst} value={inst}>
                            {inst}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">口座名</Label>
                <Input
                  id="accountName"
                  placeholder="例: 普通預金"
                  {...register('accountName')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">残高 (円) *</Label>
                <Input
                  id="balance"
                  type="number"
                  inputMode="numeric"
                  placeholder="1000000"
                  {...register('balance', { valueAsNumber: true })}
                />
                {'balance' in errors && errors.balance && (
                  <p className="text-sm text-red-500">{errors.balance.message}</p>
                )}
              </div>
            </>
          )}

          {/* 株式 */}
          {category === 'stock' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="market">市場</Label>
                <Controller
                  name="market"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={(value) => {
                      field.onChange(value);
                      // 市場に応じて通貨を自動設定
                      if (value === 'japan') {
                        setValue('currency', 'JPY');
                      } else if (value === 'us') {
                        setValue('currency', 'USD');
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="japan">日本株</SelectItem>
                        <SelectItem value="us">米国株</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticker">ティッカー</Label>
                  <Input
                    id="ticker"
                    placeholder="例: AAPL"
                    {...register('ticker')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockName">銘柄名</Label>
                  <Input
                    id="stockName"
                    placeholder="例: Apple"
                    {...register('stockName')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shares">保有株数 *</Label>
                  <Input
                    id="shares"
                    type="number"
                    inputMode="numeric"
                    placeholder="100"
                    {...register('shares', { valueAsNumber: true })}
                  />
                  {'shares' in errors && errors.shares && (
                    <p className="text-sm text-red-500">{errors.shares.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">通貨 *</Label>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JPY">JPY (円)</SelectItem>
                          <SelectItem value="USD">USD (ドル)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="averagePrice">平均取得単価 *</Label>
                  <Input
                    id="averagePrice"
                    type="number"
                    inputMode="decimal"
                    placeholder="150.50"
                    step="0.01"
                    {...register('averagePrice', { valueAsNumber: true })}
                  />
                  {'averagePrice' in errors && errors.averagePrice && (
                    <p className="text-sm text-red-500">{errors.averagePrice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentValue">現在評価額</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    inputMode="numeric"
                    placeholder="15000"
                    {...register('currentValue', { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">
                    未入力時は保有株数×平均取得単価で計算
                  </p>
                </div>
              </div>
            </>
          )}

          {/* 投資信託 / ETF */}
          {category === 'fund' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fundType">種類</Label>
                <Controller
                  name="fundType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mutualFund">投資信託</SelectItem>
                        <SelectItem value="etf">ETF</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundName">商品名 *</Label>
                <Input
                  id="fundName"
                  placeholder="例: eMAXIS Slim 全世界株式"
                  {...register('fundName')}
                />
                {'fundName' in errors && errors.fundName && (
                  <p className="text-sm text-red-500">{errors.fundName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">保有数量 *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    inputMode="decimal"
                    placeholder="1000.5"
                    step="0.01"
                    {...register('quantity', { valueAsNumber: true })}
                  />
                  {'quantity' in errors && errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averagePrice">平均取得単価</Label>
                  <Input
                    id="averagePrice"
                    type="number"
                    inputMode="decimal"
                    placeholder="10000"
                    step="0.01"
                    {...register('averagePrice', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentValue">現在評価額</Label>
                <Input
                  id="currentValue"
                  type="number"
                  inputMode="numeric"
                  placeholder="1000000"
                  {...register('currentValue', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  未入力時は保有数量×平均取得単価で計算
                </p>
              </div>
            </>
          )}

          {/* 暗号資産 */}
          {category === 'crypto' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cryptoCurrency">通貨</Label>
                  <Input
                    id="cryptoCurrency"
                    placeholder="例: BTC, ETH, SOL"
                    {...register('cryptoCurrency')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exchange">取引所</Label>
                  <Input
                    id="exchange"
                    placeholder="例: Coinbase"
                    {...register('exchange')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">保有数量 *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    inputMode="decimal"
                    placeholder="0.5"
                    step="0.00000001"
                    {...register('quantity', { valueAsNumber: true })}
                  />
                  {'quantity' in errors && errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averagePrice">平均取得単価</Label>
                  <Input
                    id="averagePrice"
                    type="number"
                    inputMode="decimal"
                    placeholder="5000000"
                    step="0.01"
                    {...register('averagePrice', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentValue">現在評価額</Label>
                <Input
                  id="currentValue"
                  type="number"
                  inputMode="numeric"
                  placeholder="2500000"
                  {...register('currentValue', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  未入力時は保有数量×平均取得単価で計算
                </p>
              </div>
            </>
          )}

          {/* 持ち株 */}
          {category === 'employeeStock' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="employeeStockType">種別</Label>
                <Controller
                  name="employeeStockType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="espp">ESPP (従業員株式購入制度)</SelectItem>
                        <SelectItem value="rsu">RSU (制限付株式ユニット)</SelectItem>
                        <SelectItem value="stockOption">ストックオプション</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">会社名 *</Label>
                  <Input
                    id="companyName"
                    placeholder="例: Google"
                    {...register('companyName')}
                  />
                  {'companyName' in errors && errors.companyName && (
                    <p className="text-sm text-red-500">{errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticker">ティッカー</Label>
                  <Input
                    id="ticker"
                    placeholder="例: GOOGL"
                    {...register('ticker')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sharesOrRights">保有株数 / 権利数 *</Label>
                  <Input
                    id="sharesOrRights"
                    type="number"
                    inputMode="numeric"
                    placeholder="100"
                    {...register('sharesOrRights', { valueAsNumber: true })}
                  />
                  {'sharesOrRights' in errors && errors.sharesOrRights && (
                    <p className="text-sm text-red-500">{errors.sharesOrRights.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averagePriceOrStrikePrice">取得単価 / 行使価格 *</Label>
                  <Input
                    id="averagePriceOrStrikePrice"
                    type="number"
                    inputMode="decimal"
                    placeholder="100.00"
                    step="0.01"
                    {...register('averagePriceOrStrikePrice', { valueAsNumber: true })}
                  />
                  {'averagePriceOrStrikePrice' in errors && errors.averagePriceOrStrikePrice && (
                    <p className="text-sm text-red-500">{errors.averagePriceOrStrikePrice.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentValue">現在評価額</Label>
                <Input
                  id="currentValue"
                  type="number"
                  inputMode="numeric"
                  placeholder="10000"
                  {...register('currentValue', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  未入力時は株数×取得単価で計算
                </p>
              </div>

              {watch('employeeStockType') === 'espp' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="esppDiscountRate">ESPP割引率 (%)</Label>
                    <Input
                      id="esppDiscountRate"
                      type="number"
                      inputMode="decimal"
                      placeholder="15"
                      step="0.1"
                      {...register('esppDiscountRate', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="esppCompanyContribution">会社補助額</Label>
                    <Input
                      id="esppCompanyContribution"
                      type="number"
                      inputMode="numeric"
                      placeholder="5000"
                      {...register('esppCompanyContribution', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}
            </>
          )}

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
