"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCompactCurrency } from "@/lib/utils/projection";
import type { ProjectionPoint } from "@/lib/utils/projection";

interface TrajectoryChartProps {
  data: ProjectionPoint[];
}

export function TrajectoryChart({ data }: TrajectoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <XAxis
          dataKey="year"
          stroke="hsl(var(--foreground-muted))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}y`}
        />
        <YAxis
          stroke="hsl(var(--foreground-muted))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCompactCurrency(value)}
          width={60}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;
            const data = payload[0].payload as ProjectionPoint;
            return (
              <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                <p className="text-xs text-foreground-secondary mb-1">
                  Year {data.year}
                </p>
                <p className="text-sm font-medium text-foreground numeric">
                  {formatCompactCurrency(data.totalValue)}
                </p>
              </div>
            );
          }}
          cursor={{
            stroke: "hsl(var(--accent-growth))",
            strokeWidth: 1,
            strokeDasharray: "4 4",
          }}
        />
        <Line
          type="monotone"
          dataKey="totalValue"
          stroke="hsl(var(--accent-growth))"
          strokeWidth={2.5}
          dot={false}
          activeDot={{
            r: 5,
            fill: "hsl(var(--accent-growth))",
            stroke: "hsl(var(--background))",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
