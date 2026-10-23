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
];
