/**
 * Arithmetic on `YYYY-MM-DD` dates. Everything runs in UTC so adding days
 * never lands on the wrong date in timezones away from UTC or across DST.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

const toUtc = (isoDate: string): number | null => {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  const time = Date.UTC(year, month - 1, day);
  return Number.isNaN(time) ? null : time;
};

/** `addDays("2026-11-20", 2)` -> `"2026-11-22"`. Returns `""` for an invalid date. */
export function addDays(isoDate: string, days: number): string {
  const time = toUtc(isoDate);
  if (time === null) return '';
  return new Date(time + days * DAY_MS).toISOString().slice(0, 10);
}

/**
 * `toIsoDate(new Date(2026, 10, 14))` -> `"2026-11-14"`, the format the API expects.
 * Reads the local date parts: `toISOString()` converts to UTC first, which turns
 * local midnight into the previous day east of UTC (e.g. India).
 */
export function toIsoDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * `parseIsoDate("2026-11-14")` -> local midnight on 14 Nov 2026. Returns
 * `undefined` for an empty or invalid date, including ones like `"2026-02-31"`.
 */
export function parseIsoDate(isoDate: string | null | undefined): Date | undefined {
  if (!isoDate) return undefined;
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  const date = new Date(year, month - 1, day);
  return date.getMonth() === month - 1 && date.getDate() === day ? date : undefined;
}

/** `daysBetween("2026-11-20", "2026-11-22")` -> `2`. Returns `null` if either date is invalid. */
export function daysBetween(from: string, to: string): number | null {
  const start = toUtc(from);
  const end = toUtc(to);
  if (start === null || end === null) return null;
  return Math.round((end - start) / DAY_MS);
}
