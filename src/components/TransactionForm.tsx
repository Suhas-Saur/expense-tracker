import React, { useState, useEffect } from 'react';
import { PlusCircle, Check, X, Calendar, Tag, IndianRupee, FileText } from 'lucide-react';
import {
  Transaction,
  TransactionType,
  IncomeCategory,
  ExpenseCategory,
  Category,
} from '../types/finance';
import { getTodayDateString } from '../utils/formatters';

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Scholarship',
  'Allowance',
  'Salary',
  'Freelance',
  'Part-time Job',
  'Gift',
  'Other Income',
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Travel',
  'Education',
  'Books',
  'Entertainment',
  'Shopping',
  'Rent',
  'Bills',
  'Mobile/Internet',
  'Healthcare',
  'Subscriptions',
  'Other',
];

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onUpdateTransaction: (id: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
  onCancelEdit,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [category, setCategory] = useState<Category>('Food');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});

  // Synchronize when editingTransaction changes
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setDate(editingTransaction.date);
      setCategory(editingTransaction.category);
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description);
      setErrors({});
    } else {
      // Reset defaults
      setType('expense');
      setDate(getTodayDateString());
      setCategory('Food');
      setAmount('');
      setDescription('');
      setErrors({});
    }
  }, [editingTransaction]);

  // When type toggles, reset category to first available if not valid
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      if (!INCOME_CATEGORIES.includes(category as IncomeCategory)) {
        setCategory(INCOME_CATEGORIES[0]);
      }
    } else {
      if (!EXPENSE_CATEGORIES.includes(category as ExpenseCategory)) {
        setCategory(EXPENSE_CATEGORIES[0]);
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: { amount?: string; category?: string } = {};
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(parseFloat(amount).toFixed(2));

    if (editingTransaction) {
      onUpdateTransaction(editingTransaction.id, {
        type,
        date: date || getTodayDateString(),
        category,
        amount: parsedAmount,
        description: description.trim() || `${category} ${type}`,
      });
    } else {
      onAddTransaction({
        type,
        date: date || getTodayDateString(),
        category,
        amount: parsedAmount,
        description: description.trim() || `${category} ${type}`,
      });

      // Clear input fields
      setAmount('');
      setDescription('');
      setErrors({});
    }
  };

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div id="transaction-form-section" className="mb-10">
      {/* Section Header with Subtle Accent Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</span>
            {editingTransaction && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Editing Mode
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Log your earnings or spendings to keep your financial metrics current
          </p>
        </div>

        {/* Transaction Type Segmented Switcher */}
        <div className="mt-3 sm:mt-0 inline-flex bg-gray-100 p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Expense (-)
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Income (+)
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 transition-colors shadow-sm"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 transition-colors shadow-sm"
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-rose-600 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Amount (₹) Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
              <span>Amount (₹)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 font-semibold text-sm">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
                className={`w-full pl-8 pr-3.5 py-2.5 bg-white border rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 transition-colors shadow-sm ${
                  errors.amount
                    ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20'
                    : 'border-gray-300 focus:ring-brand-600 focus:border-brand-600'
                }`}
                required
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-rose-600 mt-1">{errors.amount}</p>
            )}
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span>Description / Note (Optional)</span>
          </label>
          <input
            type="text"
            placeholder={
              type === 'expense'
                ? 'e.g., Data structures book, Cafeteria lunch, Metro recharge'
                : 'e.g., Monthly allowance from parents, Freelance gig, Merit stipend'
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 transition-colors shadow-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {editingTransaction ? (
              <>
                <Check className="w-4 h-4" />
                <span>Update Transaction</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>{type === 'expense' ? 'Add Expense +' : 'Add Income +'}</span>
              </>
            )}
          </button>

          {editingTransaction && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-5 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4 text-gray-500" />
              <span>Cancel Edit</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
