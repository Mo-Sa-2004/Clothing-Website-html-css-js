// ESLint flat config. This project is plain, no-build-step vanilla JS
// loaded via <script> tags directly in the browser (no bundler, no
// modules), so the config targets browser globals + script-level code
// rather than a Node/module environment.
export default [
    {
        files: ["**/*.js"],
        ignores: ["node_modules/**"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "script",
            globals: {
                // Browser globals used throughout script.js/nav.js/contact.js
                window: "readonly",
                document: "readonly",
                alert: "readonly",
                setTimeout: "readonly",
                localStorage: "readonly",
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            eqeqeq: ["warn", "smart"],
            "no-var": "error",
            "prefer-const": "warn",
        },
    },
    {
        // script.js calls the pure helpers defined in cart-logic.js
        // (filterProducts, addItemToCart, etc.) as plain globals -- same
        // as any other pair of plain <script> tags sharing one global
        // scope in the browser. ESLint lints each file in isolation
        // though, so without this it can't see that cart-logic.js is
        // what defines them and flags every call as undefined.
        files: ["script.js"],
        languageOptions: {
            globals: {
                filterProducts: "readonly",
                addItemToCart: "readonly",
                updateItemQuantity: "readonly",
                removeItemFromCart: "readonly",
                calculateCartCount: "readonly",
                calculateCartTotal: "readonly",
                sanitizeStoredCart: "readonly",
            },
        },
    },
    {
        // cart-logic.js checks `typeof module` to export itself for the
        // Node test suite (see that file's top comment), and the test
        // files use plain Node CommonJS (require/module). Neither is a
        // browser global, so they're scoped to just these files rather
        // than added to the globals every browser file gets above.
        files: ["cart-logic.js", "test/**/*.js"],
        languageOptions: {
            globals: {
                module: "readonly",
                require: "readonly",
            },
        },
    },
];
