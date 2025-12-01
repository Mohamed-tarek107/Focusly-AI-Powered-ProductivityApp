item1 = "Lipstick"
price1 = 120

item2 = "Foundation"
price2 = 350

item3 = "Mascara"
price3 = 200

item4 = "Blush"
price4 = 180

total = 0 

print("Welcome to the Makeup Shop!")
print("Available Products:")
print("1 - Lipstick (120 LE)")
print("2 - Foundation (350 LE)")
print("3 - Mascara (200 LE)")
print("4 - Blush (180 LE)")


for i in range(3):
    choice = int(input("Enter product number (1/2/3/4): "))

    if choice == 1:
        total += price1
        print(f"You added: {item1}")
    elif choice == 2:
        total += price2
        print(f"You added: {item2}")
    elif choice == 3:
        total += price3
        print(f"You added: {item3}")
    elif choice == 4:
        total += price4
        print(f"You added: {item4}")
    else:
        print("Invalid choice!")

print("--------------------")
print(f"Total bill = {total} LE")