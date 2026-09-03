import React, { useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  FilterState,
} from './types/finance';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { BudgetOverview } from './components/BudgetOverview';
import { AnalyticsSection } from './components/AnalyticsSection';
import { FinancialInsights } from './components/FinancialInsights';
import { RecentTransactions } from './components/RecentTransactions';
import { TransactionFilters } from './components/TransactionFilters';
import { TransactionTable } from './components/TransactionTable';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';
import { SAMPLE_TRANSACTIONS } from './utils/sampleData';
import { generateFinancialInsights } from './utils/insights';

const STORAGE_KEY_TRANSACTIONS = 'student_finance_transactions_v1';
const STORAGE_KEY_BUDGET = 'student_finance_budget_v1';
const DEFAULT_BUDGET = 15000;

export const App: React.FC = () => {
  // 1. Transactions State with Safe LocalStorage Hydration
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load transactions from localStorage:', e);
    }
    // Default to sample transactions so user immediately sees populated charts
    return SAMPLE_TRANSACTIONS;
  });

  // 2. Budget State
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BUDGET);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load budget from localStorage:', e);
    }
    return DEFAULT_BUDGET;
  });

  // 3. UI State
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 4. Filtering & Sorting State
  const [filter, setFilter] = useState<FilterState>({
    type: 'all',
    category: '',
    startDate: '',
    endDate: '',
    searchQuery: '',
    sortBy: 'newest',
  });

  // Persist Transactions to LocalStorage safely
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage:', e);
    }
  }, [transactions]);

  // Persist Budget to LocalStorage safely
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUDGET, monthlyBudget.toString());
    } catch (e) {
      console.error('Failed to save budget to localStorage:', e);
    }
  }, [monthlyBudget]);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Transaction Handlers
  const handleAddTransaction = (
    data: Omit<Transaction, 'id' | 'createdAt'>
  ) => {
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    addToast(
      'success',
      `${data.type === 'income' ? 'Income' : 'Expense'} of ₹${data.amount.toFixed(
        2
      )} added successfully!`
    );
  };

  const handleUpdateTransaction = (
    id: string,
    data: Omit<Transaction, 'id' | 'createdAt'>
  ) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    setEditingTransaction(null);
    addToast('success', 'Transaction updated successfully!');
  };

  const handleStartEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    const formEl = document.getElementById('transaction-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setTransactions((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      addToast('info', 'Transaction deleted');
      setDeleteTarget(null);
    }
  };

  const handleClearAllConfirm = () => {
    setTransactions([]);
    setIsClearAllModalOpen(false);
    addToast('info', 'All transactions have been cleared');
  };

  const handleLoadSampleData = () => {
    setTransactions(SAMPLE_TRANSACTIONS);
    setMonthlyBudget(DEFAULT_BUDGET);
    addToast('success', 'Loaded sample student transactions!');
  };

  const handleResetData = () => {
    setIsClearAllModalOpen(true);
  };

  const handleExportData = () => {
    try {
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(transactions, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `student-finances-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('success', 'Exported transactions as JSON backup');
    } catch (e) {
      console.error(e);
      addToast('error', 'Failed to export data');
    }
  };

  // Calculations
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  // Current month expenses for budget calculations
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(currentYearMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Automated Financial Insights
  const financialInsights = useMemo(
    () => generateFinancialInsights(transactions, monthlyBudget),
    [transactions, monthlyBudget]
  );

  // Categories list for filter dropdown
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set).sort();
  }, [transactions]);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Filter by Type
        if (filter.type !== 'all' && t.type !== filter.type) return false;

        // Filter by Category
        if (filter.category && t.category !== filter.category) return false;

        // Filter by Date Range
        if (filter.startDate && t.date < filter.startDate) return false;
        if (filter.endDate && t.date > filter.endDate) return false;

        // Live Search: checks category, description, and amount
        if (filter.searchQuery.trim()) {
          const query = filter.searchQuery.toLowerCase();
          const matchCat = t.category.toLowerCase().includes(query);
          const matchDesc = t.description.toLowerCase().includes(query);
          const matchAmt = t.amount.toString().includes(query);
          if (!matchCat && !matchDesc && !matchAmt) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filter.sortBy) {
          case 'oldest':
            return a.date.localeCompare(b.date) || a.createdAt - b.createdAt;
          case 'highest':
            return b.amount - a.amount;
          case 'lowest':
            return a.amount - b.amount;
          case 'newest':
          default:
            return b.date.localeCompare(a.date) || b.createdAt - a.createdAt;
        }
      });
  }, [transactions, filter]);

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <Header
        onLoadSampleData={handleLoadSampleData}
        onResetData={handleResetData}
        onExportData={handleExportData}
        hasTransactions={transactions.length > 0}
      />

      {/* Main White Rounded Container Matching Screenshots */}
      <main className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10 border border-white/40">
        {/* 1. Dashboard Summary: 4 Top Cards */}
        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />

        {/* 2. Add / Edit Transaction Form */}
        <TransactionForm
          onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          editingTransaction={editingTransaction}
          onCancelEdit={handleCancelEdit}
        />

        {/* 3. Budget Overview Section */}
        <BudgetOverview
          monthlyBudget={monthlyBudget}
          currentMonthExpenses={currentMonthExpenses}
          onUpdateBudget={setMonthlyBudget}
        />

        {/* 4. Analytics Section (Category Donut & Daily Expenses Bar Chart) */}
        <AnalyticsSection transactions={transactions} />

        {/* 5. Financial Insights Engine */}
        <FinancialInsights insights={financialInsights} />

        {/* 6. Recent Transactions Quick Glance */}
        <RecentTransactions
          transactions={transactions}
          onSelectEdit={handleStartEdit}
        />

        {/* 7. Filtering, Search & Sorting Controls */}
        <TransactionFilters
          filter={filter}
          onFilterChange={setFilter}
          availableCategories={availableCategories}
          totalMatches={filteredTransactions.length}
        />

        {/* 8. Full Transaction Table & Bottom Total Banner */}
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleStartEdit}
          onDeleteRequest={(t) => setDeleteTarget(t)}
          onClearAllRequest={() => setIsClearAllModalOpen(true)}
          filterType={filter.type}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Transaction"
        message={`Are you sure you want to delete this ${deleteTarget?.type} of ₹${deleteTarget?.amount.toFixed(
          2
        )} (${deleteTarget?.category})? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Clear All Confirmation Modal */}
      <ConfirmModal
        isOpen={isClearAllModalOpen}
        title="Clear All Transactions"
        message="Are you sure you want to delete all recorded transactions? All income and expense records will be permanently removed."
        confirmLabel="Clear Everything"
        onConfirm={handleClearAllConfirm}
        onCancel={() => setIsClearAllModalOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
