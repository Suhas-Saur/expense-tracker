// Set today's date as default
document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.max = today; // Prevent future dates

    // Load existing expenses
    loadExpenses();
    loadTotal();
});

// Handle form submission
document.getElementById('expenseForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        date: document.getElementById('date').value,
        category: document.getElementById('category').value,
        amount: document.getElementById('amount').value
    };

    try {
        const response = await fetch('/add_expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showMessage('Expense added successfully! 🎉', 'success');

            // Reset form (except date)
            document.getElementById('category').value = '';
            document.getElementById('amount').value = '';

            // Reload expenses and total
            loadExpenses();
            loadTotal();
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        showMessage('Failed to add expense. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Load all expenses
async function loadExpenses() {
    try {
        const response = await fetch('/get_expenses');
        const result = await response.json();

        const tableBody = document.getElementById('expenseTableBody');

        if (result.success && result.expenses.length > 0) {
            tableBody.innerHTML = '';

            result.expenses.forEach(expense => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(expense.date)}</td>
                    <td>${expense.category}</td>
                    <td>₹${parseFloat(expense.amount).toFixed(2)}</td>
                `;
                row.style.animation = 'fadeIn 0.3s ease';
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr class="no-data"><td colspan="3">No expenses recorded yet</td></tr>';
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

// Load total expenses
async function loadTotal() {
    try {
        const response = await fetch('/get_total');
        const result = await response.json();

        if (result.success) {
            const totalElement = document.getElementById('totalAmount');
            const newTotal = parseFloat(result.total).toFixed(2);

            // Animate number change
            animateValue(totalElement, parseFloat(totalElement.textContent), parseFloat(newTotal), 500);
        }
    } catch (error) {
        console.error('Error loading total:', error);
    }
}

// Show message to user
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

// Animate number changes
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(2);
    }, 16);
}
