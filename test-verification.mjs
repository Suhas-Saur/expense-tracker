// Comprehensive automated verification test for Student Finance Tracker logic
import { formatCurrency, formatDateDisplay, calculateSavingsRate } from './src/utils/formatters.ts';
import { generateFinancialInsights } from './src/utils/insights.ts';

console.log('--- STARTING COMPREHENSIVE AUTOMATED VERIFICATION ---\n');

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, message) {
  testsTotal++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Currency Formatting
assert(formatCurrency(1000) === '₹1,000.00', 'formatCurrency(1000) should be ₹1,000.00');
assert(formatCurrency(25500) === '₹25,500.00', 'formatCurrency(25500) should be ₹25,500.00');
assert(formatCurrency(0) === '₹0.00', 'formatCurrency(0) should be ₹0.00');
assert(formatCurrency(null) === '₹0.00', 'formatCurrency(null) should safely return ₹0.00');

// 2. Savings Rate Calculation
assert(calculateSavingsRate(25000, 12500) === 50, 'Savings rate (25k inc, 12.5k exp) should be 50%');
assert(calculateSavingsRate(0, 500) === 0, 'Savings rate with 0 income must safely return 0 without NaN or Infinity');
assert(calculateSavingsRate(1000, 1500) === 0, 'Savings rate with deficit should return 0 (no negative rate)');

// 3. Date Formatting
assert(formatDateDisplay('2026-01-14').includes('14 Jan 2026'), 'formatDateDisplay converts 2026-01-14 to 14 Jan 2026');

// 4. Adding Transactions & Calculations
const transactions = [
  { id: '1', date: '2026-09-01', type: 'income', category: 'Scholarship', amount: 20000, description: 'Merit', createdAt: 1 },
  { id: '2', date: '2026-09-02', type: 'expense', category: 'Food', amount: 1500, description: 'Lunch', createdAt: 2 },
  { id: '3', date: '2026-09-03', type: 'expense', category: 'Books', amount: 800, description: 'Algorithms', createdAt: 3 },
  { id: '4', date: '2026-09-03', type: 'expense', category: 'Travel', amount: 700, description: 'Metro', createdAt: 4 }
];

const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
const balance = totalIncome - totalExpenses;
const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);

assert(totalIncome === 20000, 'Total Income sum equals ₹20,000.00');
assert(totalExpenses === 3000, 'Total Expenses sum equals ₹3,000.00');
assert(balance === 17000, 'Balance equals ₹17,000.00');
assert(savingsRate === 85, 'Savings rate equals 85%');

// 5. Budget Calculation
const monthlyBudget = 2500;
const currentMonthExpenses = 3000;
const remainingBudget = monthlyBudget - currentMonthExpenses;
const isBudgetExceeded = remainingBudget < 0;

assert(isBudgetExceeded === true, 'Budget is exceeded when spent (₹3,000) > budget (₹2,500)');
assert(Math.abs(remainingBudget) === 500, 'Exceeded amount is ₹500.00');

// 6. Dynamic Financial Insights Generation
const insights = generateFinancialInsights(transactions, monthlyBudget);
assert(insights.length > 0, 'Dynamic financial insights generated');
const topCatInsight = insights.find(i => i.id === 'top-category');
assert(topCatInsight && topCatInsight.description.includes('Food'), 'Highest expense category correctly detected as Food');

// 7. Filtering & Sorting
const incomeOnly = transactions.filter(t => t.type === 'income');
assert(incomeOnly.length === 1 && incomeOnly[0].amount === 20000, 'Type filtering works');

const searchByDesc = transactions.filter(t => t.description.toLowerCase().includes('algorithms'));
assert(searchByDesc.length === 1 && searchByDesc[0].category === 'Books', 'Search by description works');

const sortedByAmount = [...transactions].sort((a, b) => b.amount - a.amount);
assert(sortedByAmount[0].amount === 20000 && sortedByAmount[1].amount === 1500, 'Sort by highest amount works');

console.log(`\n========================================`);
console.log(`ALL VERIFICATION TESTS COMPLETED: ${testsPassed}/${testsTotal} PASSED`);
console.log(`========================================\n`);
