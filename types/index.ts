// ========== Assets ==========
export type AssetCategory = 'cash' | 'investment' | 'realEstate' | 'other';

export interface Asset {
  id: string;                    // UUID
  category: AssetCategory;
  name: string;                  // "三菱UFJ普通預金"
  amount: number;                // 金額（円）
  ticker?: string;               // "AAPL" (株式の場合)
  updatedAt: Date;
  createdAt: Date;
}

// ========== Expenses ==========
export type ExpenseType = 'fixed' | 'variable';
export type ExpenseCategory =
  | 'housing' | 'utilities' | 'telecom' | 'subscription' | 'insurance'  // 固定費
  | 'food' | 'transport' | 'entertainment' | 'clothing' | 'other';      // 変動費

export interface Expense {
  id: string;
  type: ExpenseType;
  category: ExpenseCategory;
  amount: number;
  date: Date;                    // 支出日
  memo?: string;
  createdAt: Date;
}

// ========== Income ==========
export interface Income {
  id: string;
  source: string;                // "給与", "副業", "配当"
  amount: number;
  date: Date;
  createdAt: Date;
}

// ========== Daily Snapshot ==========
export interface DailySnapshot {
  id: string;
  date: string;                  // "2025-01-11" (YYYY-MM-DD)
  totalAssets: number;           // その日の総資産
  cashRatio: number;             // 流動性比率
  assetBreakdown: {              // カテゴリ別内訳
    cash: number;
    investment: number;
    realEstate: number;
    other: number;
  };
  dailyChange: number;           // 前日比差分
  createdAt: Date;               // スナップショット作成日時
}

// ========== Settings ==========
export interface AppSettings {
  id: string;                    // シングルレコード用
  currency: 'JPY' | 'USD';
  theme: 'light' | 'dark';
  monthlyIncomeTarget: number;   // 月間収入目標（貯蓄率計算用）
}

// ========== KPI Types ==========
export interface KPIData {
  netWorthChange: number;        // 純資産増減
  monthlyBalance: number;        // 月間収支
  savingsRate: number;           // 貯蓄率 (%)
  liquidityRatio: number;        // 流動性比率 (%)
  monthlyExpenses: number;       // 月間総支出
  assetAllocation: {             // 資産構成比
    cash: number;
    investment: number;
    realEstate: number;
    other: number;
  };
}
