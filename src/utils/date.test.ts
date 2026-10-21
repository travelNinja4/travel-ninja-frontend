import { addDays, daysBetween } from './date';

describe('addDays', () => {
  it.each([
    ['2026-11-20', 2, '2026-11-22'],
    ['2026-12-31', 1, '2027-01-01'],
    ['2028-02-28', 1, '2028-02-29'],
    ['2026-03-01', -1, '2026-02-28'],
  ])('adds to %s %i days -> %s', (date, days, expected) => {
    expect(addDays(date, days)).toBe(expected);
  });

  it('returns an empty string for an invalid date', () => {
    expect(addDays('', 2)).toBe('');
  });
});

describe('daysBetween', () => {
  it('counts the days between two dates', () => {
    expect(daysBetween('2026-11-20', '2026-11-22')).toBe(2);
    expect(daysBetween('2026-11-22', '2026-11-20')).toBe(-2);
  });

  it('returns null when a date is missing', () => {
    expect(daysBetween('2026-11-20', '')).toBeNull();
  });
});
