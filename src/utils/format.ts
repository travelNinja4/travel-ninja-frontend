/**
 * Formatters for values shown in the UI. They give the same output on the
 * server and in every browser, so server-rendered text never mismatches on
 * hydration.
 */

// Fixed names: Intl prints "Sept" for September on newer ICU versions
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Built once: creating an Intl formatter costs far more than calling one, and lists call it per row
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * `"2026-11-14"` -> `"14 Nov 2026"`. Reads the date parts directly instead of
 * going through `Date`, which would shift the day in timezones west of UTC.
 * Anything that isn't a `YYYY-MM-DD` date is returned unchanged.
 */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  if (!year || !day || !MONTHS[month - 1]) return isoDate;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** `12500` -> `"₹12,500"`, `125000` -> `"₹1,25,000"` */
export function formatCurrency(amount: number): string {
  return inrFormatter.format(amount);
}
