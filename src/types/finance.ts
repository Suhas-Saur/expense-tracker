export type TransactionType = 'income' | 'expense';

export type IncomeCategory =
  | 'Salary'
  | 'Scholarship'
  | 'Allowance'
  | 'Freelance'
  | 'Part-time Job'
  | 'Gift'
  | 'Other Income';

export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Education'
  | 'Books'
  | 'Entertainment'
  | 'Shopping'
  | 'Rent'
  | 'Bills'
  | 'Mobile/Internet'
  | 'Healthcare'
  | 'Subscriptions'
  | 'Other';

export type Category = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: Category;
  amount: number;
  description: string;
  createdAt: number;
}

export interface BudgetConfig {
  monthlyBudget: number; // e.g. 15000
}

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface FilterState {
  type: 'all' | 'income' | 'expense';
  category: string;
  startDate: string;
  endDate: string;
  searchQuery: string;
  sortBy: SortOption;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
}
