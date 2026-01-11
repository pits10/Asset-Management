/**
 * Formatting utilities for currency, numbers, dates, and percentages
 */

export type Currency = 'JPY' | 'USD';

/**
 * Format currency with proper locale and symbol
 * Supports JPY and USD with no decimal places for whole numbers
 */
export function formatCurrency(
  amount: number,
  currency: Currency = 'JPY',
  compact: boolean = false
): string {
  if (compact) {
    return formatCompactCurrency(amount, currency);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format large numbers with K/M/B suffix
 */
export function formatCompactCurrency(amount: number, currency: Currency = 'JPY'): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  const symbol = currency === 'JPY' ? '¥' : '$';

  if (absAmount >= 1_000_000_000) {
    return `${sign}${symbol}${(absAmount / 1_000_000_000).toFixed(1)}B`;
  }
  if (absAmount >= 1_000_000) {
    return `${sign}${symbol}${(absAmount / 1_000_000).toFixed(1)}M`;
  }
  if (absAmount >= 1_000) {
    return `${sign}${symbol}${(absAmount / 1_000).toFixed(0)}K`;
  }
  return `${sign}${symbol}${absAmount.toFixed(0)}`;
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number with thousands separators
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Parse formatted currency string back to number
 * Removes currency symbols and commas
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[¥$,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date to YYYY-MM (for monthly entries)
 */
export function formatMonthISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Parse YYYY-MM string to Date object (first day of month)
 */
export function parseMonthISO(monthStr: string): Date {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * Get current month in YYYY-MM format
 */
export function getCurrentMonth(): string {
  return formatMonthISO(new Date());
}

/**
 * Get month display name (e.g., "January 2026")
 */
export function formatMonthDisplay(monthStr: string): string {
  const date = parseMonthISO(monthStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Get short month display (e.g., "Jan 2026")
 */
export function formatMonthShort(monthStr: string): string {
  const date = parseMonthISO(monthStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Calculate months between two YYYY-MM strings
 */
export function getMonthsDifference(start: string, end: string): number {
  const [startYear, startMonth] = start.split('-').map(Number);
  const [endYear, endMonth] = end.split('-').map(Number);
  return (endYear - startYear) * 12 + (endMonth - startMonth);
}

/**
 * Add months to a YYYY-MM string
 */
export function addMonths(monthStr: string, count: number): string {
  const date = parseMonthISO(monthStr);
  date.setMonth(date.getMonth() + count);
  return formatMonthISO(date);
}

/**
 * Get array of months between start and end (inclusive)
 */
export function getMonthRange(start: string, end: string): string[] {
  const months: string[] = [];
  let current = start;

  while (current <= end) {
    months.push(current);
    current = addMonths(current, 1);
  }

  return months;
}

/**
 * Get last N months from current month (including current)
 */
export function getRecentMonths(count: number): string[] {
  const months: string[] = [];
  const current = getCurrentMonth();

  for (let i = 0; i < count; i++) {
    months.push(addMonths(current, -i));
  }

  return months.reverse();
}

/**
 * Format relative time (e.g., "2 months ago", "in 3 days")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Calculate savings rate: (income - spending) / income * 100
 */
export function calculateSavingsRate(income: number, spending: number): number {
  if (income <= 0) return 0;
  const rate = ((income - spending) / income) * 100;
  return Math.max(0, Math.min(100, rate)); // Clamp between 0-100
}

/**
 * Calculate investment rate: investment / income * 100
 */
export function calculateInvestmentRate(investment: number, income: number): number {
  if (income <= 0) return 0;
  const rate = (investment / income) * 100;
  return Math.max(0, rate);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format change with + or - prefix
 */
export function formatChange(value: number, asPercent: boolean = false): string {
  const sign = value >= 0 ? '+' : '';
  if (asPercent) {
    return `${sign}${formatPercent(value)}`;
  }
  return `${sign}${formatNumber(value)}`;
}

/**
 * Get color class for positive/negative values
 */
export function getChangeColor(value: number): string {
  if (value > 0) return 'text-accent-growth';
  if (value < 0) return 'text-accent-negative';
  return 'text-foreground-secondary';
}
