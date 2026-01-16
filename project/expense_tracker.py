import csv
from datetime import date

print("Expense started")

while True:
    print("\n--- Student Expense Tracker ---")
    print("1. Add Expense")
    print("2. View All Expenses")
    print("3. Show Total Expense")
    print("4. Exit")

    choice = input("Enter your choice (1-4): ")

    if choice == "1":
        expense_date = date.today()
        category = input("Enter category (Food, Travel, etc): ")
        amount = float(input("Enter amount: "))

        with open("expenses.csv", "a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow([expense_date, category, amount])

        print("Expense added successfully")

    elif choice == "2":
        print("\nDate        Category        Amount")
        print("-----------------------------------")

        try:
            with open("expenses.csv", "r") as file:
                reader = csv.reader(file)
                for row in reader:
                    print(f"{row[0]}   {row[1]}   {row[2]}")
        except FileNotFoundError:
            print("No expenses found")

    elif choice == "3":
        total = 0

        try:
            with open("expenses.csv", "r") as file:
                reader = csv.reader(file)
                for row in reader:
                    total += float(row[2])

            print("Total Expense:", total)
        except FileNotFoundError:
            print("No expenses found")

    elif choice == "4":
        print("Exiting program")
        break

    else:
        print("Invalid choice. Try again.")
