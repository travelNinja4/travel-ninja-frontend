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

/** `daysBetween("2026-11-20", "2026-11-22")` -> `2`. Returns `null` if either date is invalid. */
export function daysBetween(from: string, to: string): number | null {
  const start = toUtc(from);
  const end = toUtc(to);
  if (start === null || end === null) return null;
  return Math.round((end - start) / DAY_MS);
}
