'use client';

interface SavingsRateGaugeProps {
  rate: number; // 0-100の範囲
}

export function SavingsRateGauge({ rate }: SavingsRateGaugeProps) {
  // 0-100を0-180度に変換（半円ゲージ）
  const angle = Math.min(Math.max(rate, 0), 100) * 1.8;
  const color = rate >= 30 ? '#22c55e' : rate >= 15 ? '#eab308' : '#ef4444';

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      {/* SVG Gauge */}
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${angle * 2.22} 1000`}
          style={{
            transition: 'stroke-dasharray 0.5s ease-in-out',
          }}
        />
        {/* Center text */}
        <text
          x="100"
          y="85"
          textAnchor="middle"
          className="text-3xl font-bold fill-current"
          style={{ fill: 'hsl(var(--foreground))' }}
        >
          {rate.toFixed(1)}%
        </text>
      </svg>

      {/* Labels */}
      <div className="flex justify-between w-[180px] text-xs text-muted-foreground mt-2">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
