import { formatCurrency, formatDate, formatPhone, getInitials, splitPhone } from './format';

describe('getInitials', () => {
  it.each([
    ['Sneha Krishnan', 'SK'],
    ['Sneha Lakshmi Krishnan', 'SK'],
    ['  meera   patel ', 'MP'],
    ['Sneha', 'SN'],
    ['a', 'A'],
    ['', ''],
    ['   ', ''],
  ])('gives %j the initials %j', (input, expected) => {
    expect(getInitials(input)).toBe(expected);
  });
});

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

describe('formatPhone', () => {
  it.each([
    ['+91-9811122334', '+91 98111 22334'],
    ['+1-4155550100', '+1 4155550100'],
    ['+971-501234567', '+971 501234567'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatPhone(input)).toBe(expected);
  });

  it.each(['', '9811122334', '+91 98111 22334', '+91-98111-22334'])(
    'returns %j unchanged when it is not +<code>-<number>',
    (input) => {
      expect(formatPhone(input)).toBe(input);
    },
  );
});

describe('splitPhone', () => {
  it('splits the dial code from the number', () => {
    expect(splitPhone('+91-9811122334')).toEqual({ dialCode: '+91', number: '9811122334' });
    expect(splitPhone('+971-501234567')).toEqual({ dialCode: '+971', number: '501234567' });
  });

  it.each(['', '9811122334', '+91 98111 22334'])(
    'returns %j whole as the number when it is not +<code>-<number>',
    (input) => {
      expect(splitPhone(input)).toEqual({ number: input });
    },
  );
});
