import Dexie, { type EntityTable } from 'dexie';
import type {
  Asset,
  Expense,
  Income,
  DailySnapshot,
  AppSettings,
} from '@/types';

// Dexie Database Class
class AssetManagementDB extends Dexie {
  assets!: EntityTable<Asset, 'id'>;
  expenses!: EntityTable<Expense, 'id'>;
  incomes!: EntityTable<Income, 'id'>;
  dailySnapshots!: EntityTable<DailySnapshot, 'id'>;
  settings!: EntityTable<AppSettings, 'id'>;

  constructor() {
    super('AssetManagementDB');

    this.version(1).stores({
      assets: 'id, category, name, updatedAt, createdAt',
      expenses: 'id, type, category, date, createdAt',
      incomes: 'id, source, date, createdAt',
      dailySnapshots: 'id, date, createdAt',
      settings: 'id',
    });
  }
}

// Export singleton instance
export const db = new AssetManagementDB();
