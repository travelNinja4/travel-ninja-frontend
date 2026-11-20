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

/**
 * Two-letter initials of a person's name for an avatar: the first letters of
 * the first and last words (`"Sneha Krishnan"` -> `"SK"`, `"Sneha Lakshmi
 * Krishnan"` -> `"SK"`), or the first two letters of a single name
 * (`"Sneha"` -> `"SN"`). Returns `""` for a blank name.
 */
export function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  // Array.from splits by character, so a letter outside the BMP isn't cut in half
  const letters =
    words.length === 1
      ? Array.from(words[0]).slice(0, 2)
      : [Array.from(words[0])[0], Array.from(words[words.length - 1])[0]];
  return letters.join('').toUpperCase();
}

/**
 * `"+91-9811122334"` -> `"+91 98111 22334"`. Indian mobile numbers are split
 * 5 + 5, the way they are written; other numbers keep their digits together.
 * Anything not in the API's `+<code>-<number>` shape is returned unchanged.
 */
export function formatPhone(phone: string): string {
  const { dialCode, number } = splitPhone(phone);
  if (!dialCode) return phone;
  return dialCode === '+91' && number.length === 10
    ? `${dialCode} ${number.slice(0, 5)} ${number.slice(5)}`
    : `${dialCode} ${number}`;
}

/**
 * `"+91-9811122334"` -> `{ dialCode: "+91", number: "9811122334" }`, e.g. for a
 * `MobileNumberInput`, which shows the dial code apart from the number. Anything
 * not in the API's `+<code>-<number>` shape comes back whole as the number.
 */
export function splitPhone(phone: string): { dialCode?: string; number: string } {
  const match = /^(\+\d{1,4})-(\d+)$/.exec(phone);
  return match ? { dialCode: match[1], number: match[2] } : { number: phone };
}
