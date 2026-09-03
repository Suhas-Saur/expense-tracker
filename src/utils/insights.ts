import { Transaction } from '../types/finance';
import { formatCurrency } from './formatters';

export interface FinancialInsight {
  id: string;
  type: 'positive' | 'warning' | 'info' | 'tip';
  title: string;
  description: string;
}

export function generateFinancialInsights(
  transactions: Transaction[],
  monthlyBudget: number
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];

  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');

  if (transactions.length === 0) {
    return [];
  }

  // 1. Highest Expense Category
  if (expenses.length > 0) {
    const categoryTotals: Record<string, number> = {};
    let totalExpense = 0;

    expenses.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      totalExpense += t.amount;
    });

    let highestCat = '';
    let highestAmount = 0;

    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCat = cat;
      }
    });

    if (highestCat && totalExpense > 0) {
      const percentage = Math.round((highestAmount / totalExpense) * 100);
      insights.push({
        id: 'top-category',
        type: 'info',
        title: 'Top Spending Category',
        description: `${highestCat} is your highest expense category, taking ${percentage}% (${formatCurrency(
          highestAmount
        )}) of your total spending.`,
      });
    }
  }

  // 2. Current Month Spending & Savings
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthExpenses = expenses
    .filter((t) => t.date.startsWith(currentYearMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthIncome = incomes
    .filter((t) => t.date.startsWith(currentYearMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  if (currentMonthExpenses > 0) {
    insights.push({
      id: 'month-expense',
      type: 'info',
      title: 'Current Month Spending',
      description: `You have spent ${formatCurrency(currentMonthExpenses)} so far this month.`,
    });
  }

  if (currentMonthIncome > 0) {
    const netSavings = currentMonthIncome - currentMonthExpenses;
    if (netSavings > 0) {
      insights.push({
        id: 'month-savings',
        type: 'positive',
        title: 'Net Monthly Savings',
        description: `You saved ${formatCurrency(netSavings)} this month (${Math.round(
          (netSavings / currentMonthIncome) * 100
        )}% savings rate). Great job!`,
      });
    } else if (netSavings < 0) {
      insights.push({
        id: 'month-deficit',
        type: 'warning',
        title: 'Spending Exceeded Income',
        description: `Your expenses exceeded income by ${formatCurrency(
          Math.abs(netSavings)
        )} this month. Consider reviewing non-essential spending.`,
      });
    }
  }

  // 3. Budget Status
  if (monthlyBudget > 0) {
    const budgetUsedPercent = Math.round((currentMonthExpenses / monthlyBudget) * 100);
    if (budgetUsedPercent > 100) {
      insights.push({
        id: 'budget-exceeded',
        type: 'warning',
        title: 'Budget Alert',
        description: `Budget exceeded! You have spent ${formatCurrency(
          currentMonthExpenses - monthlyBudget
        )} over your monthly target of ${formatCurrency(monthlyBudget)}.`,
      });
    } else {
      insights.push({
        id: 'budget-tracking',
        type: budgetUsedPercent > 80 ? 'warning' : 'positive',
        title: 'Budget Utilization',
        description: `You are using ${budgetUsedPercent}% of your monthly budget (${formatCurrency(
          monthlyBudget - currentMonthExpenses
        )} remaining).`,
      });
    }
  }

  // 4. Daily average spending
  if (expenses.length >= 3) {
    const dates = Array.from(new Set(expenses.map((e) => e.date)));
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgPerActiveDay = Math.round(totalSpent / dates.length);

    insights.push({
      id: 'daily-average',
      type: 'tip',
      title: 'Average Daily Outflow',
      description: `Your average spending across active transaction days is ${formatCurrency(
        avgPerActiveDay
      )}.`,
    });
  }

  return insights;
}
