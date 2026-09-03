import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet, PiggyBank, Sparkles } from 'lucide-react';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
      {/* 1. Total Income Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/20 border-2 border-emerald-400/40 rounded-3xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Total Income
          </span>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
            {formatCurrency(totalIncome)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-200/50 text-[11px]">
            <span className="text-emerald-700 font-semibold">Inflow Capital</span>
            <span className="bg-emerald-100/90 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Received
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Expenses Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-rose-500/20 border-2 border-rose-400/40 rounded-3xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-400/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-800 tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Total Expenses
          </span>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-2xl sm:text-3xl font-black text-rose-950 tracking-tight">
            {formatCurrency(totalExpenses)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-rose-200/50 text-[11px]">
            <span className="text-rose-700 font-semibold">Total Outflow</span>
            <span className="bg-rose-100/90 text-rose-800 font-bold px-2 py-0.5 rounded-full">
              Spent
            </span>
          </div>
        </div>
      </div>

      {/* 3. Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-indigo-500/20 border-2 border-indigo-400/40 rounded-3xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-800 tracking-wider uppercase flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${balance >= 0 ? 'bg-indigo-500' : 'bg-rose-500'} animate-pulse`} />
            Balance
          </span>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-4">
          <p
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              balance >= 0 ? 'text-indigo-950' : 'text-rose-600'
            }`}
          >
            {formatCurrency(balance)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-indigo-200/50 text-[11px]">
            <span className="text-indigo-700 font-semibold">Net Available</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full ${
                balance >= 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {balance >= 0 ? 'Surplus' : 'Deficit'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Savings Rate Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-fuchsia-500/5 to-purple-500/20 border-2 border-purple-400/40 rounded-3xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-800 tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Savings Rate
          </span>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform">
            <PiggyBank className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
              {savingsRate}%
            </p>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              {savingsRate >= 50 ? '🌟 High' : savingsRate >= 20 ? '👍 Stable' : '⚠️ Alert'}
            </span>
          </div>
          {/* Mini Graphical Bar */}
          <div className="w-full bg-purple-200/60 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${savingsRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
