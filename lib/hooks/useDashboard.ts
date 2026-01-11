'use client';

import { useState, useEffect } from 'react';
import { SnapshotService } from '@/lib/services/snapshot.service';
import { KPICalculator } from '@/lib/utils/kpi';
import type { KPIData, DailySnapshot } from '@/types';
import { subDays, format } from 'date-fns';

export function useDashboard() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [snapshots, setSnapshots] = useState<DailySnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // スナップショット自動生成
      await SnapshotService.checkAndGenerateSnapshot();

      // KPI計算
      const kpiData = await KPICalculator.calculateKPIs();
      setKpis(kpiData);

      // 直近30日のスナップショット取得
      const endDate = format(new Date(), 'yyyy-MM-dd');
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const snapshotData = await SnapshotService.getSnapshotsByDateRange(
        startDate,
        endDate
      );
      setSnapshots(snapshotData);

      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    kpis,
    snapshots,
    loading,
    error,
    refresh: fetchDashboardData,
  };
}
