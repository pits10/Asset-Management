"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { MonthlyState } from "@/types";

interface OverviewChartProps {
  data: MonthlyState[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  const chartData = data.map((state) => ({
    month: state.month,
    value: state.netWorth,
  }));

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--accent-growth))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
