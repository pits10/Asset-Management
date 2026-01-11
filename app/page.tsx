'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { KPICard } from '@/components/dashboard/kpi-card';
import { NetWorthChart } from '@/components/dashboard/net-worth-chart';
import { SavingsRateGauge } from '@/components/dashboard/savings-rate-gauge';
import { MonthlyCalendar } from '@/components/dashboard/monthly-calendar';
import { AssetDonutChart } from '@/components/assets/asset-donut-chart';

export default function DashboardPage() {
  const { kpis, snapshots, loading } = useDashboard();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  if (loading || !kpis) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Dashboard" description="Overview of your financial status" />
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  const getValueColor = (value: number): 'green' | 'red' | 'default' => {
    if (value > 0) return 'green';
    if (value < 0) return 'red';
    return 'default';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard" description="Overview of your financial status" />

      <div className="p-6 space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <KPICard
            title="純資産増減"
            value={formatCurrency(kpis.netWorthChange)}
            subtitle="期間開始時との差分"
            valueColor={getValueColor(kpis.netWorthChange)}
            helpText="登録開始時からの総資産の増減"
          />

          <KPICard
            title="月間収支"
            value={formatCurrency(kpis.monthlyBalance)}
            subtitle="今月の収入 - 支出"
            valueColor={getValueColor(kpis.monthlyBalance)}
            helpText="今月の収入から支出を引いた金額"
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                貯蓄率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SavingsRateGauge rate={kpis.savingsRate} />
            </CardContent>
          </Card>

          <KPICard
            title="流動性比率"
            value={`${kpis.liquidityRatio.toFixed(1)}%`}
            subtitle="現金・預金 ÷ 総資産"
            valueColor="blue"
            helpText="総資産のうち現金・預金が占める割合"
          />

          <KPICard
            title="月間総支出"
            value={formatCurrency(kpis.monthlyExpenses)}
            subtitle="今月の支出合計"
            valueColor="red"
            helpText="今月の固定費と変動費の合計"
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                資産構成比
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AssetDonutChart data={kpis.assetAllocation} />
            </CardContent>
          </Card>
        </div>

        {/* Net Worth Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>日次純資産推移</CardTitle>
          </CardHeader>
          <CardContent>
            <NetWorthChart snapshots={snapshots} />
          </CardContent>
        </Card>

        {/* Monthly Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>月次カレンダー</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyCalendar snapshots={snapshots} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
