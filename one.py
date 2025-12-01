balance = 1000

for i in range(100): 
    print("\n===== ATM MENU =====")
    print("1. Check Balance")
    print("2. Deposit Money")
    print("3. Withdraw Money")
    print("4. Exit")

    choice = input("Enter your choice 1-4: ")

    if choice == "1":
        print(f"\nYour current balance is: {balance}")

    elif choice == "2":
        amount = float(input("Enter amount to deposit: "))
        if amount > 0:
            balance += amount
            print(f"Deposited {amount}. New balance: {balance}$")
        else:
            print("Invalid amount!")

    elif choice == "3":
        amount = float(input("Enter amount to withdraw: "))
        if amount > balance:
            print("Insufficient balance!")
        elif amount <= 0:
            print("Invalid amount!")
        else:
            balance -= amount
            print(f"Withdrawn {amount}. New balance: {balance}")

    elif choice == "4":
        print("Thank you for using the ATM. Goodbye!")
        break
    else:
        print("Invalid choice! Enter 1–4.")