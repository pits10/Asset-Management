import { v4 as uuidv4 } from 'uuid';
import { db } from './schema';
import type { Asset, Expense, Income, DailySnapshot, AppSettings, InvestmentPlan } from '@/types';

// ========== Assets CRUD ==========
export const assetsDB = {
  async getAll(): Promise<Asset[]> {
    return await db.assets.toArray();
  },

  async getById(id: string): Promise<Asset | undefined> {
    return await db.assets.get(id);
  },

  async create(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = uuidv4();
    const now = new Date();
    await db.assets.add({
      ...asset,
      id,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },

  async update(id: string, updates: Partial<Omit<Asset, 'id' | 'createdAt'>>): Promise<void> {
    await db.assets.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async delete(id: string): Promise<void> {
    await db.assets.delete(id);
  },

  async getByCategory(category: Asset['category']): Promise<Asset[]> {
    return await db.assets.where('category').equals(category).toArray();
  },
};

// ========== Expenses CRUD ==========
export const expensesDB = {
  async getAll(): Promise<Expense[]> {
    return await db.expenses.toArray();
  },

  async getById(id: string): Promise<Expense | undefined> {
    return await db.expenses.get(id);
  },

  async create(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<string> {
    const id = uuidv4();
    await db.expenses.add({
      ...expense,
      id,
      createdAt: new Date(),
    });
    return id;
  },

  async update(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): Promise<void> {
    await db.expenses.update(id, updates);
  },

  async delete(id: string): Promise<void> {
    await db.expenses.delete(id);
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    return await db.expenses
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  },

  async getByType(type: Expense['type']): Promise<Expense[]> {
    return await db.expenses.where('type').equals(type).toArray();
  },
};

// ========== Incomes CRUD ==========
export const incomesDB = {
  async getAll(): Promise<Income[]> {
    return await db.incomes.toArray();
  },

  async getById(id: string): Promise<Income | undefined> {
    return await db.incomes.get(id);
  },

  async create(income: Omit<Income, 'id' | 'createdAt'>): Promise<string> {
    const id = uuidv4();
    await db.incomes.add({
      ...income,
      id,
      createdAt: new Date(),
    });
    return id;
  },

  async update(id: string, updates: Partial<Omit<Income, 'id' | 'createdAt'>>): Promise<void> {
    await db.incomes.update(id, updates);
  },

  async delete(id: string): Promise<void> {
    await db.incomes.delete(id);
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<Income[]> {
    return await db.incomes
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  },
};

// ========== Daily Snapshots CRUD ==========
export const snapshotsDB = {
  async getAll(): Promise<DailySnapshot[]> {
    return await db.dailySnapshots.orderBy('date').reverse().toArray();
  },

  async getById(id: string): Promise<DailySnapshot | undefined> {
    return await db.dailySnapshots.get(id);
  },

  async getByDate(date: string): Promise<DailySnapshot | undefined> {
    return await db.dailySnapshots.where('date').equals(date).first();
  },

  async create(snapshot: Omit<DailySnapshot, 'id' | 'createdAt'>): Promise<string> {
    const id = uuidv4();
    await db.dailySnapshots.add({
      ...snapshot,
      id,
      createdAt: new Date(),
    });
    return id;
  },

  async getLatest(): Promise<DailySnapshot | undefined> {
    return await db.dailySnapshots.orderBy('date').reverse().first();
  },

  async getByDateRange(startDate: string, endDate: string): Promise<DailySnapshot[]> {
    return await db.dailySnapshots
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  },
};

// ========== Settings CRUD ==========
export const settingsDB = {
  async get(): Promise<AppSettings | undefined> {
    return await db.settings.toCollection().first();
  },

  async set(settings: Omit<AppSettings, 'id'>): Promise<void> {
    const existing = await this.get();
    if (existing) {
      await db.settings.update(existing.id, settings);
    } else {
      await db.settings.add({ ...settings, id: 'app-settings' });
    }
  },

  async getOrDefault(): Promise<AppSettings> {
    const settings = await this.get();
    return settings || {
      id: 'app-settings',
      currency: 'JPY',
      theme: 'dark',
      monthlyIncomeTarget: 300000, // デフォルト30万円
      annualRaiseRate: 0, // デフォルト0%
    };
  },
};

// ========== Investment Plans CRUD ==========
export const investmentPlansDB = {
  async getAll(): Promise<InvestmentPlan[]> {
    return await db.investmentPlans.toArray();
  },

  async getById(id: string): Promise<InvestmentPlan | undefined> {
    return await db.investmentPlans.get(id);
  },

  async create(plan: Omit<InvestmentPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = uuidv4();
    const now = new Date();
    await db.investmentPlans.add({
      ...plan,
      id,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },

  async update(id: string, updates: Partial<Omit<InvestmentPlan, 'id' | 'createdAt'>>): Promise<void> {
    await db.investmentPlans.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async delete(id: string): Promise<void> {
    await db.investmentPlans.delete(id);
  },

  async getByCategory(category: InvestmentPlan['assetCategory']): Promise<InvestmentPlan[]> {
    return await db.investmentPlans.where('assetCategory').equals(category).toArray();
  },
};
