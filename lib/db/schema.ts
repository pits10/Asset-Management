import Dexie, { type EntityTable } from 'dexie';
import type {
  Asset,
  Expense,
  Income,
  DailySnapshot,
  AppSettings,
  InvestmentPlan,
  MonthlyState,
} from '@/types';

// Dexie Database Class
class AssetManagementDB extends Dexie {
  assets!: EntityTable<Asset, 'id'>;
  expenses!: EntityTable<Expense, 'id'>;
  incomes!: EntityTable<Income, 'id'>;
  dailySnapshots!: EntityTable<DailySnapshot, 'id'>;
  settings!: EntityTable<AppSettings, 'id'>;
  investmentPlans!: EntityTable<InvestmentPlan, 'id'>;
  monthlyStates!: EntityTable<MonthlyState, 'id'>;

  constructor() {
    super('AssetManagementDB');

    // Version 1: 初期スキーマ
    this.version(1).stores({
      assets: 'id, category, name, updatedAt, createdAt',
      expenses: 'id, type, category, date, createdAt',
      incomes: 'id, source, date, createdAt',
      dailySnapshots: 'id, date, createdAt',
      settings: 'id',
    });

    // Version 2: 新しいアセットカテゴリとInvestmentPlansテーブル追加
    this.version(2)
      .stores({
        assets: 'id, category, updatedAt, createdAt', // インデックスを更新（nameは不要）
        expenses: 'id, type, category, date, createdAt',
        incomes: 'id, type, source, date, createdAt', // typeインデックス追加
        dailySnapshots: 'id, date, createdAt',
        settings: 'id',
        investmentPlans: 'id, assetCategory, createdAt, updatedAt', // 新規テーブル
      })
      .upgrade(async (trans) => {
        // 既存のassetsデータをマイグレーション
        const assets = await trans.table('assets').toArray();

        for (const asset of assets) {
          // 旧カテゴリを新カテゴリに変換
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const oldCategory = (asset as any).category;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const oldName = (asset as any).name;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const oldAmount = (asset as any).amount;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const oldTicker = (asset as any).ticker;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let migratedAsset: any = {
            id: asset.id,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt || new Date(),
          };

          // カテゴリ変換ロジック
          if (oldCategory === 'cash') {
            // 現金 → 現金・預金
            migratedAsset.category = 'deposit';
            migratedAsset.balance = oldAmount || 0;
            migratedAsset.accountName = oldName || '口座';
          } else if (oldCategory === 'investment') {
            // 投資 → 株式 or 投資信託（ティッカーがあれば株式）
            if (oldTicker) {
              migratedAsset.category = 'stock';
              migratedAsset.ticker = oldTicker;
              migratedAsset.stockName = oldName || '';
              migratedAsset.shares = 1; // デフォルト値
              migratedAsset.averagePrice = oldAmount || 0;
              migratedAsset.market = 'other';
              migratedAsset.currency = 'JPY';
            } else {
              migratedAsset.category = 'fund';
              migratedAsset.fundName = oldName || '投資信託';
              migratedAsset.quantity = 1; // デフォルト値
              migratedAsset.averagePrice = oldAmount || 0;
            }
          } else if (oldCategory === 'realEstate' || oldCategory === 'other') {
            // 不動産・その他 → 預金として保存（仕様にないため）
            migratedAsset.category = 'deposit';
            migratedAsset.balance = oldAmount || 0;
            migratedAsset.accountName = oldName || 'その他';
          } else {
            // 既に新しい形式の場合はそのまま
            migratedAsset = asset;
          }

          // データ更新
          await trans.table('assets').put(migratedAsset);
        }

        // 既存のdailySnapshotsデータをマイグレーション
        const snapshots = await trans.table('dailySnapshots').toArray();

        for (const snapshot of snapshots) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const oldBreakdown = (snapshot as any).assetBreakdown;

          if (oldBreakdown && 'cash' in oldBreakdown) {
            // 旧形式の場合、新形式に変換
            const migratedSnapshot = {
              ...snapshot,
              assetBreakdown: {
                deposit: oldBreakdown.cash || 0,
                stock: (oldBreakdown.investment || 0) * 0.5, // 仮に半分ずつ
                fund: (oldBreakdown.investment || 0) * 0.5,
                crypto: 0,
                employeeStock: 0,
              },
            };

            await trans.table('dailySnapshots').put(migratedSnapshot);
          }
        }
      });

    // Version 3: Add MonthlyState table for simplified trajectory
    this.version(3).stores({
      assets: 'id, category, updatedAt, createdAt',
      expenses: 'id, type, category, date, createdAt',
      incomes: 'id, type, source, date, createdAt',
      dailySnapshots: 'id, date, createdAt',
      settings: 'id',
      investmentPlans: 'id, assetCategory, createdAt, updatedAt',
      monthlyStates: 'id, month, createdAt, updatedAt', // New table for monthly aggregated state
    });
  }
}

// Export singleton instance
export const db = new AssetManagementDB();
