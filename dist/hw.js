"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class Item {
    constructor(name, price, description) {
        this._id = (0, uuid_1.v4)();
        this._name = name;
        this._price = price;
        this._description = description;
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get price() { return this._price; }
    get description() { return this._description; }
    set id(value) { this._id = value; }
    set name(value) { this._name = value; }
    set price(value) { this._price = value; }
    set description(value) { this._description = value; }
}
class User {
    constructor(id, name, age, cart) {
        this._id = id;
        this._name = name;
        this._age = age;
        this._cart = cart;
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get age() { return this._age; }
    get cart() { return this._cart; }
    set id(value) { this._id = value; }
    set name(value) { this._name = value; }
    set age(value) { this._age = value; }
    set cart(value) { this._cart = value; }
    addToCart(item, quantity, shop) {
        const availableQuantity = shop.sellItem(item, quantity);
        if (availableQuantity) {
            const existingIndex = this._cart.findIndex(cartItem => cartItem.item.id === item.id);
            if (existingIndex !== -1) {
                this._cart[existingIndex].quantity += quantity;
            }
            else {
                this._cart.push({ item, quantity });
            }
        }
        else {
            console.log(`Not enough stock for ${item.name}!`);
        }
    }
    removeFromCart(item) {
        const updatedCart = this._cart.filter(cartItem => cartItem.item.id !== item.id);
        this._cart = updatedCart;
    }
    removeCartQuantity(item, quantity) {
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
    constructor(stock) {
        this._stock = stock;
    }
    get stock() { return this._stock; }
    set stock(value) { this._stock = value; }
    addToStock(item, quantity) {
        const existingItemIndex = this._stock.findIndex(stockItem => stockItem.item.id === item.id);
        if (existingItemIndex !== -1) {
            this._stock[existingItemIndex].quantity += quantity;
        }
        else {
            this._stock.push({ item, quantity });
        }
    }
    sellItem(item, quantity) {
        const existingItem = this._stock.find(stockItem => stockItem.item.id === item.id);
        if (existingItem && existingItem.quantity >= quantity) {
            existingItem.quantity -= quantity;
            return true;
        }
        return false;
    }
    logStock() {
        console.log('Shop Stock:');
        this.stock.forEach((stockItem) => {
            console.log(`Name: ${stockItem.item.name}, Description: ${stockItem.item.description}, Quantity: ${stockItem.quantity}`);
        });
    }
}
function createUser(name, age, cart = []) { return new User((0, uuid_1.v4)(), name, age, cart); }
function createItem(name, price, description) { return new Item(name, price, description); }
function cartTotal(user) {
    let total = 0;
    for (const cartItem of user.cart) {
        const { item, quantity } = cartItem;
        total += item.price * quantity;
    }
    return total;
}
function printCart(user) {
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
