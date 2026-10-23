'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { isCardNumberValid, isCvvValid, isExpiryValid } = require('../checkout-validation.js');

describe('isCardNumberValid', () => {
    test('accepts a 16-digit number, spaces and all', () => {
        assert.equal(isCardNumberValid('4111 1111 1111 1111'), true);
    });

    test('accepts the shortest (13-digit) and longest (19-digit) real-world lengths', () => {
        assert.equal(isCardNumberValid('1234567890123'), true);
        assert.equal(isCardNumberValid('1234567890123456789'), true);
    });

    test('rejects too short, too long, non-digit, and empty input', () => {
        assert.equal(isCardNumberValid('123456789012'), false);
        assert.equal(isCardNumberValid('12345678901234567890'), false);
        assert.equal(isCardNumberValid('4111 1111 1111 111a'), false);
        assert.equal(isCardNumberValid(''), false);
        assert.equal(isCardNumberValid(undefined), false);
    });
});

describe('isCvvValid', () => {
    test('accepts 3 or 4 digits', () => {
        assert.equal(isCvvValid('123'), true);
        assert.equal(isCvvValid('1234'), true);
    });

    test('rejects everything else', () => {
        assert.equal(isCvvValid('12'), false);
        assert.equal(isCvvValid('12345'), false);
        assert.equal(isCvvValid('12a'), false);
        assert.equal(isCvvValid(''), false);
        assert.equal(isCvvValid(undefined), false);
    });
});

describe('isExpiryValid', () => {
    const referenceDate = new Date(2026, 5, 15); // June 15, 2026

    test('a future month/year is valid', () => {
        assert.equal(isExpiryValid('07/26', referenceDate), true);
        assert.equal(isExpiryValid('01/30', referenceDate), true);
    });

    test('the current month is valid through its last moment', () => {
        assert.equal(isExpiryValid('06/26', referenceDate), true);
    });

    test('a past month is invalid, even within the current year', () => {
        assert.equal(isExpiryValid('05/26', referenceDate), false);
    });

    test('a past year is invalid', () => {
        assert.equal(isExpiryValid('06/25', referenceDate), false);
    });

    test('rejects a malformed or incomplete value', () => {
        assert.equal(isExpiryValid('13/26', referenceDate), false); // month 13 doesn't exist
        assert.equal(isExpiryValid('00/26', referenceDate), false); // month 0 doesn't exist
        assert.equal(isExpiryValid('0626', referenceDate), false); // missing the slash
        assert.equal(isExpiryValid('6/26', referenceDate), false); // not zero-padded
        assert.equal(isExpiryValid('', referenceDate), false);
        assert.equal(isExpiryValid(undefined, referenceDate), false);
    });
});
