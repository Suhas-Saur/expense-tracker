import React from 'react';
import { Search, Filter, ArrowUpDown, XCircle } from 'lucide-react';
import { FilterState, SortOption } from '../types/finance';

interface TransactionFiltersProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  availableCategories: string[];
  totalMatches: number;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filter,
  onFilterChange,
  availableCategories,
  totalMatches,
}) => {
  const handleTypeChange = (type: FilterState['type']) => {
    onFilterChange({ ...filter, type });
  };

  const handleResetFilters = () => {
    onFilterChange({
      type: 'all',
      category: '',
      startDate: '',
      endDate: '',
      searchQuery: '',
      sortBy: 'newest',
    });
  };

  const isFiltered =
    filter.type !== 'all' ||
    filter.category !== '' ||
    filter.startDate !== '' ||
    filter.endDate !== '' ||
    filter.searchQuery.trim() !== '' ||
    filter.sortBy !== 'newest';

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-4">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => handleTypeChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter.type === 'all'
                ? 'bg-brand-600 text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => handleTypeChange('income')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter.type === 'income'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => handleTypeChange('expense')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter.type === 'expense'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Expenses
          </button>
        </div>

        {/* Results indicator & Reset */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-800">{totalMatches}</strong> transaction
            {totalMatches === 1 ? '' : 's'}
          </span>
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Live Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search category, note, amount..."
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-600 text-gray-800"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filter.category}
            onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-600 text-gray-800 appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Start & End */}
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            placeholder="From"
            value={filter.startDate}
            onChange={(e) => onFilterChange({ ...filter, startDate: e.target.value })}
            className="w-1/2 px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-600 text-gray-800"
            title="Start date"
          />
          <span className="text-gray-400 text-xs">-</span>
          <input
            type="date"
            placeholder="To"
            value={filter.endDate}
            onChange={(e) => onFilterChange({ ...filter, endDate: e.target.value })}
            className="w-1/2 px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-600 text-gray-800"
            title="End date"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="relative">
          <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filter.sortBy}
            onChange={(e) =>
              onFilterChange({ ...filter, sortBy: e.target.value as SortOption })
            }
            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-600 text-gray-800 appearance-none cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="highest">Sort: Highest Amount</option>
            <option value="lowest">Sort: Lowest Amount</option>
          </select>
        </div>
      </div>
    </div>
  );
};
