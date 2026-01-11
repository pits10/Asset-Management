'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssetCategoryLabels, FinancialInstitutions, EquityCompTypes } from '@/types';
import type { Asset, AssetCategory } from '@/types';

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Asset;
}

export function AssetFormDialog({ open, onOpenChange, onSubmit, initialData }: AssetFormDialogProps) {
  const [category, setCategory] = useState<AssetCategory>('deposit');
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setFormData(initialData as Record<string, string | number>);
    } else {
      setCategory('deposit');
      setFormData({});
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;

      if (category === 'deposit') {
        assetData = {
          category: 'deposit',
          balance: Number(formData.balance) || 0,
          financialInstitution: formData.financialInstitution as string,
          accountName: formData.accountName as string,
        };
      } else if (category === 'stock') {
        assetData = {
          category: 'stock',
          shares: Number(formData.shares) || 0,
          averagePrice: Number(formData.averagePrice) || 0,
          currentValue: formData.currentValue ? Number(formData.currentValue) : undefined,
          ticker: formData.ticker as string,
          stockName: formData.stockName as string,
          market: (formData.market as 'japan' | 'us' | 'other') || 'other',
          currency: (formData.currency as 'JPY' | 'USD') || 'JPY',
        };
      } else if (category === 'fund') {
        assetData = {
          category: 'fund',
          fundName: (formData.fundName as string) || '',
          quantity: Number(formData.quantity) || 0,
          averagePrice: formData.averagePrice ? Number(formData.averagePrice) : undefined,
          currentValue: formData.currentValue ? Number(formData.currentValue) : undefined,
          fundType: (formData.fundType as 'mutualFund' | 'etf') || undefined,
        };
      } else if (category === 'crypto') {
        assetData = {
          category: 'crypto',
          quantity: Number(formData.quantity) || 0,
          cryptoCurrency: formData.cryptoCurrency as string,
          averagePrice: formData.averagePrice ? Number(formData.averagePrice) : undefined,
          currentValue: formData.currentValue ? Number(formData.currentValue) : undefined,
          exchange: formData.exchange as string,
        };
      } else {
        // employeeStock
        assetData = {
          category: 'employeeStock',
          companyName: (formData.companyName as string) || '',
          sharesOrRights: Number(formData.sharesOrRights) || 0,
          averagePriceOrStrikePrice: Number(formData.averagePriceOrStrikePrice) || 0,
          currentValue: formData.currentValue ? Number(formData.currentValue) : undefined,
          employeeStockType: formData.employeeStockType as 'espp' | 'rsu' | 'stockOption',
          ticker: formData.ticker as string,
          esppDiscountRate: formData.esppDiscountRate ? Number(formData.esppDiscountRate) : undefined,
          esppCompanyContribution: formData.esppCompanyContribution ? Number(formData.esppCompanyContribution) : undefined,
        };
      }

      await onSubmit(assetData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save asset:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData({});
    setCategory('deposit');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Asset' : 'Add Asset'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update your asset details' : 'Add a new asset to your portfolio'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Asset Category Selector */}
          {!initialData && (
            <div className="space-y-2">
              <Label>Asset Class</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as AssetCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AssetCategoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dynamic Form Fields based on Category */}
          {category === 'deposit' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="financialInstitution">Bank / Institution</Label>
                <Select
                  value={(formData.financialInstitution as string) || ''}
                  onValueChange={(value) => updateField('financialInstitution', value)}
                >
                  <SelectTrigger id="financialInstitution">
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {FinancialInstitutions.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name (Optional)</Label>
                <Input
                  id="accountName"
                  value={(formData.accountName as string) || ''}
                  onChange={(e) => updateField('accountName', e.target.value)}
                  placeholder="e.g., Savings Account"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Balance *</Label>
                <Input
                  id="balance"
                  type="number"
                  value={formData.balance || ''}
                  onChange={(e) => updateField('balance', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  required
                />
              </div>
            </>
          )}

          {category === 'stock' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="stockName">Stock Name (Optional)</Label>
                <Input
                  id="stockName"
                  value={(formData.stockName as string) || ''}
                  onChange={(e) => updateField('stockName', e.target.value)}
                  placeholder="e.g., Apple Inc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticker">Ticker (Optional)</Label>
                <Input
                  id="ticker"
                  value={(formData.ticker as string) || ''}
                  onChange={(e) => updateField('ticker', e.target.value)}
                  placeholder="e.g., AAPL"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="shares">Shares *</Label>
                  <Input
                    id="shares"
                    type="number"
                    step="0.01"
                    value={formData.shares || ''}
                    onChange={(e) => updateField('shares', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averagePrice">Avg Cost *</Label>
                  <Input
                    id="averagePrice"
                    type="number"
                    step="0.01"
                    value={formData.averagePrice || ''}
                    onChange={(e) => updateField('averagePrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentValue">Current Value (Optional)</Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue || ''}
                  onChange={(e) => updateField('currentValue', parseFloat(e.target.value) || '')}
                  placeholder="Leave empty for auto-calculation"
                />
                <p className="text-xs text-foreground-muted">
                  If empty, calculated as shares × avg cost
                </p>
              </div>
            </>
          )}

          {category === 'fund' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fundName">Fund Name *</Label>
                <Input
                  id="fundName"
                  value={(formData.fundName as string) || ''}
                  onChange={(e) => updateField('fundName', e.target.value)}
                  placeholder="e.g., Vanguard S&P 500 ETF"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticker">Ticker (Optional)</Label>
                <Input
                  id="ticker"
                  value={(formData.ticker as string) || ''}
                  onChange={(e) => updateField('ticker', e.target.value)}
                  placeholder="e.g., VOO"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Units *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={formData.quantity || ''}
                    onChange={(e) => updateField('quantity', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averagePrice">Avg Cost</Label>
                  <Input
                    id="averagePrice"
                    type="number"
                    step="0.01"
                    value={formData.averagePrice || ''}
                    onChange={(e) => updateField('averagePrice', parseFloat(e.target.value) || '')}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentValue">Current Value</Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue || ''}
                  onChange={(e) => updateField('currentValue', parseFloat(e.target.value) || '')}
                  placeholder="Total current value"
                />
              </div>
            </>
          )}

          {category === 'crypto' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cryptoCurrency">Cryptocurrency (Optional)</Label>
                <Input
                  id="cryptoCurrency"
                  value={(formData.cryptoCurrency as string) || ''}
                  onChange={(e) => updateField('cryptoCurrency', e.target.value)}
                  placeholder="e.g., Bitcoin, Ethereum"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Amount *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.00000001"
                    value={formData.quantity || ''}
                    onChange={(e) => updateField('quantity', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averagePrice">Avg Cost</Label>
                  <Input
                    id="averagePrice"
                    type="number"
                    step="0.01"
                    value={formData.averagePrice || ''}
                    onChange={(e) => updateField('averagePrice', parseFloat(e.target.value) || '')}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentValue">Current Value</Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue || ''}
                  onChange={(e) => updateField('currentValue', parseFloat(e.target.value) || '')}
                  placeholder="Total current value"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exchange">Exchange (Optional)</Label>
                <Input
                  id="exchange"
                  value={(formData.exchange as string) || ''}
                  onChange={(e) => updateField('exchange', e.target.value)}
                  placeholder="e.g., Coinbase, Binance"
                />
              </div>
            </>
          )}

          {category === 'employeeStock' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="employeeStockType">Plan Type *</Label>
                <Select
                  value={(formData.employeeStockType as string) || ''}
                  onValueChange={(value) => updateField('employeeStockType', value)}
                >
                  <SelectTrigger id="employeeStockType">
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EquityCompTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase().replace(' ', '')}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={(formData.companyName as string) || ''}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  placeholder="e.g., Google"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="sharesOrRights">Units *</Label>
                  <Input
                    id="sharesOrRights"
                    type="number"
                    value={formData.sharesOrRights || ''}
                    onChange={(e) => updateField('sharesOrRights', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averagePriceOrStrikePrice">Grant Price *</Label>
                  <Input
                    id="averagePriceOrStrikePrice"
                    type="number"
                    step="0.01"
                    value={formData.averagePriceOrStrikePrice || ''}
                    onChange={(e) => updateField('averagePriceOrStrikePrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentValue">Current Value (Optional)</Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue || ''}
                  onChange={(e) => updateField('currentValue', parseFloat(e.target.value) || '')}
                  placeholder="Leave empty for auto-calculation"
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : initialData ? 'Update' : 'Add Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
