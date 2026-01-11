'use client';

import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DailySnapshot } from '@/types';

interface MonthlyCalendarProps {
  snapshots: DailySnapshot[];
}

export function MonthlyCalendar({ snapshots }: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getSnapshotForDate = (date: Date) => {
    return snapshots.find((snapshot) =>
      isSameDay(parseISO(snapshot.date), date)
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      notation: 'compact',
    }).format(amount);
  };

  const getDayColor = (change: number) => {
    if (change > 0) return 'bg-green-500/20 text-green-500 border-green-500/30';
    if (change < 0) return 'bg-red-500/20 text-red-500 border-red-500/30';
    return 'bg-muted text-muted-foreground border-border';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // 月間合計計算
  const monthlyTotal = snapshots
    .filter((snapshot) => {
      const snapshotDate = parseISO(snapshot.date);
      return (
        snapshotDate >= monthStart && snapshotDate <= monthEnd
      );
    })
    .reduce((sum, snapshot) => sum + snapshot.dailyChange, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {format(currentMonth, 'yyyy年 M月')}
          </h3>
          <p className="text-sm text-muted-foreground">
            月間純資産増減: {formatCurrency(monthlyTotal)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day) => {
          const snapshot = getSnapshotForDate(day);
          const isCurrentMonth =
            day >= monthStart && day <= monthEnd;
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`
                relative border rounded-lg p-2 min-h-[80px]
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${isToday ? 'ring-2 ring-primary' : ''}
                ${snapshot ? getDayColor(snapshot.dailyChange) : 'bg-background'}
              `}
            >
              <div className="text-sm font-medium">
                {format(day, 'd')}
              </div>
              {snapshot && (
                <div className="mt-1 space-y-1">
                  <div className="text-xs font-mono">
                    {snapshot.dailyChange >= 0 ? '+' : ''}
                    {formatCurrency(snapshot.dailyChange)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
