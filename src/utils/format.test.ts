import { formatCurrency, formatDate } from './format';

describe('formatDate', () => {
  it.each([
    ['2026-11-14', '14 Nov 2026'],
    ['2027-01-05', '5 Jan 2027'],
    ['2026-09-30', '30 Sep 2026'],
    ['2026-11-14T00:00:00Z', '14 Nov 2026'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatDate(input)).toBe(expected);
  });

  it.each(['', 'soon', '2026-13-01'])('returns %j unchanged when it is not a date', (input) => {
    expect(formatDate(input)).toBe(input);
  });
});

describe('formatCurrency', () => {
  it.each([
    [12500, '₹12,500'],
    [125000, '₹1,25,000'],
    [0, '₹0'],
  ])('formats %d as %s', (input, expected) => {
    expect(formatCurrency(input)).toBe(expected);
  });
});
