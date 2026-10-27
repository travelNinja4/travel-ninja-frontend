import { addDays, daysBetween, parseIsoDate, toIsoDate } from './date';

describe('toIsoDate', () => {
  it('formats the local date, zero-padded', () => {
    expect(toIsoDate(new Date(2026, 10, 14))).toBe('2026-11-14');
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('keeps the local day at midnight', () => {
    expect(toIsoDate(new Date(2026, 10, 14, 0, 0))).toBe('2026-11-14');
  });
});

describe('parseIsoDate', () => {
  it('parses to local midnight', () => {
    expect(parseIsoDate('2026-11-14')).toEqual(new Date(2026, 10, 14));
  });

  it.each(['', null, undefined, 'not-a-date', '2026-02-31', '2026-13-01'])(
    'returns undefined for %s',
    (value) => {
      expect(parseIsoDate(value)).toBeUndefined();
    },
  );

  it('round-trips with toIsoDate', () => {
    expect(toIsoDate(parseIsoDate('2028-02-29')!)).toBe('2028-02-29');
  });
});

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
