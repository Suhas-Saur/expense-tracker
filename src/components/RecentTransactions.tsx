import React from 'react';
import {
  Clock,
  BookOpen,
  Coffee,
  Car,
  Film,
  GraduationCap,
  ShoppingBag,
  Home,
  Receipt,
  Wifi,
  HeartPulse,
  Tv,
  HelpCircle,
  Briefcase,
  Gift,
  Coins,
} from 'lucide-react';
import { Transaction, Category } from '../types/finance';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onSelectEdit: (t: Transaction) => void;
}

export const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'Books':
      return <BookOpen className="w-4 h-4" />;
    case 'Food':
      return <Coffee className="w-4 h-4" />;
    case 'Travel':
      return <Car className="w-4 h-4" />;
    case 'Entertainment':
      return <Film className="w-4 h-4" />;
    case 'Education':
      return <GraduationCap className="w-4 h-4" />;
    case 'Shopping':
      return <ShoppingBag className="w-4 h-4" />;
    case 'Rent':
      return <Home className="w-4 h-4" />;
    case 'Bills':
      return <Receipt className="w-4 h-4" />;
    case 'Mobile/Internet':
      return <Wifi className="w-4 h-4" />;
    case 'Healthcare':
      return <HeartPulse className="w-4 h-4" />;
    case 'Subscriptions':
      return <Tv className="w-4 h-4" />;
    case 'Salary':
    case 'Part-time Job':
      return <Briefcase className="w-4 h-4" />;
    case 'Scholarship':
      return <GraduationCap className="w-4 h-4" />;
    case 'Allowance':
    case 'Freelance':
      return <Coins className="w-4 h-4" />;
    case 'Gift':
      return <Gift className="w-4 h-4" />;
    default:
      return <HelpCircle className="w-4 h-4" />;
  }
};

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onSelectEdit,
}) => {
  // Latest 5 transactions sorted by date descending, then createdAt descending
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
    .slice(0, 5);

  if (recent.length === 0) {
    return null;
  }

  return (
    <div className="mb-10 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm sm:text-base font-bold text-gray-900">
            Recent Transactions (Quick Glance)
          </h3>
        </div>
        <span className="text-xs text-gray-400">Latest {recent.length}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {recent.map((t) => {
          const isIncome = t.type === 'income';
          return (
            <div
              key={t.id}
              onClick={() => onSelectEdit(t)}
              className="bg-white p-3 rounded-xl border border-slate-200/80 hover:border-brand-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              title="Click to edit transaction"
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isIncome
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {getCategoryIcon(t.category)}
                </div>
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-sm ${
                    isIncome
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {isIncome ? '+ INC' : '- EXP'}
                </span>
              </div>

              <div className="mt-2.5">
                <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-brand-600 transition-colors">
                  {t.description || t.category}
                </p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-[11px] text-gray-400">
                    {formatDateDisplay(t.date).replace(/ \d{4}$/, '')}
                  </span>
                  <span
                    className={`text-xs font-extrabold ${
                      isIncome ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
