'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
    filterProducts,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    calculateCartCount,
    calculateCartTotal,
    sanitizeStoredCart,
} = require('../cart-logic.js');

const products = [
    { id: 1, title: 'Shirt', category: 'men', price: 10 },
    { id: 2, title: 'Dress', category: 'women', price: 20 },
    { id: 3, title: 'Bag', category: 'accessories', price: 30 },
];

describe('filterProducts', () => {
    test('"all" returns every product', () => {
        assert.deepEqual(filterProducts(products, 'all'), products);
    });

    test('filters down to a single category', () => {
        assert.deepEqual(filterProducts(products, 'men'), [products[0]]);
    });

    test('a category with no matches returns an empty array', () => {
        assert.deepEqual(filterProducts(products, 'nonexistent'), []);
    });
});

describe('addItemToCart', () => {
    test('adding a new product creates an entry with quantity 1', () => {
        const cart = addItemToCart([], products[0]);
        assert.deepEqual(cart, [{ ...products[0], quantity: 1 }]);
    });

    test('adding the same product again increments its quantity instead of duplicating it', () => {
        const cart = addItemToCart([{ ...products[0], quantity: 1 }], products[0]);
        assert.equal(cart.length, 1);
        assert.equal(cart[0].quantity, 2);
    });

    test('does not mutate the cart array it was given', () => {
        const original = [{ ...products[0], quantity: 1 }];
        const frozenOriginal = JSON.parse(JSON.stringify(original));
        addItemToCart(original, products[1]);
        assert.deepEqual(original, frozenOriginal);
    });
});

describe('updateItemQuantity', () => {
    test('increases quantity', () => {
        const cart = [{ ...products[0], quantity: 1 }];
        assert.equal(updateItemQuantity(cart, 1, 1)[0].quantity, 2);
    });

    test('decreases quantity', () => {
        const cart = [{ ...products[0], quantity: 2 }];
        assert.equal(updateItemQuantity(cart, 1, -1)[0].quantity, 1);
    });

    test('dropping to zero removes the item entirely, rather than leaving a 0-quantity row', () => {
        const cart = [{ ...products[0], quantity: 1 }];
        assert.deepEqual(updateItemQuantity(cart, 1, -1), []);
    });

    test('a negative change can never leave a negative-quantity item behind', () => {
        const cart = [{ ...products[0], quantity: 1 }];
        assert.deepEqual(updateItemQuantity(cart, 1, -5), []);
    });

    test('an id not present in the cart leaves it unchanged', () => {
        const cart = [{ ...products[0], quantity: 1 }];
        assert.deepEqual(updateItemQuantity(cart, 999, 1), cart);
    });
});

describe('removeItemFromCart', () => {
    test('removes only the matching item', () => {
        const cart = [{ ...products[0], quantity: 1 }, { ...products[1], quantity: 1 }];
        assert.deepEqual(removeItemFromCart(cart, 1), [{ ...products[1], quantity: 1 }]);
    });

    test('removing an id that is not in the cart is a no-op', () => {
        const cart = [{ ...products[0], quantity: 1 }];
        assert.deepEqual(removeItemFromCart(cart, 999), cart);
    });
});

describe('calculateCartCount', () => {
    test('sums quantities, not number of distinct items', () => {
        const cart = [{ ...products[0], quantity: 3 }, { ...products[1], quantity: 2 }];
        assert.equal(calculateCartCount(cart), 5);
    });

    test('an empty cart counts as 0', () => {
        assert.equal(calculateCartCount([]), 0);
    });
});

describe('calculateCartTotal', () => {
    test('sums price * quantity across all items', () => {
        const cart = [{ ...products[0], quantity: 2 }, { ...products[2], quantity: 1 }];
        // (10 * 2) + (30 * 1)
        assert.equal(calculateCartTotal(cart), 50);
    });

    test('an empty cart totals 0', () => {
        assert.equal(calculateCartTotal([]), 0);
    });
});

describe('sanitizeStoredCart', () => {
    test('accepts a well-formed stored cart as-is', () => {
        const stored = [{ id: 1, quantity: 2 }];
        assert.deepEqual(sanitizeStoredCart(stored, products), [{ ...products[0], quantity: 2 }]);
    });

    test('drops entries whose product id no longer exists', () => {
        const stored = [{ id: 1, quantity: 1 }, { id: 999, quantity: 1 }];
        assert.deepEqual(sanitizeStoredCart(stored, products), [{ ...products[0], quantity: 1 }]);
    });

    test('drops entries with a zero, negative, or non-integer quantity', () => {
        const stored = [
            { id: 1, quantity: 0 },
            { id: 2, quantity: -3 },
            { id: 3, quantity: 1.5 },
        ];
        assert.deepEqual(sanitizeStoredCart(stored, products), []);
    });

    test('rebuilds item data (price, title, ...) from the live product list rather than trusting the stored copy', () => {
        // Simulates someone hand-editing localStorage to give themselves
        // a free item by lowering the stored price.
        const stored = [{ id: 1, quantity: 1, price: 0.01, title: 'Shirt' }];
        assert.equal(sanitizeStoredCart(stored, products)[0].price, 10);
    });

    test('non-array input (corrupted/garbage JSON) comes back as an empty cart instead of throwing', () => {
        assert.deepEqual(sanitizeStoredCart(null, products), []);
        assert.deepEqual(sanitizeStoredCart('not an array', products), []);
        assert.deepEqual(sanitizeStoredCart(undefined, products), []);
    });
});
