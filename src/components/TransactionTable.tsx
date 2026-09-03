import React from 'react';
import { Trash2, Edit2, AlertCircle } from 'lucide-react';
import { Transaction } from '../types/finance';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { getCategoryIcon } from './RecentTransactions';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDeleteRequest: (transaction: Transaction) => void;
  onClearAllRequest: () => void;
  filterType: 'all' | 'income' | 'expense';
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDeleteRequest,
  onClearAllRequest,
  filterType,
}) => {
  // Calculate displayed total for bottom banner
  const displayedExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const displayedIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const netTotal = filterType === 'income' ? displayedIncome : displayedExpenses;
  const bannerTitle =
    filterType === 'income'
      ? 'Total Income'
      : filterType === 'expense'
      ? 'Total Expenses'
      : 'Total Expenses';

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {filterType === 'income'
              ? 'Your Income'
              : filterType === 'expense'
              ? 'Your Expenses'
              : 'Your Transactions'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Full ledger of recorded transactions with quick edit and deletion
          </p>
        </div>

        {/* Clear All Button matching Screenshot 2 */}
        {transactions.length > 0 && (
          <button
            onClick={onClearAllRequest}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            title="Clear all currently displayed transactions"
          >
            <span>Clear All</span>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Table Container */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            {/* Header bar matching screenshot (#5e6cf5 blue/violet) */}
            <thead>
              <tr className="bg-[#5e6cf5] text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {transactions.length === 0 ? (
                /* Empty state matching Screenshot 1 */
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <AlertCircle className="w-7 h-7 mb-2 stroke-1 text-gray-300" />
                      <p className="text-sm italic font-normal text-gray-500">
                        {filterType === 'expense'
                          ? 'No expenses recorded yet'
                          : filterType === 'income'
                          ? 'No income recorded yet'
                          : 'No transactions recorded yet'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((t) => {
                  const isIncome = t.type === 'income';
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/80 transition-colors group text-gray-700"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs font-medium text-gray-900 whitespace-nowrap">
                        {formatDateDisplay(t.date)}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isIncome
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isIncome ? 'Income' : 'Expense'}
                        </span>
                      </td>

                      {/* Category with Icon */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-1 rounded-md ${
                              isIncome
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-brand-50 text-brand-600'
                            }`}
                          >
                            {getCategoryIcon(t.category)}
                          </span>
                          <span className="font-semibold text-xs text-gray-800">
                            {t.category}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 text-xs text-gray-600 max-w-[200px] truncate">
                        {t.description || '-'}
                      </td>

                      {/* Amount */}
                      <td
                        className={`py-3.5 px-4 text-xs font-bold text-right whitespace-nowrap ${
                          isIncome ? 'text-emerald-600' : 'text-gray-900'
                        }`}
                      >
                        {isIncome ? '+' : ''}
                        {formatCurrency(t.amount)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onEdit(t)}
                            className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Edit transaction"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRequest(t)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Summary Banner matching Screenshot 1, 2, 3 */}
      <div className="bg-gradient-to-r from-[#5e6cf5] to-[#4c4ce0] text-white rounded-2xl p-5 sm:p-6 shadow-md flex items-center justify-between">
        <div>
          <span className="text-sm sm:text-base font-semibold text-indigo-100 tracking-wide">
            {bannerTitle}
          </span>
          <p className="text-xs text-indigo-200/80 mt-0.5">
            {filterType === 'all'
              ? 'Aggregated expenses across filtered transactions'
              : 'Total sum of selected category view'}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {formatCurrency(netTotal)}
          </p>
        </div>
      </div>
    </div>
  );
};
