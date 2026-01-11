'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { ForecastChart } from '@/components/forecast/forecast-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAssets } from '@/lib/hooks/useAssets';
import { usePlans } from '@/lib/hooks/usePlans';
import { calculateForecast, calculateWeightedAverageReturn } from '@/lib/utils/forecast';
import type { ForecastDataPoint } from '@/lib/utils/forecast';

export default function ForecastPage() {
  const { getTotalAssets } = useAssets();
  const { plans, getTotalMonthlyAmount } = usePlans();

  const [years, setYears] = useState(10);
  const [annualReturnRate, setAnnualReturnRate] = useState(5.0);
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);

  const currentAssets = getTotalAssets();
  const monthlyContribution = getTotalMonthlyAmount();
  const weightedReturn = calculateWeightedAverageReturn(plans);

  useEffect(() => {
    const data = calculateForecast(
      currentAssets,
      monthlyContribution,
      annualReturnRate,
      years
    );
    setForecastData(data);
  }, [currentAssets, monthlyContribution, annualReturnRate, years]);

  const finalAssets = forecastData[forecastData.length - 1]?.totalAssets || 0;
  const totalContributions = monthlyContribution * 12 * years;
  const totalGains = finalAssets - currentAssets - totalContributions;

  return (
    <div className="flex-1">
      <Header
        title="Forecast"
        description="将来の資産推移を予測します（外部データなし、手入力リターン）"
      />

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                現在の総資産
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('ja-JP', {
                  style: 'currency',
                  currency: 'JPY',
                  notation: 'compact',
                }).format(currentAssets)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                月間積立額
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat('ja-JP', {
                  style: 'currency',
                  currency: 'JPY',
                  notation: 'compact',
                }).format(monthlyContribution)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {years}年後の予測資産
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('ja-JP', {
                  style: 'currency',
                  currency: 'JPY',
                  notation: 'compact',
                }).format(finalAssets)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                予測運用益
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('ja-JP', {
                  style: 'currency',
                  currency: 'JPY',
                  notation: 'compact',
                }).format(totalGains)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>予測パラメータ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="years">予測期間（年）</Label>
                <Input
                  id="years"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="50"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnRate">期待リターン（年率%）</Label>
                <Input
                  id="returnRate"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={annualReturnRate}
                  onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  プラン別加重平均: {weightedReturn.toFixed(2)}%
                  （参考値、手動で調整可能）
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
              <p className="font-medium">予測の前提条件：</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>毎月定額の積立を継続</li>
                <li>指定した年率リターンで複利運用</li>
                <li>外部データは使用せず、すべて手入力値を使用</li>
                <li>税金・手数料は考慮していません</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>将来資産推移予測</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastChart data={forecastData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
