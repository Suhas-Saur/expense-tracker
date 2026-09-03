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

export const getCategoryStyle = (category: Category) => {
  switch (category) {
    case 'Food':
      return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', iconBg: 'bg-emerald-500 text-white' };
    case 'Travel':
      return { bg: 'bg-amber-50 border-amber-200 text-amber-800', iconBg: 'bg-amber-500 text-white' };
    case 'Books':
      return { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', iconBg: 'bg-indigo-600 text-white' };
    case 'Entertainment':
      return { bg: 'bg-pink-50 border-pink-200 text-pink-700', iconBg: 'bg-pink-500 text-white' };
    case 'Education':
    case 'Scholarship':
      return { bg: 'bg-cyan-50 border-cyan-200 text-cyan-800', iconBg: 'bg-cyan-600 text-white' };
    case 'Shopping':
      return { bg: 'bg-purple-50 border-purple-200 text-purple-800', iconBg: 'bg-purple-500 text-white' };
    case 'Allowance':
    case 'Salary':
    case 'Freelance':
    case 'Part-time Job':
      return { bg: 'bg-teal-50 border-teal-200 text-teal-800', iconBg: 'bg-teal-600 text-white' };
    case 'Healthcare':
      return { bg: 'bg-red-50 border-red-200 text-red-800', iconBg: 'bg-red-500 text-white' };
    default:
      return { bg: 'bg-slate-50 border-slate-200 text-slate-700', iconBg: 'bg-slate-600 text-white' };
  }
};

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onSelectEdit,
}) => {
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
    .slice(0, 5);

  if (recent.length === 0) {
    return null;
  }

  return (
    <div className="mb-10 bg-gradient-to-br from-slate-50 to-indigo-50/20 border-2 border-indigo-100/80 rounded-3xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-indigo-100/80">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-indigo-600 text-white">
            <Clock className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-2">
            <span>Recent Activity</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              Live Feed
            </span>
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Latest {recent.length} logged</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {recent.map((t) => {
          const isIncome = t.type === 'income';
          const catStyle = getCategoryStyle(t.category);

          return (
            <div
              key={t.id}
              onClick={() => onSelectEdit(t)}
              className="bg-white p-3.5 rounded-2xl border-2 border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              title="Click to edit transaction"
            >
              {/* Category Color Accent Strip */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${isIncome ? 'bg-emerald-500' : 'bg-indigo-500'}`} />

              <div className="flex items-start justify-between gap-2 pt-1">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${catStyle.iconBg}`}
                >
                  {getCategoryIcon(t.category)}
                </div>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    isIncome
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {isIncome ? '+ INC' : '- EXP'}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                  {t.description || t.category}
                </p>
                <div className="flex items-baseline justify-between mt-1.5 pt-1.5 border-t border-slate-50">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {formatDateDisplay(t.date).replace(/ \d{4}$/, '')}
                  </span>
                  <span
                    className={`text-xs font-black ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
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
