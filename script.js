const products = [
    { id: 1, title: "Premium Cotton T-Shirt", category: "men", price: 59.99, image: "images/cotton-t-shirt.jpg" },
    { id: 2, title: "Elegant Silk Dress", category: "women", price: 189.99, image: "images/Elegant-Dress.avif" },
    { id: 3, title: "Leather Crossbody Bag", category: "accessories", price: 129.99, image: "images/Leather-Bag.jpg" },
    { id: 4, title: "Classic Denim Jacket", category: "men", price: 99.99, image: "images/Classic-Jacket.webp" },
    { id: 5, title: "Floral Summer Blouse", category: "women", price: 79.99, image: "images/Floral-Blouse.jpg" },
    { id: 6, title: "Minimalist Watch", category: "accessories", price: 249.99, image: "images/Watch.jpg" },
    { id: 7, title: "Wool Blend Sweater", category: "men", price: 119.99, image: "images/Blend-Sweater.webp" },
    { id: 8, title: "High-Waist Trousers", category: "women", price: 89.99, image: "images/High-Waist.webp" },
    { id: 9, title: "Vintage Sunglasses", category: "accessories", price: 89.99, image: "images/Vintage-Sunglasses.jpg" },
    { id: 10, title: "Casual Polo Shirt", category: "men", price: 69.99, image: "images/Polo-Shirt.jpg" },
    { id: 11, title: "Designer Blazer", category: "women", price: 159.99, image: "images/Blazer-women.webp" },
    { id: 12, title: "Premium Backpack", category: "accessories", price: 149.99, image: "images/Backpack.jpg" }
];

let cart = [];

// display products
function renderProducts(filter = "all") {
    const grid = document.getElementById('product-grid');
    const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
    
    grid.innerHTML = filtered.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${product.category.toUpperCase()}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" aria-label="Add ${product.title} to cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        renderProducts(btn.dataset.category);
    });
});

// Cart functions
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    updateCartUI();
    
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    document.getElementById('total-price').textContent = `Total: $${total}`;
    document.getElementById('checkout-total').textContent = `Total: $${total}`;

    if (cart.length === 0) {
        document.getElementById('cart-items').innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon"><i class="fas fa-shopping-cart"></i></div>
                <p>Your cart is currently empty.</p>
            </div>`;
        document.getElementById('cart-total').style.display = 'none';
    } else {
        document.getElementById('cart-items').innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" aria-label="Decrease quantity of ${item.title}">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" aria-label="Increase quantity of ${item.title}">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})" aria-label="Remove ${item.title} from cart">×</button>
            </div>
        `).join('');
        document.getElementById('cart-total').style.display = 'block';
    }
}

// ---- Cart/checkout dialog accessibility: focus trap + Escape to close ----
// The cart and checkout panels are overlay "dialogs" (role="dialog" in the
// HTML). When one opens, keyboard focus should move into it and stay
// trapped there (Tab shouldn't escape to the page behind it), and Escape
// should close it and return focus to wherever it was before.
let lastFocusedElement = null;

function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null);
}

function openDialog(contentEl) {
    lastFocusedElement = document.activeElement;
    const focusable = getFocusableElements(contentEl);
    (focusable[0] || contentEl).focus();
}

function closeDialog() {
    const canRestore = lastFocusedElement
        && document.body.contains(lastFocusedElement)
        && lastFocusedElement.offsetParent !== null;
    (canRestore ? lastFocusedElement : document.querySelector('.cart-btn'))?.focus();
    lastFocusedElement = null;
}

document.addEventListener('keydown', e => {
    const openModel = document.querySelector('.cart-model.active');
    if (!openModel) return;
    const dialogContent = openModel.querySelector('.cart-model-content');

    if (e.key === 'Escape') {
        e.preventDefault();
        if (document.getElementById('checkout-model').classList.contains('active')) {
            hideCheckout();
        } else {
            toggleCart();
        }
        return;
    }

    if (e.key === 'Tab' && dialogContent) {
        const focusable = getFocusableElements(dialogContent);
        if (focusable.length === 0) {
            e.preventDefault();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

// Cart & Checkout toggle
function toggleCart() {
    const cartModel = document.getElementById('cart-model');
    const opening = !cartModel.classList.contains('active');

    document.getElementById('checkout-model').classList.remove('active');
    cartModel.classList.toggle('active');

    if (opening) {
        openDialog(cartModel.querySelector('.cart-model-content'));
    } else {
        closeDialog();
    }
}

function showCheckout() {
    document.getElementById('cart-model').classList.remove('active');
    document.getElementById('checkout-model').classList.add('active');
    updateCartUI(); // refresh total
    openDialog(document.getElementById('checkout-model').querySelector('.cart-model-content'));
}

function hideCheckout() {
    const checkoutModel = document.getElementById('checkout-model');
    const wasActive = checkoutModel.classList.contains('active');
    checkoutModel.classList.remove('active');
    if (wasActive) closeDialog();
}

// Payment method selection
function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(m => {
        m.classList.remove('active');
        m.setAttribute('aria-checked', 'false');
    });
    method.classList.add('active');
    method.setAttribute('aria-checked', 'true');
    document.getElementById('creditcardform').style.display = method.dataset.method === 'credit' ? 'block' : 'none';
}

document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => selectPaymentMethod(method));
    method.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectPaymentMethod(method);
        }
    });
});

// Fake order processing
function processOrder(e) {
    e.preventDefault();
    if (cart.length === 0) return;

    const btn = e.target.querySelector('.place-order-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
        alert('Order placed successfully! Thank you for shopping with A&E Fashion.');
        cart = [];
        updateCartUI();
        toggleCart();
        document.getElementById('checkout-form').reset();
        btn.innerHTML = 'Place Order';
        btn.disabled = false;
    }, 2000);
}

// Close cart when clicking outside
document.getElementById('cart-model').addEventListener('click', e => {
    if (e.target === document.getElementById('cart-model')) toggleCart();
});
document.getElementById('checkout-model').addEventListener('click', e => {
    if (e.target === document.getElementById('checkout-model')) hideCheckout();
});

// Card formatting
document.getElementById('cardNumber')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let matches = v.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];
    for (let i = 0; i < match.length; i += 4) parts.push(match.substring(i, i + 4));
    if (parts.length) e.target.value = parts.join(' ');
    else e.target.value = v;
});

document.getElementById('expirydate')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    e.target.value = v;
});

document.getElementById('cvv')?.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});