import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2, Edit3, Check } from 'lucide-react';
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

  // Determine progress bar color
  let progressColor = 'bg-emerald-500';
  if (actualPercent > 100) {
    progressColor = 'bg-rose-500';
  } else if (actualPercent > 80) {
    progressColor = 'bg-amber-500';
  } else if (actualPercent > 50) {
    progressColor = 'bg-indigo-500';
  }

  return (
    <div className="mb-10 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Monthly Expense Budget</h3>
            <p className="text-xs text-gray-500">Plan and track your spending limit for the current month</p>
          </div>
        </div>

        {/* Edit Budget Controls */}
        <div className="flex items-center gap-2">
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
                  className="w-28 pl-6 pr-2 py-1 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-brand-600"
                  autoFocus
                />
              </div>
              <button
                onClick={handleSave}
                className="px-2.5 py-1 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setBudgetValue(monthlyBudget.toString());
                  setIsEditing(false);
                }}
                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-brand-600 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Adjust Budget</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-gray-500 font-medium">Monthly Budget</span>
          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
            {formatCurrency(monthlyBudget)}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-gray-500 font-medium">Current Month Spent</span>
          <p className="text-lg sm:text-xl font-bold text-rose-600 mt-0.5">
            {formatCurrency(currentMonthExpenses)}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-gray-500 font-medium">
            {isExceeded ? 'Exceeded By' : 'Remaining to Spend'}
          </span>
          <p
            className={`text-lg sm:text-xl font-bold mt-0.5 ${
              isExceeded ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-600">
            {actualPercent}% of budget utilized
          </span>
          {isExceeded ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5" />
              Budget exceeded
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Within budget
            </span>
          )}
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
