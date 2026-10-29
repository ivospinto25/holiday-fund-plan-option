import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getAffordability } from './affordability.ts';
import { formatEuros } from './formatEuros.ts';

// €520 is what the customer usually has left each month.
test('affordability matches the plan options in the design', () => {
  assert.equal(getAffordability(300, 520), 'comfortable'); // 58%
  assert.equal(getAffordability(350, 520), 'balanced'); // 67%
  assert.equal(getAffordability(375, 520), 'balanced'); // 72%, recommended
  assert.equal(getAffordability(430, 520), 'tight'); // 83%
  assert.equal(getAffordability(500, 520), 'tight'); // 96%, start in January
  assert.equal(getAffordability(600, 520), 'over'); // 115%, disabled
});

test('no surplus means any amount is over budget', () => {
  assert.equal(getAffordability(100, 0), 'over');
});

test('amounts follow the locale', () => {
  assert.equal(formatEuros(375), '€375');
  assert.equal(formatEuros(375, 'pt-PT').replace(/\s/g, ' '), '375 €');
  assert.equal(formatEuros(2140.35), '€2,140.35');
});
