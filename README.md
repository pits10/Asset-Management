# Financial Trajectory

**Personal Financial Trajectory OS**

This app is not for tracking money.
It is for understanding financial direction.

---

## Overview

Financial Trajectory is a premium, mobile-first application designed to answer one core question:

**"Am I moving in the right financial direction?"**

Built with Next.js, TypeScript, and IndexedDB, this app provides instant psychological feedback on your financial health through a clean, futuristic interface. No budgeting. No expense categories. No external APIs.

---

## Core Philosophy

1. **This is NOT a budgeting app**
   We don't track daily expenses or categorize every transaction.

2. **One core question**
   "Am I moving in the right financial direction?"

3. **UI/UX is the highest priority**
   Every interaction should feel calm, confident, and quietly powerful.

4. **Mobile-first**
   Designed for iPhone (375 × 812). Desktop is secondary.

5. **Dark mode only**
   Premium, futuristic aesthetic.

6. **No external data**
   No stock APIs, no news feeds, no real-time data. All projections are user-driven and local.

---

## Features

### 📊 Overview
Instant financial direction indicator:
- **Stable Growth** / **Flat** / **At Risk**
- Key metrics: Net Worth, Monthly Investment, Cash Runway, Savings Rate
- Minimal net worth trend chart (last 6 months)

### 📈 Trajectory
Interactive projection screen:
- Hero number: "In 10 years → ¥X.XM"
- Adjustable time horizon (1-50 years)
- Monthly investment and expected return controls
- Real-time chart updates
- Breakdown of contributions vs. growth

### ⚙️ Adjust
Simple financial levers:
- Monthly income (no micromanagement)
- Annual bonus (optional)
- Monthly living cost (single number, no categories)
- Computed: annual income, monthly surplus, savings rate

### 👤 Profile
Records and control:
- Sortable monthly history
- Display: net worth, income, living cost, investment
- Settings: base currency (JPY)
- Data export (coming soon)

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.7 |
| UI | React 18, shadcn/ui, Tailwind CSS |
| Database | IndexedDB (Dexie v4) |
| Charts | Recharts 3.6 |
| Fonts | Inter (next/font/google) |
| Theme | Permanent dark mode |

---

## Design System

### Colors
- Background: `#0B0F1A` (primary), `#0E1324` (secondary)
- Accent Growth: `#4DFFE5` (teal/neon mint)
- Accent Warning: `#FFB020`
- Accent Negative: `#FF6B6B`
- Borders: `rgba(255,255,255,0.06)`

### Typography
- Font: Inter
- Numeric font features for financial data
- Medium weight headings
- Tight tracking for numbers

### Layout
- Border radius: 12px (cards), 8px (inputs)
- Mobile-first: 375px viewport
- Bottom tab navigation
- Generous vertical spacing

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### First Time Setup

1. Open the app at `http://localhost:3000`
2. Navigate to the **Profile** tab
3. Click **"Generate Demo Data"** to explore the app with sample data
4. Once comfortable, clear the demo data and add your own information via the **Adjust** tab

---

## Project Structure

```
/
├── app/                         # Next.js App Router
│   ├── page.tsx                 # Overview (direction indicator)
│   ├── trajectory/page.tsx      # Projection screen
│   ├── adjust/page.tsx          # Income & lifestyle inputs
│   └── profile/page.tsx         # Monthly history & settings
├── components/
│   ├── layout/                  # Bottom nav, page shell
│   ├── overview/                # Direction analysis, chart
│   ├── trajectory/              # Projection chart
│   └── ui/                      # shadcn/ui primitives
├── lib/
│   ├── db/
│   │   ├── schema.ts            # Dexie database schema
│   │   └── indexeddb.ts         # CRUD operations
│   ├── hooks/
│   │   └── useMonthlyStates.ts  # Monthly state management
│   └── utils/
│       ├── projection.ts        # Projection calculations
│       ├── direction.ts         # Direction analysis
│       └── demo-data.ts         # Demo data generator
└── types/
    └── index.ts                 # TypeScript definitions
```

---

## Data Model

The app revolves around **MonthlyState** - a simplified snapshot of your financial state:

```typescript
interface MonthlyState {
  month: string;                    // "YYYY-MM"
  netWorth: number;                 // Total net worth
  cash: number;                     // Cash & deposits
  invested: number;                 // All investments
  incomeMonthly: number;            // Monthly income
  livingCostMonthly: number;        // Monthly living cost
  monthlyInvestContribution: number; // Monthly investment
}
```

---

## Projection Model

Financial projections use monthly compounding:

```
FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]

Where:
- PV = Present Value (current net worth)
- r = monthly rate (annual rate / 12 / 100)
- n = number of months
- PMT = monthly payment (contribution)
```

No external data. No market assumptions. Just math.

---

## What This App Is NOT

❌ A budgeting tool
❌ An expense tracker
❌ A stock portfolio manager
❌ A financial news aggregator
❌ A real-time market data viewer

---

## What This App IS

✅ A direction indicator
✅ A trajectory visualizer
✅ A psychological compass
✅ A calm, confident tool
✅ A local-first, privacy-focused app

---

## Privacy

- **100% local**: All data stored in IndexedDB (your browser)
- **No backend**: No servers, no cloud sync
- **No tracking**: No analytics, no telemetry
- **No external APIs**: No data leaves your device

---

## License

MIT

---

## Philosophy

> "The goal is not to track every penny.
> The goal is to know, instantly, if you're on the right path."

This app exists to provide calm, confident clarity about your financial direction.
Not to stress you with categories, budgets, and micromanagement.

**Understanding your financial direction.**
