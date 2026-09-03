# 🎓 Student Finance Tracker

> A modern, student-focused personal finance dashboard to track income, expenses, and budget effortlessly. Designed with high visual fidelity, rich charts, data-driven financial insights, responsive layouts, and permanent browser persistence.

---

## 🌟 Overview & UI Design

Built specifically to match college project aesthetic standards with:
- **Rich Purple/Blue Gradient Background** (`#4f46e5` to `#7c3aed`)
- **Centered High-Contrast Container** with soft shadows and rounded 24px+ corners
- **Vibrant Accent Header Bars** (`#5e6cf5`) on ledger tables
- **Responsive Charts**: Donut chart category breakdown, daily expense bars, income vs. expense balance, and monthly timelines
- **Authentic Empty States**: Pixel-matched placeholder axis and guides when no data exists yet

---

## 🚀 Key Features

### 1. Dashboard Summary Cards
- **Total Income**: Real-time sum of all income transactions (`₹`)
- **Total Expenses**: Real-time sum of all expense transactions (`₹`)
- **Balance**: `Total Income - Total Expenses` (clearly indicates surplus or deficit)
- **Savings Rate**: `((Total Income - Total Expenses) / Total Income) * 100` (safe handling of 0 income to avoid `NaN` / `Infinity`)

### 2. Transaction Management
- Dynamic form switching between **Expense (-)** and **Income (+)**
- Student-specific categories:
  - **Income**: *Scholarship, Allowance, Salary, Freelance, Part-time Job, Gift, Other Income*
  - **Expense**: *Food, Travel, Education, Books, Entertainment, Shopping, Rent, Bills, Mobile/Internet, Healthcare, Subscriptions, Other*
- Decimal validation, date picker default to today, and optional description notes
- **Edit Transaction**: Inline editing with smooth scroll to form
- **Delete Transaction**: Modal confirmation to avoid accidental deletion
- **Clear All**: Confirmation-protected bulk reset

### 3. Monthly Budget Feature
- Set and adjust custom monthly expense targets (e.g., `₹15,000.00`)
- Visual multi-stage progress bar (Green `<75%`, Amber `75-99%`, Red `≥100%`)
- Automatic **"Budget exceeded"** warning banner when spending surpasses the target

### 4. Interactive Analytics
- **Category Breakdown**: Interactive SVG Donut Chart with legends and percentage breakdown
- **Daily Expenses**: Bar chart grouped by transaction date with currency Y-axis
- **Income vs Expenses**: Outflow vs inflow comparison bar
- **Monthly Overview**: Chronological multi-month income & expense trend
- **Exact Empty State**: Elegant placeholder axes matching reference screenshots

### 5. Automated Financial Insights
- Rule-based dynamic financial intelligence:
  - Highlights highest spending category and percentage share
  - Current month expenditure and net savings
  - Budget utilization alerts and milestones
  - Average daily spend across active days

### 6. Search, Filter & Sort
- Filter by Type: *All / Income / Expense*
- Filter by Category dropdown
- Filter by Date Range (*From* and *To*)
- Live Search across: *Category, Description, and Amount*
- Sorting by: *Newest First, Oldest First, Highest Amount, Lowest Amount*

### 7. Data Persistence & Portability
- Persists all records and budget settings in browser `localStorage` (`student_finance_transactions_v1`)
- Data remains intact across browser reloads, system restarts, and session closures
- **Load Sample Data**: One-click demo data loader pre-populated with college expenses
- **Export Data**: Download all transactions as structured JSON backup

---

## 🛠️ Technology Stack

- **Framework**: React 18 / 19 with TypeScript
- **Bundler & Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Hosting Compatibility**: 100% Client-side SPA (zero backend or database server required)

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ (tested on Node v25)
- npm 9+

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

### Production Build
```bash
# Build optimized static bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Permanent Independent Deployment Guide

### Why Antigravity Previews Stop
Antigravity's development server runs locally on your machine. When you close Antigravity or switch between workspaces, the local Node process stops.

To give this project (and all your future repositories) a **permanent, independently accessible live URL** that stays online 24/7 even when your PC is turned off, deploy it to a dedicated cloud platform.

---

### Option 1: GitHub Pages (100% Free, Automated via GitHub Actions)
This repository already includes `.github/workflows/deploy.yml` and `base: './'` in `vite.config.ts`.

#### Steps:
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete student finance tracker"
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**
   - Under **Build and deployment** > **Source**, select **GitHub Actions**
3. That's it! GitHub Actions will automatically run `npm run build` and publish your site at:
   ```
   https://<YOUR_USERNAME>.github.io/<YOUR_REPO>/
   ```
4. **Permanent**: This live demo runs completely independent of Antigravity and will never shut down.

---

### Option 2: Vercel (Recommended for Instant Deployments)
This repository includes `vercel.json` configured for SPA routing.

#### Steps:
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **"Add New..."** > **"Project"**.
3. Select your repository `expense-tracker` and click **Deploy**.
4. Vercel automatically detects Vite, runs `npm run build`, and assigns a permanent URL:
   ```
   https://expense-tracker-<your-team>.vercel.app
   ```
5. Every future `git push` to `main` will automatically build and update the live demo.

---

## 🔄 Universal Pattern for All Future Projects
*(ONE GITHUB REPOSITORY = ONE INDEPENDENT PERMANENT LIVE DEMO)*

| Project Type | Recommended Hosting | Configuration File | Resulting URL |
| :--- | :--- | :--- | :--- |
| **Frontend Only / Static (Vite, React, Vue, Next export)** | GitHub Pages or Vercel | `.github/workflows/deploy.yml` or `vercel.json` | `https://<repo>.vercel.app` or `https://<user>.github.io/<repo>` |
| **Full Stack (Node + Express / FastAPI + React)** | Vercel (Frontend) + Render / Railway (Backend) | `render.yaml` or `Dockerfile` | Frontend: `https://app.vercel.app`<br>API: `https://api.onrender.com` |

---

## 📋 Environments Summary

- **LOCAL**: `http://localhost:3000` (Running directly on your machine during development)
- **DEVELOPMENT**: Temporary preview URLs generated while an active Antigravity session is running
- **PRODUCTION**: Permanent live cloud URL (e.g., `https://<username>.github.io/<repo>/` or `https://<repo>.vercel.app`) that stays active 24/7/365

---

## 📜 License

Created with ❤️ for students. Open-source educational project.
