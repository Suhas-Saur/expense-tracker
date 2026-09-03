import React, { useState } from 'react';
import { PieChart, BarChart3, TrendingUp, CalendarDays } from 'lucide-react';
import { Transaction } from '../types/finance';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

interface AnalyticsSectionProps {
  transactions: Transaction[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10b981', // emerald
  Travel: '#f59e0b', // amber/orange
  Books: '#6366f1', // purple/indigo
  Entertainment: '#818cf8', // lavender/blue
  Education: '#06b6d4', // cyan
  Shopping: '#ec4899', // pink
  Rent: '#8b5cf6', // violet
  Bills: '#64748b', // slate
  'Mobile/Internet': '#0284c7', // sky
  Healthcare: '#ef4444', // red
  Subscriptions: '#d946ef', // fuchsia
  Other: '#94a3b8', // gray
};

const DEFAULT_COLOR = '#6366f1';

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'compare' | 'monthly'>('daily');

  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');

  // 1. Category Breakdown Data
  const categoryMap: Record<string, number> = {};
  let totalExpenseAmount = 0;
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    totalExpenseAmount += e.amount;
  });

  const categoryData = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0,
      color: CATEGORY_COLORS[category] || DEFAULT_COLOR,
    }))
    .sort((a, b) => b.amount - a.amount);

  // 2. Daily Expenses Data (Chronological)
  const dailyMap: Record<string, number> = {};
  expenses.forEach((e) => {
    dailyMap[e.date] = (dailyMap[e.date] || 0) + e.amount;
  });

  const sortedDates = Object.keys(dailyMap).sort();
  const dailyData = sortedDates.map((date) => ({
    date,
    formattedDate: formatDateDisplay(date),
    amount: dailyMap[date],
  }));

  // Max daily amount for scaling
  const maxDailyExpense = dailyData.length > 0 ? Math.max(...dailyData.map((d) => d.amount)) : 100;
  // Nice round Y-axis ceiling
  const yAxisCeiling = Math.max(100, Math.ceil(maxDailyExpense / 100) * 100);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(yAxisCeiling * ratio));

  // 3. Monthly Overview Data
  const monthMap: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    const monthKey = t.date.substring(0, 7); // YYYY-MM
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthMap[monthKey].income += t.amount;
    } else {
      monthMap[monthKey].expense += t.amount;
    }
  });

  const sortedMonths = Object.keys(monthMap).sort();
  const monthlyData = sortedMonths.map((m) => {
    const [year, month] = m.split('-');
    const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const label = dateObj.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    return {
      month: m,
      label,
      income: monthMap[m].income,
      expense: monthMap[m].expense,
    };
  });

  // Calculate SVG Donut Paths
  const renderDonutSegments = () => {
    if (categoryData.length === 0) return null;

    let cumulativeAngle = 0;
    const size = 200;
    const strokeWidth = 36;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {categoryData.map((item) => {
          const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -((cumulativeAngle / 100) * circumference);
          cumulativeAngle += item.percentage;

          return (
            <circle
              key={item.category}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300 hover:opacity-85 cursor-pointer"
            >
              <title>{`${item.category}: ${formatCurrency(item.amount)} (${Math.round(
                item.percentage
              )}%)`}</title>
            </circle>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="mb-10">
      {/* Section Header with Subtle Accent Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Expense & Income Analytics</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Visual breakdown of spending patterns and timeline trends
          </p>
        </div>

        {/* View Switcher for the right panel */}
        <div className="mt-3 sm:mt-0 inline-flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'daily'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Daily</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Income vs Exp</span>
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'monthly'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Monthly</span>
          </button>
        </div>
      </div>

      {/* 2-Column Analytics Grid Matching Reference Screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Category Breakdown Donut Chart */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs min-h-[340px]">
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center justify-center gap-1.5">
              <PieChart className="w-4 h-4 text-brand-600" />
              <span>Category Breakdown</span>
            </h3>
          </div>

          {/* Chart or Exact Screenshot Empty State */}
          <div className="flex-1 flex flex-col items-center justify-center my-4">
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <div className="w-28 h-28 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center mb-3">
                  <PieChart className="w-8 h-8 text-slate-300 stroke-1" />
                </div>
                <p className="text-xs sm:text-sm italic text-gray-400">
                  Add expenses to see the breakdown
                </p>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                {renderDonutSegments()}
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-gray-500 font-medium">Expenses</span>
                  <span className="text-sm font-extrabold text-gray-800">
                    {formatCurrency(totalExpenseAmount, false)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Legend Matching Reference Screenshot */}
          {expenses.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 border-t border-slate-200/60 text-xs">
              {categoryData.slice(0, 6).map((item) => (
                <div key={item.category} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-2 rounded-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700 font-medium">{item.category}</span>
                  <span className="text-gray-400 text-[11px]">
                    {Math.round(item.percentage)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Trend & Timeline Chart (Daily / Income vs Expense / Monthly) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs min-h-[340px]">
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-bold text-gray-800">
              {activeTab === 'daily' && 'Daily Expenses'}
              {activeTab === 'compare' && 'Income vs Expenses'}
              {activeTab === 'monthly' && 'Monthly Overview'}
            </h3>
          </div>

          {/* Chart Content */}
          <div className="flex-1 flex flex-col justify-center my-2">
            {expenses.length === 0 && incomes.length === 0 ? (
              /* Exact Screenshot Empty State: Y Axis with ₹ ticks and italic message */
              <div className="w-full h-56 flex flex-col justify-between py-2 px-4 relative">
                <div className="w-full flex-1 flex flex-col justify-between border-l border-b border-slate-200 pl-2">
                  {['₹1', '₹0.9', '₹0.8', '₹0.7', '₹0.6', '₹0.5', '₹0.4', '₹0.3', '₹0.2', '₹0.1', '₹0'].map(
                    (tick) => (
                      <div key={tick} className="w-full flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 w-6 text-right select-none">{tick}</span>
                        <div className="flex-1 border-b border-dashed border-slate-200" />
                      </div>
                    )
                  )}
                </div>
                <div className="text-center mt-3">
                  <p className="text-xs sm:text-sm italic text-gray-400">
                    Add expenses to see the trend
                  </p>
                </div>
              </div>
            ) : activeTab === 'daily' ? (
              /* Daily Expenses Bar Chart */
              dailyData.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-12">
                  No expense records available for daily trend.
                </p>
              ) : (
                <div className="w-full h-56 flex flex-col justify-end pt-4 pb-1">
                  {/* Grid Lines & Bars */}
                  <div className="flex-1 flex items-end justify-around gap-2 px-3 border-b border-slate-200 relative">
                    {/* Horizontal Guide Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      {yTicks.slice().reverse().map((t) => (
                        <div key={t} className="border-b border-dashed border-slate-300 w-full" />
                      ))}
                    </div>

                    {/* Bars */}
                    {dailyData.slice(-7).map((d) => {
                      const heightPercent =
                        yAxisCeiling > 0 ? Math.max(8, (d.amount / yAxisCeiling) * 100) : 10;
                      return (
                        <div
                          key={d.date}
                          className="flex-1 max-w-[48px] flex flex-col items-center h-full justify-end group z-10"
                        >
                          {/* Hover Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[11px] rounded-md px-2 py-1 absolute -top-8 pointer-events-none whitespace-nowrap shadow-lg">
                            {formatCurrency(d.amount)}
                          </div>
                          <div
                            className="w-full bg-[#5e6cf5] rounded-t-lg hover:bg-brand-700 transition-all duration-300 shadow-xs cursor-pointer"
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* X Axis Labels */}
                  <div className="flex justify-around px-3 pt-2 text-[11px] font-medium text-gray-500">
                    {dailyData.slice(-7).map((d) => (
                      <span key={d.date} className="truncate max-w-[54px] text-center">
                        {d.formattedDate.replace(/ \d{4}$/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ) : activeTab === 'compare' ? (
              /* Income vs Expenses Bar Comparison */
              <div className="w-full h-56 flex flex-col justify-center px-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-emerald-700">Income Inflow</span>
                      <span className="text-emerald-700">
                        {formatCurrency(
                          incomes.reduce((acc, i) => acc + i.amount, 0)
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            incomes.length + expenses.length > 0
                              ? Math.min(
                                  100,
                                  (incomes.reduce((acc, i) => acc + i.amount, 0) /
                                    (incomes.reduce((acc, i) => acc + i.amount, 0) +
                                      expenses.reduce((acc, e) => acc + e.amount, 0) || 1)) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-rose-700">Expense Outflow</span>
                      <span className="text-rose-700">
                        {formatCurrency(totalExpenseAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            incomes.length + expenses.length > 0
                              ? Math.min(
                                  100,
                                  (totalExpenseAmount /
                                    (incomes.reduce((acc, i) => acc + i.amount, 0) +
                                      totalExpenseAmount || 1)) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-gray-600 flex justify-between">
                    <span>Net Financial Margin:</span>
                    <span
                      className={`font-bold ${
                        incomes.reduce((acc, i) => acc + i.amount, 0) - totalExpenseAmount >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {formatCurrency(
                        incomes.reduce((acc, i) => acc + i.amount, 0) - totalExpenseAmount
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Monthly Overview */
              monthlyData.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-12">
                  No monthly records recorded yet.
                </p>
              ) : (
                <div className="w-full h-56 flex flex-col justify-end pt-4 pb-1">
                  <div className="flex-1 flex items-end justify-around gap-4 px-3 border-b border-slate-200">
                    {monthlyData.slice(-6).map((m) => {
                      const maxMonthAmt = Math.max(m.income, m.expense, 100);
                      const incHeight = (m.income / maxMonthAmt) * 85;
                      const expHeight = (m.expense / maxMonthAmt) * 85;

                      return (
                        <div key={m.month} className="flex-1 flex flex-col items-center h-full justify-end">
                          <div className="flex items-end gap-1.5 h-full w-full justify-center">
                            <div
                              title={`Income: ${formatCurrency(m.income)}`}
                              className="w-3.5 sm:w-4 bg-emerald-500 rounded-t-sm hover:opacity-85 transition-all"
                              style={{ height: `${Math.max(4, incHeight)}%` }}
                            />
                            <div
                              title={`Expense: ${formatCurrency(m.expense)}`}
                              className="w-3.5 sm:w-4 bg-rose-500 rounded-t-sm hover:opacity-85 transition-all"
                              style={{ height: `${Math.max(4, expHeight)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-around px-3 pt-2 text-[11px] font-medium text-gray-500">
                    {monthlyData.slice(-6).map((m) => (
                      <span key={m.month}>{m.label}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Income
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" /> Expense
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
