import React, { useState } from 'react';
import { PieChart, BarChart3, TrendingUp, CalendarDays, Sparkles } from 'lucide-react';
import { Transaction } from '../types/finance';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

interface AnalyticsSectionProps {
  transactions: Transaction[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10b981', // emerald
  Travel: '#f59e0b', // amber
  Books: '#6366f1', // purple/indigo
  Entertainment: '#ec4899', // hot pink
  Education: '#06b6d4', // cyan
  Shopping: '#8b5cf6', // violet
  Rent: '#3b82f6', // blue
  Bills: '#64748b', // slate
  'Mobile/Internet': '#0ea5e9', // sky
  Healthcare: '#ef4444', // coral red
  Subscriptions: '#d946ef', // fuchsia
  Other: '#94a3b8', // cool gray
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

  // 2. Daily Expenses Data
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

  const maxDailyExpense = dailyData.length > 0 ? Math.max(...dailyData.map((d) => d.amount)) : 100;
  const yAxisCeiling = Math.max(100, Math.ceil(maxDailyExpense / 100) * 100);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(yAxisCeiling * ratio));

  // 3. Monthly Overview Data
  const monthMap: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    const monthKey = t.date.substring(0, 7);
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
    const size = 210;
    const strokeWidth = 38;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg] filter drop-shadow-md">
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
              className="transition-all duration-300 hover:opacity-85 hover:stroke-[42px] cursor-pointer"
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
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-100 text-indigo-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>Expense & Income Analytics</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Interactive visual charts comparing categorical share and temporal patterns
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-3 sm:mt-0 inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Daily</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Income vs Exp</span>
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Monthly</span>
          </button>
        </div>
      </div>

      {/* 2-Column Analytics Grid Matching Screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Category Breakdown Donut Chart */}
        <div className="bg-gradient-to-b from-slate-50 to-white border-2 border-slate-200/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xs min-h-[350px]">
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-extrabold text-gray-800 flex items-center justify-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <span>Category Breakdown</span>
            </h3>
          </div>

          {/* Chart Graphic or Authentic Screenshot Empty State */}
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
              <div className="relative flex items-center justify-center py-2">
                {renderDonutSegments()}
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Spent</span>
                  <span className="text-base font-black text-slate-900">
                    {formatCurrency(totalExpenseAmount, false)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Graphical Color-Pill Legend */}
          {expenses.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-100 text-xs">
              {categoryData.slice(0, 6).map((item) => (
                <div
                  key={item.category}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs hover:bg-white transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-800 font-bold text-[11px]">{item.category}</span>
                  <span className="text-slate-500 font-semibold text-[10px]">
                    {Math.round(item.percentage)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Timeline & Trend Charts */}
        <div className="bg-gradient-to-b from-slate-50 to-white border-2 border-slate-200/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xs min-h-[350px]">
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-extrabold text-gray-800">
              {activeTab === 'daily' && 'Daily Expenses Trend'}
              {activeTab === 'compare' && 'Inflow vs Outflow Comparison'}
              {activeTab === 'monthly' && 'Monthly Financial Overview'}
            </h3>
          </div>

          {/* Chart Content */}
          <div className="flex-1 flex flex-col justify-center my-2">
            {expenses.length === 0 && incomes.length === 0 ? (
              /* Exact Screenshot 1 Empty State */
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
              /* Daily Expenses Graphical Bar Chart */
              dailyData.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-12">
                  No expense records available for daily trend.
                </p>
              ) : (
                <div className="w-full h-56 flex flex-col justify-end pt-4 pb-1">
                  {/* Grid Lines & Glowing Gradient Bars */}
                  <div className="flex-1 flex items-end justify-around gap-2.5 px-3 border-b border-slate-200 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      {yTicks.slice().reverse().map((t) => (
                        <div key={t} className="border-b border-dashed border-slate-300 w-full" />
                      ))}
                    </div>

                    {dailyData.slice(-7).map((d) => {
                      const heightPercent =
                        yAxisCeiling > 0 ? Math.max(10, (d.amount / yAxisCeiling) * 100) : 10;
                      return (
                        <div
                          key={d.date}
                          className="flex-1 max-w-[46px] flex flex-col items-center h-full justify-end group z-10"
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold rounded-lg px-2.5 py-1 absolute -top-8 pointer-events-none whitespace-nowrap shadow-xl border border-white/20">
                            {formatCurrency(d.amount)}
                          </div>
                          <div
                            className="w-full bg-gradient-to-t from-[#4f46e5] via-[#5e6cf5] to-[#818cf8] rounded-t-xl hover:opacity-90 transition-all duration-300 shadow-md shadow-indigo-500/20 cursor-pointer"
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* X Axis */}
                  <div className="flex justify-around px-3 pt-2 text-[11px] font-bold text-gray-600">
                    {dailyData.slice(-7).map((d) => (
                      <span key={d.date} className="truncate max-w-[54px] text-center">
                        {d.formattedDate.replace(/ \d{4}$/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ) : activeTab === 'compare' ? (
              /* Income vs Expenses Comparison */
              <div className="w-full h-56 flex flex-col justify-center px-3 sm:px-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Income Inflow
                      </span>
                      <span className="text-emerald-700 font-extrabold">
                        {formatCurrency(incomes.reduce((acc, i) => acc + i.amount, 0))}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-emerald-200">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-700 shadow-xs"
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
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-rose-700 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Expense Outflow
                      </span>
                      <span className="text-rose-700 font-extrabold">
                        {formatCurrency(totalExpenseAmount)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-rose-200">
                      <div
                        className="bg-gradient-to-r from-rose-400 to-red-500 h-full rounded-full transition-all duration-700 shadow-xs"
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

                  <div className="p-3 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-gray-700 flex justify-between items-center">
                    <span className="font-bold">Net Financial Reserve:</span>
                    <span
                      className={`font-black text-sm px-2.5 py-0.5 rounded-full ${
                        incomes.reduce((acc, i) => acc + i.amount, 0) - totalExpenseAmount >= 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
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
                              className="w-3.5 sm:w-4 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-md hover:opacity-85 transition-all shadow-xs"
                              style={{ height: `${Math.max(6, incHeight)}%` }}
                            />
                            <div
                              title={`Expense: ${formatCurrency(m.expense)}`}
                              className="w-3.5 sm:w-4 bg-gradient-to-t from-rose-600 to-pink-400 rounded-t-md hover:opacity-85 transition-all shadow-xs"
                              style={{ height: `${Math.max(6, expHeight)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-around px-3 pt-2 text-[11px] font-bold text-gray-600">
                    {monthlyData.slice(-6).map((m) => (
                      <span key={m.month}>{m.label}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2 text-[11px] font-semibold text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expense
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
