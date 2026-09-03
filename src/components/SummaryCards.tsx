import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet, PiggyBank } from 'lucide-react';
import { formatCurrency, calculateSavingsRate } from '../utils/formatters';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalIncome,
  totalExpenses,
}) => {
  const balance = totalIncome - totalExpenses;
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Income Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-100 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-emerald-800 tracking-wide uppercase">
            Total Income
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-xs text-emerald-600/80 mt-1 font-medium">
            Money received & earned
          </p>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50/40 border border-rose-100 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-rose-800 tracking-wide uppercase">
            Total Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-700 tracking-tight">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-xs text-rose-600/80 mt-1 font-medium">
            Total money spent
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50/40 border border-indigo-100 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-indigo-800 tracking-wide uppercase">
            Balance
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <Wallet className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-3">
          <p
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              balance >= 0 ? 'text-indigo-900' : 'text-rose-600'
            }`}
          >
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-indigo-600/80 mt-1 font-medium">
            {balance >= 0 ? 'Available surplus funds' : 'Current deficit'}
          </p>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="bg-gradient-to-br from-purple-50 to-violet-50/40 border border-purple-100 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-purple-800 tracking-wide uppercase">
            Savings Rate
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <PiggyBank className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-900 tracking-tight">
            {savingsRate}%
          </p>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            {savingsRate >= 50 ? 'Excellent' : savingsRate > 20 ? 'Good' : 'Needs attention'}
          </span>
        </div>
        <p className="text-xs text-purple-600/80 mt-1 font-medium">
          {totalIncome > 0 ? 'Of total income preserved' : 'Add income to calculate'}
        </p>
      </div>
    </div>
  );
};
