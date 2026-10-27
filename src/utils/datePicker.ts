/**
 * Helpers for the DatePicker component: display formatting, conversion between
 * the API's `"YYYY-MM-DD"` strings and the Dates the calendar works with, month
 * arithmetic and popover placement. Everything works on local dates.
 */

import type { CSSProperties } from 'react';
import type { DateRange } from 'react-day-picker';
import { DATE_PICKER } from '@/constants/strings';
import { parseIsoDate, toIsoDate } from './date';

export type DatePickerMode = 'single' | 'multiple' | 'range';

/** A range as the API expects it: `{ from: "2026-11-14", to: "2026-11-20" }`. */
export type DateRangeValue = { from?: string; to?: string };

/** What goes in and out of the component: `"YYYY-MM-DD"` strings, shaped by the mode. */
export type ApiValue = string | string[] | DateRangeValue | null | undefined;

/** What the calendar works with internally. */
export type Selection = Date | Date[] | DateRange | undefined;

export type PopoverPlacement = { above: boolean; style?: CSSProperties };

// Spelled out because en-GB abbreviates September as "Sept"
export const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Built once: Intl formatters are expensive to create on every render
const weekdayFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
const monthYearFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

// Roughly the popover's tallest size (six week rows) and its widest size, used
// to decide whether it fits below / to the right of the field
const POPOVER_HEIGHT = 380;
const POPOVER_WIDTH = 328;
const POPOVER_GAP = 4;

/** `startOfDay(14 Nov 2026 15:30)` -> 14 Nov 2026 00:00 (local). */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** `startOfMonth(14 Nov 2026)` -> 1 Nov 2026. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Months since year 0, so two months compare with plain numbers. */
export function monthIndex(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

/** `"14 Nov 2026"` */
export function formatShortDate(date: Date): string {
  return `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

/** `"Sat, 14 Nov 2026"` */
export function formatLongDate(date: Date): string {
  return `${weekdayFormat.format(date)}, ${formatShortDate(date)}`;
}

/** `"November 2026"` */
export function formatMonthYear(date: Date): string {
  return monthYearFormat.format(date);
}

/** `"Mo"`, `"Tu"`, `"We"`... the weekday column headers. */
export function formatWeekdayName(date: Date): string {
  return weekdayFormat.format(date).slice(0, 2);
}

/**
 * Text for the field: `"Sat, 14 Nov 2026"`, `"14 Nov 2026 – 20 Nov 2026"` or
 * `"3 dates selected"`. Empty when nothing is selected.
 */
export function formatSelection(selection: Selection): string {
  if (!selection) return '';
  if (selection instanceof Date) return formatLongDate(selection);
  if (Array.isArray(selection)) {
    if (selection.length === 0) return '';
    return selection.length === 1
      ? formatLongDate(selection[0])
      : `${selection.length} ${DATE_PICKER.DATES_SELECTED}`;
  }
  if (!selection.from) return '';
  const from = formatShortDate(selection.from);
  return selection.to ? `${from} – ${formatShortDate(selection.to)}` : `${from} –`;
}

/** Accepts a Date or a `"YYYY-MM-DD"` string; `undefined` for a missing or invalid one. */
export function toDate(value: Date | string | undefined): Date | undefined {
  return typeof value === 'string' ? parseIsoDate(value) : value;
}

/** API strings -> the Dates the calendar works with. Invalid dates are dropped. */
export function toSelection(value: ApiValue, mode: DatePickerMode = 'single'): Selection {
  if (!value) return undefined;
  if (mode === 'multiple') {
    const dates = (value as string[]).map(parseIsoDate).filter((date) => date !== undefined);
    return dates.length ? dates : undefined;
  }
  if (mode === 'range') {
    const range = value as DateRangeValue;
    const from = parseIsoDate(range.from);
    return from ? { from, to: parseIsoDate(range.to) } : undefined;
  }
  return parseIsoDate(value as string);
}

/** Calendar Dates -> API strings. `undefined` when nothing is selected. */
export function toApiValue(selection: Selection): ApiValue {
  if (!selection) return undefined;
  if (selection instanceof Date) return toIsoDate(selection);
  if (Array.isArray(selection)) return selection.length ? selection.map(toIsoDate) : undefined;
  if (!selection.from) return undefined;
  return { from: toIsoDate(selection.from), to: selection.to && toIsoDate(selection.to) };
}

/** The date the calendar should open on: the (first) selected date, if any. */
export function anchorDate(selection: Selection): Date | undefined {
  if (selection instanceof Date) return selection;
  if (Array.isArray(selection)) return selection[0];
  return selection?.from;
}

/**
 * Opens the popover below the field, or above it when the window has too
 * little room below and more above. Aligns it to the field's right edge when it
 * would run off the right side of the screen.
 */
export function placePopover(
  wrapper: HTMLElement | null,
  field: HTMLElement | null,
): PopoverPlacement {
  if (!wrapper || !field) return { above: false };
  const outer = wrapper.getBoundingClientRect();
  const box = field.getBoundingClientRect();
  const spaceBelow = window.innerHeight - box.bottom;
  const above = spaceBelow < POPOVER_HEIGHT + POPOVER_GAP && box.top > spaceBelow;
  const alignRight = box.left + POPOVER_WIDTH > window.innerWidth;

  return {
    above,
    style: {
      ...(above
        ? { top: 'auto', bottom: outer.bottom - box.top + POPOVER_GAP }
        : { top: box.bottom - outer.top + POPOVER_GAP }),
      ...(alignRight && { left: 'auto', right: 0 }),
    },
  };
}
