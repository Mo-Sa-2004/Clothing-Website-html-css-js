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
            },
        },
        rules: {
            // "local" (not the default "all") because every top-level
            // function here (addToCart, updateQuantity, etc.) is called
            // from inline onclick="" attributes in the HTML, which this
            // rule has no visibility into -- it would otherwise flag every
            // one of them as unused. Variables/functions inside a function
            // body are still checked normally.
            "no-unused-vars": ["warn", { vars: "local" }],
            "no-undef": "error",
            eqeqeq: ["warn", "smart"],
            "no-var": "error",
            "prefer-const": "warn",
        },
    },
];
