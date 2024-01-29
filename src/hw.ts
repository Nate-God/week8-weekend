import { v4 as uuidv4 } from 'uuid';

class Item {
    private _id: string = uuidv4();
    private _name: string;
    private _price: number;
    private _description: string;

    constructor(name: string, price: number, description: string) {
        this._name = name;
        this._price = price;
        this._description = description;
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get price(): number { return this._price; }
    get description(): string { return this._description; }

    set id(value: string) { this._id = value; }
    set name(value: string) { this._name = value; }
    set price(value: number) { this._price = value; }
    set description(value: string) { this._description = value; }
}

class User {
    private _id: string;
    private _name: string;
    private _age: number;
    private _cart: { item: Item, quantity: number }[];

    constructor(id: string, name: string, age: number, cart: { item: Item, quantity: number }[]) {
        this._id = id;
        this._name = name;
        this._age = age;
        this._cart = cart;
    }

    public get id(): string { return this._id; }
    public get name(): string { return this._name; }
    public get age(): number { return this._age; }
    public get cart(): { item: Item, quantity: number }[] { return this._cart; }

    public set id(value: string) { this._id = value; }
    public set name(value: string) { this._name = value; }
    public set age(value: number) { this._age = value; }
    public set cart(value: { item: Item, quantity: number }[]) { this._cart = value; }

    addToCart(item: Item, quantity: number, shop: Shop): void {
        const availableQuantity = shop.sellItem(item, quantity);

        if (availableQuantity) {
            const existingIndex = this._cart.findIndex(cartItem => cartItem.item.id === item.id);

            if (existingIndex !== -1) {
                this._cart[existingIndex].quantity += quantity;
            } else {
                this._cart.push({ item, quantity });
            }
        } else {
            console.log(`Not enough stock for ${item.name}!`);
        }
    }

    removeFromCart(item: Item): void {
        const updatedCart = this._cart.filter(cartItem => cartItem.item.id !== item.id);
        this._cart = updatedCart;
    }

    removeCartQuantity(item: Item, quantity: number): void {
        const index = this._cart.findIndex(cartItem => cartItem.item.id === item.id);

        if (index !== -1) {
            this._cart[index].quantity -= quantity;

            if (this._cart[index].quantity <= 0) {
                this._cart.splice(index, 1);
            }
        }
    }
}

class Shop {
    private _stock: { item: Item, quantity: number }[];

    constructor(stock: { item: Item, quantity: number }[]) {
        this._stock = stock;
    }

    public get stock(): { item: Item, quantity: number }[] { return this._stock; }
    public set stock(value: { item: Item, quantity: number }[]) { this._stock = value; }

    addToStock(item: Item, quantity: number): void {
        const existingItemIndex = this._stock.findIndex(stockItem => stockItem.item.id === item.id);

        if (existingItemIndex !== -1) {
            this._stock[existingItemIndex].quantity += quantity;
        } else {
            this._stock.push({ item, quantity });
        }
    }

    sellItem(item: Item, quantity: number): boolean {
        const existingItem = this._stock.find(stockItem => stockItem.item.id === item.id);

        if (existingItem && existingItem.quantity >= quantity) {
            existingItem.quantity -= quantity;
            return true;
        }

        return false;
    }

    logStock(): void {
        console.log('Shop Stock:');
        this.stock.forEach((stockItem) => {
            console.log(`Name: ${stockItem.item.name}, Description: ${stockItem.item.description}, Quantity: ${stockItem.quantity}`);
        });
    }
}

function createUser(name: string, age: number, cart: { item: Item, quantity: number }[] = []): User {
    return new User(uuidv4(), name, age, cart);
}

function createItem(name: string, price: number, description: string): Item {
    return new Item(name, price, description);
}

function cartTotal(user: User): number {
    let total = 0;

    for (const cartItem of user.cart) {
        const { item, quantity } = cartItem;
        total += item.price * quantity;
    }

    return total;
}

function printCart(user: User): void {
    console.log('Cart contents:');
    user.cart.forEach((cartItem) => {
        const { item, quantity } = cartItem;
        console.log(`${item.name} (Quantity: ${quantity}) - $${item.price * quantity}`);
    });
    console.log('Cart Total:', cartTotal(user));
}

// Driver Code
const user = createUser('Brian Stodder', 55);
const itemA = createItem('apple', 1, "default fruit, is it called 'apple' because it's the best fruit? or is the best fruit because it's called 'apple'");
const itemB = createItem('pears', 2, 'like peaches but better');
const itemC = createItem('orange', 3, 'the fruit came first');

const shop = new Shop([]);

shop.addToStock(itemA, 10);
shop.addToStock(itemB, 11);
shop.addToStock(itemC, 12);

shop.logStock();

console.log("Adding items to the cart:");
user.addToCart(itemA, 1, shop);
user.addToCart(itemB, 3, shop);
user.addToCart(itemC, 3, shop);

console.log('After adding items to the cart:');
printCart(user);
shop.logStock();

console.log("Removing all instances of Item B from the cart:");
user.removeFromCart(itemB);
printCart(user);

shop.logStock();

console.log("Removing 2 instances of Item C from the cart:");
user.removeCartQuantity(itemC, 2);
printCart(user);

shop.logStock();