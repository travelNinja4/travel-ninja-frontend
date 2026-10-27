import {
  anchorDate,
  formatLongDate,
  formatMonthYear,
  formatSelection,
  formatShortDate,
  formatWeekdayName,
  monthIndex,
  placePopover,
  startOfDay,
  startOfMonth,
  toApiValue,
  toDate,
  toSelection,
} from './datePicker';

const nov14 = new Date(2026, 10, 14);
const nov20 = new Date(2026, 10, 20);

describe('date arithmetic', () => {
  it('startOfDay drops the time', () => {
    expect(startOfDay(new Date(2026, 10, 14, 15, 30))).toEqual(nov14);
  });

  it('startOfMonth goes to the 1st', () => {
    expect(startOfMonth(nov14)).toEqual(new Date(2026, 10, 1));
  });

  it('monthIndex orders months across years', () => {
    expect(monthIndex(new Date(2027, 0, 1)) - monthIndex(new Date(2026, 11, 31))).toBe(1);
  });
});

describe('formatting', () => {
  it.each([
    [formatShortDate, '14 Nov 2026'],
    [formatLongDate, 'Sat, 14 Nov 2026'],
    [formatMonthYear, 'November 2026'],
    [formatWeekdayName, 'Sa'],
  ])('%o -> %s', (format, expected) => {
    expect(format(nov14)).toBe(expected);
  });

  it('writes September as "Sep"', () => {
    expect(formatShortDate(new Date(2026, 8, 1))).toBe('1 Sep 2026');
  });

  it.each([
    [undefined, ''],
    [nov14, 'Sat, 14 Nov 2026'],
    [[], ''],
    [[nov14], 'Sat, 14 Nov 2026'],
    [[nov14, nov20], '2 dates selected'],
    [{ from: nov14, to: nov20 }, '14 Nov 2026 – 20 Nov 2026'],
    [{ from: nov14, to: undefined }, '14 Nov 2026 –'],
    [{ from: undefined }, ''],
  ])('formatSelection(%o) -> %s', (selection, expected) => {
    expect(formatSelection(selection)).toBe(expected);
  });
});

describe('API conversion', () => {
  it('toDate accepts a Date or a string', () => {
    expect(toDate(nov14)).toBe(nov14);
    expect(toDate('2026-11-14')).toEqual(nov14);
    expect(toDate('nope')).toBeUndefined();
    expect(toDate(undefined)).toBeUndefined();
  });

  it('toSelection parses each mode', () => {
    expect(toSelection('2026-11-14')).toEqual(nov14);
    expect(toSelection(['2026-11-14', 'bad', '2026-11-20'], 'multiple')).toEqual([nov14, nov20]);
    expect(toSelection({ from: '2026-11-14', to: '2026-11-20' }, 'range')).toEqual({
      from: nov14,
      to: nov20,
    });
  });

  it('toSelection returns undefined for empty values', () => {
    expect(toSelection(null)).toBeUndefined();
    expect(toSelection('')).toBeUndefined();
    expect(toSelection([], 'multiple')).toBeUndefined();
    expect(toSelection({ to: '2026-11-20' }, 'range')).toBeUndefined();
  });

  it('toApiValue writes YYYY-MM-DD for each mode', () => {
    expect(toApiValue(nov14)).toBe('2026-11-14');
    expect(toApiValue([nov14, nov20])).toEqual(['2026-11-14', '2026-11-20']);
    expect(toApiValue({ from: nov14, to: nov20 })).toEqual({
      from: '2026-11-14',
      to: '2026-11-20',
    });
    expect(toApiValue({ from: nov14, to: undefined })).toEqual({
      from: '2026-11-14',
      to: undefined,
    });
  });

  it('toApiValue returns undefined when nothing is selected', () => {
    expect(toApiValue(undefined)).toBeUndefined();
    expect(toApiValue([])).toBeUndefined();
    expect(toApiValue({ from: undefined })).toBeUndefined();
  });
});

describe('anchorDate', () => {
  it('picks the single, first or start date', () => {
    expect(anchorDate(nov14)).toBe(nov14);
    expect(anchorDate([nov20, nov14])).toBe(nov20);
    expect(anchorDate({ from: nov14, to: nov20 })).toBe(nov14);
    expect(anchorDate(undefined)).toBeUndefined();
  });
});

describe('placePopover', () => {
  const rect = (top: number, left: number, height: number) =>
    ({
      getBoundingClientRect: () => ({ top, left, bottom: top + height }),
    }) as HTMLElement;

  beforeEach(() => {
    vi.stubGlobal('innerHeight', 800);
    vi.stubGlobal('innerWidth', 1200);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('opens below the field when there is room', () => {
    expect(placePopover(rect(100, 20, 64), rect(124, 20, 40))).toEqual({
      above: false,
      style: { top: 68 },
    });
  });

  it('opens above the field near the bottom of the screen', () => {
    expect(placePopover(rect(700, 20, 64), rect(724, 20, 40))).toEqual({
      above: true,
      style: { top: 'auto', bottom: 44 },
    });
  });

  it('aligns right near the right edge', () => {
    expect(placePopover(rect(100, 1000, 64), rect(124, 1000, 40)).style).toMatchObject({
      left: 'auto',
      right: 0,
    });
  });

  it('falls back to below without elements', () => {
    expect(placePopover(null, null)).toEqual({ above: false });
  });
});
