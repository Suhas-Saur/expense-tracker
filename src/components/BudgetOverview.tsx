import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2, Edit3, Check, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface BudgetOverviewProps {
  monthlyBudget: number;
  currentMonthExpenses: number;
  onUpdateBudget: (newBudget: number) => void;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  monthlyBudget,
  currentMonthExpenses,
  onUpdateBudget,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetValue, setBudgetValue] = useState(monthlyBudget.toString());

  const handleSave = () => {
    const parsed = parseFloat(budgetValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateBudget(parsed);
      setIsEditing(false);
    }
  };

  const remaining = monthlyBudget - currentMonthExpenses;
  const isExceeded = remaining < 0;
  const percentUsed =
    monthlyBudget > 0 ? Math.min(100, Math.round((currentMonthExpenses / monthlyBudget) * 100)) : 0;
  const actualPercent =
    monthlyBudget > 0 ? Math.round((currentMonthExpenses / monthlyBudget) * 100) : 0;

  // Determine progress bar gradient
  let progressGradient = 'from-teal-400 via-emerald-500 to-green-500';
  let barBorder = 'border-emerald-300';
  if (actualPercent > 100) {
    progressGradient = 'from-amber-500 via-rose-500 to-red-600';
    barBorder = 'border-rose-300';
  } else if (actualPercent > 80) {
    progressGradient = 'from-amber-400 via-orange-500 to-amber-600';
    barBorder = 'border-amber-300';
  } else if (actualPercent > 50) {
    progressGradient = 'from-indigo-400 via-blue-500 to-teal-500';
    barBorder = 'border-indigo-300';
  }

  return (
    <div className="mb-10 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 border-2 border-indigo-100 rounded-3xl p-5 sm:p-7 shadow-sm">
      {/* Top Title & Edit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Target className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <span>Monthly Expense Budget</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Active Plan
              </span>
            </h3>
            <p className="text-xs text-gray-500">Track and safeguard your target student spend limits</p>
          </div>
        </div>

        {/* Edit Budget Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-gray-500 font-semibold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={budgetValue}
                  onChange={(e) => setBudgetValue(e.target.value)}
                  className="w-28 pl-6 pr-2 py-1.5 text-xs border-2 border-indigo-400 rounded-xl bg-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setBudgetValue(monthlyBudget.toString());
                  setIsEditing(false);
                }}
                className="px-2 py-1 text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setBudgetValue(monthlyBudget.toString());
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-200 rounded-xl shadow-xs hover:bg-indigo-50/50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Change Budget</span>
            </button>
          )}
        </div>
      </div>

      {/* Graphical Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Budget Target</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
            {formatCurrency(monthlyBudget)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-rose-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">Spent This Month</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
            {formatCurrency(currentMonthExpenses)}
          </p>
        </div>

        <div className={`p-4 rounded-2xl border-2 shadow-2xs bg-white ${isExceeded ? 'border-red-200' : 'border-emerald-100'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isExceeded ? 'text-red-600' : 'text-emerald-700'}`}>
              {isExceeded ? 'Budget Exceeded' : 'Remaining to Spend'}
            </span>
            {isExceeded ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <p
            className={`text-xl sm:text-2xl font-black mt-1 ${
              isExceeded ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      </div>

      {/* Graphical Progress Bar & Status */}
      <div className="space-y-2 bg-white/80 p-4 rounded-2xl border border-indigo-100/80">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-gray-800 text-sm">
              {actualPercent}%
            </span>
            <span className="text-gray-500 font-medium">budget utilized</span>
          </div>
          {isExceeded ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-700 bg-red-100 px-3 py-1 rounded-full border border-red-300 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Budget exceeded
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Safe Spending Pace
            </span>
          )}
        </div>

        {/* Vibrant Gradient Bar */}
        <div className={`w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border ${barBorder}`}>
          <div
            className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${progressGradient} shadow-inner`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
