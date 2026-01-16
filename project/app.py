from flask import Flask, render_template, request, jsonify
import csv
from datetime import date
import os

app = Flask(__name__)

# Ensure expenses.csv exists
if not os.path.exists('expenses.csv'):
    with open('expenses.csv', 'w', newline='') as file:
        pass

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_expense', methods=['POST'])
def add_expense():
    try:
        data = request.get_json()
        expense_date = data.get('date', str(date.today()))
        category = data.get('category')
        amount = float(data.get('amount'))
        
        # Add expense to CSV
        with open('expenses.csv', 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([expense_date, category, amount])
        
        return jsonify({
            'success': True,
            'message': 'Expense added successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/get_expenses', methods=['GET'])
def get_expenses():
    try:
        expenses = []
        with open('expenses.csv', 'r') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) == 3:  # Valid row
                    expenses.append({
                        'date': row[0],
                        'category': row[1],
                        'amount': float(row[2])
                    })
        return jsonify({
            'success': True,
            'expenses': expenses
        })
    except FileNotFoundError:
        return jsonify({
            'success': True,
            'expenses': []
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/get_total', methods=['GET'])
def get_total():
    try:
        total = 0
        with open('expenses.csv', 'r') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) == 3:
                    total += float(row[2])
        return jsonify({
            'success': True,
            'total': total
        })
    except FileNotFoundError:
        return jsonify({
            'success': True,
            'total': 0
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
