// Pure, DOM-free checkout field validation -- same reasoning and pattern
// as cart-logic.js: these are plain functions (data in, boolean out) so
// they can be unit tested directly in test/checkout-validation.test.js
// without a browser, and loaded as a normal <script> tag in the browser
// (no bundler, no build step). `module` only exists in Node, so the
// exports line below is a no-op there and these are just ordinary
// globals in the browser, same as everything else in this project.
//
// Previously, the card number/expiry/CVV fields on the checkout form
// only had input *formatting* (inserting spaces, slashes, stripping
// non-digits) with no actual validation -- an expiry date in the past,
// or a card number with the wrong number of digits, would still "place
// an order" successfully.

function isCardNumberValid(value) {
    const digits = (value || '').replace(/\s/g, '');
    // Covers the real-world range: Amex is 15, most Visa/Mastercard are
    // 16, and some cards (notably some Visa) go up to 19.
    return /^\d{13,19}$/.test(digits);
}

function isCvvValid(value) {
    return /^\d{3,4}$/.test(value || '');
}

// `value` is the formatted "MM/YY" string from the expiry field.
// `referenceDate` defaults to now but is accepted as a parameter so
// tests don't become time-bomb tests that start failing in the future.
function isExpiryValid(value, referenceDate = new Date()) {
    const match = /^(\d{2})\/(\d{2})$/.exec(value || '');
    if (!match) return false;

    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) return false;

    // A card expires at the END of its printed month, so e.g. 06/26 is
    // still valid for the entirety of June 2026.
    const expiryEnd = new Date(year, month, 0, 23, 59, 59, 999);
    return expiryEnd >= referenceDate;
}

if (typeof module !== 'undefined') {
    module.exports = {
        isCardNumberValid,
        isCvvValid,
        isExpiryValid,
    };
}
