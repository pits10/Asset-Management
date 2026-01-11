// ========== Assets ==========
export type AssetCategory = 'deposit' | 'stock' | 'fund' | 'crypto' | 'employeeStock';

interface BaseAsset {
  id: string;
  category: AssetCategory;
  createdAt: Date;
  updatedAt: Date;
}

// 現金・預金
export interface DepositAsset extends BaseAsset {
  category: 'deposit';
  financialInstitution?: string; // 金融機関
  accountName?: string;          // 口座名
  balance: number;               // 残高（JPY）
}

// 株式
export interface StockAsset extends BaseAsset {
  category: 'stock';
  market?: 'japan' | 'us' | 'other'; // 市場
  ticker?: string;                    // ティッカー（任意）
  stockName?: string;                 // 銘柄名（任意）
  shares: number;                     // 保有株数（必須）
  averagePrice: number;               // 平均取得単価（必須）
  currentValue?: number;              // 現在評価額（任意・手入力）
  currency: 'JPY' | 'USD';           // 通貨（市場で決定）
}

// 投資信託 / ETF
export interface FundAsset extends BaseAsset {
  category: 'fund';
  fundType?: 'mutualFund' | 'etf';   // 種類
  fundName: string;                   // 商品名（必須）
  quantity: number;                   // 保有数量（必須）
  averagePrice?: number;              // 平均取得単価（任意）
  currentValue?: number;              // 現在評価額（任意・手入力）
}

// 暗号資産
export interface CryptoAsset extends BaseAsset {
  category: 'crypto';
  cryptoCurrency?: string;            // 通貨（BTC/ETH/SOL等）
  quantity: number;                   // 保有数量（必須）
  averagePrice?: number;              // 平均取得単価（任意）
  currentValue?: number;              // 現在評価額（任意・手入力）
  exchange?: string;                  // 取引所（任意）
}

// 持ち株（ESPP / RSU / ストックオプション）
export interface EmployeeStockAsset extends BaseAsset {
  category: 'employeeStock';
  employeeStockType?: 'espp' | 'rsu' | 'stockOption'; // 種別
  companyName: string;                                 // 会社名（必須）
  ticker?: string;                                     // ティッカー（任意）
  sharesOrRights: number;                             // 保有株数 or 権利数（必須）
  averagePriceOrStrikePrice: number;                  // 平均取得単価 or 行使価格（必須）
  currentValue?: number;                               // 現在評価額（任意・手入力）
  esppDiscountRate?: number;                           // ESPP割引率（ESPPのみ任意）
  esppCompanyContribution?: number;                    // ESPP会社補助（ESPPのみ任意）
}

export type Asset = DepositAsset | StockAsset | FundAsset | CryptoAsset | EmployeeStockAsset;

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
export type IncomeType = 'salary' | 'bonus' | 'other';

export interface Income {
  id: string;
  type: IncomeType;              // 種類（月給/賞与/その他）
  source: string;                // "給与", "副業", "配当"
  amount: number;
  date: Date;
  createdAt: Date;
}

// ========== Investment Plan ==========
export interface InvestmentPlan {
  id: string;
  assetCategory: AssetCategory;  // どのカテゴリに積み立てるか
  categoryName: string;          // カテゴリ表示名（deposit→"現金・預金"等）
  monthlyAmount: number;         // 毎月の積立額
  expectedReturn?: number;       // 期待リターン（年率%、ユーザー手入力）
  createdAt: Date;
  updatedAt: Date;
}

// ========== Daily Snapshot ==========
export interface DailySnapshot {
  id: string;
  date: string;                  // "2025-01-11" (YYYY-MM-DD)
  totalAssets: number;           // その日の総資産
  cashRatio: number;             // 流動性比率
  assetBreakdown: {              // カテゴリ別内訳
    deposit: number;
    stock: number;
    fund: number;
    crypto: number;
    employeeStock: number;
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
  annualRaiseRate?: number;      // 将来昇給率（年率%、Forecast画面用）
}

// ========== KPI Types ==========
export interface KPIData {
  netWorthChange: number;        // 純資産増減
  monthlyBalance: number;        // 月間収支
  savingsRate: number;           // 貯蓄率 (%)
  liquidityRatio: number;        // 流動性比率 (%)
  monthlyExpenses: number;       // 月間総支出
  assetAllocation: {             // 資産構成比
    deposit: number;
    stock: number;
    fund: number;
    crypto: number;
    employeeStock: number;
  };
}

// ========== Monthly State (Simplified Trajectory Data) ==========
export interface MonthlyState {
  id: string;
  month: string;                     // "YYYY-MM" format
  netWorth: number;                  // Total net worth for the month
  cash: number;                      // Cash & deposits total
  invested: number;                  // All investment assets (stocks, funds, crypto, employee stock)
  incomeMonthly: number;            // Total monthly income
  livingCostMonthly: number;        // Total monthly living cost (expenses)
  monthlyInvestContribution: number; // Monthly investment contribution
  createdAt: Date;
  updatedAt: Date;
}

// ========== Helper Types ==========
// Category display names (English)
export const AssetCategoryLabels: Record<AssetCategory, string> = {
  deposit: 'Cash & Deposits',
  stock: 'Stocks',
  fund: 'Funds / ETF',
  crypto: 'Crypto',
  employeeStock: 'Company Equity',
};

// Financial institutions (kept for legacy compatibility)
export const FinancialInstitutions = [
  '三菱UFJ',
  '三井住友',
  'みずほ',
  'りそな',
  'ゆうちょ',
  '楽天銀行',
  '住信SBI',
  'PayPay銀行',
  'その他',
] as const;

export type FinancialInstitution = typeof FinancialInstitutions[number];
