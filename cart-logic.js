// Pure, DOM-free product/cart helpers.
//
// Pulled out of script.js specifically so they can be unit tested without
// a browser: everything in script.js itself is wired directly into the
// DOM (reading inputs, writing innerHTML, etc.), which makes it slow and
// awkward to test. These functions take plain data in and return plain
// data out -- no globals read, nothing mutated -- so the test suite in
// test/cart-logic.test.js can exercise the actual cart/filter logic
// directly, in milliseconds, with no page to load at all.
//
// Loaded as a plain <script> in the browser (same as every other file in
// this project -- no bundler, no build step), and required directly by
// the Node test runner. `module` only exists in Node, so the exports
// line below is a no-op in the browser and these just end up as ordinary
// global functions there, exactly like addToCart/toggleCart/etc. already
// are in script.js.

function filterProducts(products, category) {
    return category === 'all' ? products : products.filter(p => p.category === category);
}

function addItemToCart(cart, product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        return cart.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    }
    return [...cart, { ...product, quantity: 1 }];
}

function updateItemQuantity(cart, id, change) {
    return cart
        .map(item => (item.id === id ? { ...item, quantity: item.quantity + change } : item))
        .filter(item => item.quantity > 0);
}

function removeItemFromCart(cart, id) {
    return cart.filter(item => item.id !== id);
}

function calculateCartCount(cart) {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function calculateCartTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Used when restoring the cart from localStorage: rebuilds each item
// from the current product list rather than trusting the stored copy
// wholesale, so a stale product id or a corrupted/negative quantity
// can't resurrect a removed product or crash rendering.
function sanitizeStoredCart(stored, products) {
    if (!Array.isArray(stored)) return [];
    return stored
        .filter(item => item && Number.isInteger(item.quantity) && item.quantity > 0
            && products.some(p => p.id === item.id))
        .map(item => ({ ...products.find(p => p.id === item.id), quantity: item.quantity }));
}

if (typeof module !== 'undefined') {
    module.exports = {
        filterProducts,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        calculateCartCount,
        calculateCartTotal,
        sanitizeStoredCart,
    };
}
