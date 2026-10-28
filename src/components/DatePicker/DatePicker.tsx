/**
 * Date field that opens a calendar popover with three views: days, months and
 * years. Clicking the header zooms out (days -> months -> years); picking a
 * year or month zooms back in. The footer clears the value or jumps to today.
 *
 * Supports single, multiple and range selection, min/max dates and any extra
 * react-day-picker matchers through `disabledDates`. The calendar shows inline
 * below the field (flipping above when there is no room) or as a centered modal.
 *
 * The field shows a readable date ("Sat, 14 Nov 2026") while `value` and
 * `onChange` use the API's `"YYYY-MM-DD"` strings, built from the local date
 * so no timezone shifts the day.
 *
 * @example
 * ```tsx
 * import DatePicker from '@/components/DatePicker'
 *
 * export default function DepartureField() {
 *   const [departureDate, setDepartureDate] = useState<string>();
 *   return (
 *     <DatePicker
 *       label="Departure date"
 *       minDate={new Date()}
 *       value={departureDate ?? null} // null = controlled but empty
 *       onChange={setDepartureDate} // "2026-11-14"
 *     />
 *   );
 * }
 * ```
 */
'use client';

import { KeyboardEvent, ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react';
import { DateRange, DayPicker, Matcher } from 'react-day-picker';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { DATE_PICKER } from '@/constants/strings';
import {
  ApiValue,
  DateRangeValue,
  MONTH_LABELS,
  PopoverPlacement,
  Selection,
  anchorDate,
  formatMonthYear,
  formatSelection,
  formatWeekdayName,
  monthIndex,
  placePopover,
  startOfDay,
  startOfMonth,
  toApiValue,
  toDate,
  toSelection,
} from '@/utils/datePicker';
import InputField from '../InputField';
import styles from './DatePicker.module.scss';

export type { DateRangeValue } from '@/utils/datePicker';

type View = 'days' | 'months' | 'years';

const YEARS_PER_PAGE = 12;

const formatters = { formatWeekdayName };

// react-day-picker ships unstyled class names; all styling lives in the module
const dayPickerClassNames = {
  root: styles.calendar,
  months: styles.months,
  month: styles.month,
  month_caption: styles.srOnly,
  month_grid: styles.grid,
  weekday: styles.weekday,
  day: styles.day,
  day_button: styles.dayButton,
  selected: styles.selected,
  today: styles.today,
  disabled: styles.disabled,
  outside: styles.outside,
  hidden: styles.hidden,
  range_start: styles.rangeStart,
  range_middle: styles.rangeMiddle,
  range_end: styles.rangeEnd,
};

interface BaseProps {
  /**
   * Text shown above the field. Linked to the input through `htmlFor`.
   */
  label?: ReactNode;

  /**
   * Text shown when nothing is selected.
   *
   * @default "Select date"
   */
  placeholder?: string;

  /**
   * Where to show the calendar:
   * - "inline" = popover below (or above) the field
   * - "modal" = centered overlay
   *
   * @default "inline"
   */
  displayMode?: 'inline' | 'modal';

  /**
   * Earliest date that can be picked, as a Date or `"YYYY-MM-DD"`.
   * Earlier days, months and years are greyed out.
   */
  minDate?: Date | string;

  /**
   * Latest date that can be picked, as a Date or `"YYYY-MM-DD"`.
   * Later days, months and years are greyed out.
   */
  maxDate?: Date | string;

  /**
   * Extra days that cannot be picked, e.g. `[{ dayOfWeek: [0] }, new Date(2026, 11, 25)]`.
   */
  disabledDates?: Matcher | Matcher[];

  /**
   * Error message shown below the field. Turns the border red.
   */
  error?: string;

  /**
   * Hint shown below the field when there is no error.
   */
  helperText?: ReactNode;

  /**
   * Shows a required marker next to the label.
   */
  required?: boolean;

  /**
   * Disables the field so the calendar cannot be opened.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Id for the input. Generated when omitted.
   */
  id?: string;

  /**
   * Name for forms that read values by name. Submitted through hidden inputs in
   * the API format: one `name` per date, or `${name}From` / `${name}To` for a range.
   */
  name?: string;

  /**
   * Class for the outer wrapper (label + field + popover).
   */
  className?: string;
}

interface SingleProps extends BaseProps {
  /**
   * "single" picks one date and closes the calendar.
   *
   * @default "single"
   */
  mode?: 'single';
  /** Selected date for a controlled picker, e.g. `"2026-11-14"`. `null` or `""` = none. */
  value?: string | null;
  /** Initial date for an uncontrolled picker, e.g. `"2026-11-14"`. */
  defaultValue?: string;
  /** Called with the picked date as `"YYYY-MM-DD"`, or `undefined` when cleared. */
  onChange?: (value: string | undefined) => void;
}

interface MultipleProps extends BaseProps {
  /**
   * "multiple" toggles any number of dates; the calendar stays open.
   */
  mode: 'multiple';
  value?: string[] | null;
  defaultValue?: string[];
  /** Called with the picked dates as `"YYYY-MM-DD"`, or `undefined` when none are left. */
  onChange?: (value: string[] | undefined) => void;
}

interface RangeProps extends BaseProps {
  /**
   * "range" picks a start and end date; the calendar closes once both are set.
   */
  mode: 'range';
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue;
  /**
   * Called with `{ from: "YYYY-MM-DD", to: "YYYY-MM-DD" }`; `to` is `undefined`
   * until the end date is picked. `undefined` when cleared.
   */
  onChange?: (value: DateRangeValue | undefined) => void;

  /**
   * Minimum number of nights in the range.
   */
  min?: number;

  /**
   * Maximum number of nights in the range.
   */
  max?: number;
}

/**
 * Define the props available for the DatePicker component.
 * `value`, `defaultValue` and `onChange` use the API's `"YYYY-MM-DD"` strings,
 * shaped by `mode`. The field itself shows the readable "Sat, 14 Nov 2026".
 */
export type DatePickerProps = SingleProps | MultipleProps | RangeProps;

export default function DatePicker(props: DatePickerProps) {
  const {
    mode = 'single',
    label,
    placeholder = DATE_PICKER.PLACEHOLDER,
    displayMode = 'inline',
    disabledDates,
    error,
    helperText,
    required,
    disabled = false,
    id,
    name,
    className,
  } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const popoverId = `${inputId}-calendar`;

  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<PopoverPlacement>({ above: false });
  const [internalSelection, setInternalSelection] = useState<Selection>(() =>
    toSelection(props.defaultValue, mode),
  );
  const [view, setView] = useState<View>('days');
  const [month, setMonth] = useState(() =>
    startOfMonth(anchorDate(internalSelection) ?? new Date()),
  );
  const [yearPageStart, setYearPageStart] = useState(month.getFullYear());
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isControlled = props.value !== undefined;
  const selection = isControlled ? toSelection(props.value, mode) : internalSelection;
  const apiValue = toApiValue(selection);

  // Strings are parsed once per change, so the matchers below stay memoised
  const minDate = useMemo(() => toDate(props.minDate), [props.minDate]);
  const maxDate = useMemo(() => toDate(props.maxDate), [props.maxDate]);

  const minMonth = minDate && monthIndex(minDate);
  const maxMonth = maxDate && monthIndex(maxDate);
  const minYear = minDate?.getFullYear();
  const maxYear = maxDate?.getFullYear();
  const year = month.getFullYear();

  const disabledMatchers = useMemo(() => {
    const matchers: Matcher[] = [];
    if (minDate) matchers.push({ before: startOfDay(minDate) });
    if (maxDate) matchers.push({ after: startOfDay(maxDate) });
    if (disabledDates)
      matchers.push(...(Array.isArray(disabledDates) ? disabledDates : [disabledDates]));
    return matchers;
  }, [minDate, maxDate, disabledDates]);

  const isMonthOutOfRange = (y: number, m: number) => {
    const index = y * 12 + m;
    return (
      (minMonth !== undefined && index < minMonth) || (maxMonth !== undefined && index > maxMonth)
    );
  };
  const isYearOutOfRange = (y: number) =>
    (minYear !== undefined && y < minYear) || (maxYear !== undefined && y > maxYear);

  const today = startOfDay(new Date());
  const isTodayOutOfRange =
    (minDate !== undefined && today < startOfDay(minDate)) ||
    (maxDate !== undefined && today > startOfDay(maxDate));

  const emitChange = (value: Selection) => {
    if (!isControlled) setInternalSelection(value);
    // The union of onChange signatures matches `mode`, which picked `value`'s shape
    (props.onChange as ((value: ApiValue) => void) | undefined)?.(toApiValue(value));
  };

  const open = () => {
    if (disabled) return;
    if (displayMode === 'inline') {
      // The input's parent is InputField's bordered box
      setPlacement(
        placePopover(wrapperRef.current, document.getElementById(inputId)?.parentElement ?? null),
      );
    }
    // Open on the selection, else today, else the nearest allowed month
    let opensOn = anchorDate(selection) ?? today;
    if (minDate && opensOn < startOfDay(minDate)) opensOn = minDate;
    if (maxDate && opensOn > startOfDay(maxDate)) opensOn = maxDate;
    setMonth(startOfMonth(opensOn));
    setView('days');
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);
  const toggle = () => (isOpen ? close() : open());

  // Close when clicking outside the inline popover, only while open
  useEffect(() => {
    if (!isOpen || displayMode !== 'inline') return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, displayMode]);

  const handleSelect = (value: Selection) => {
    emitChange(value);
    if (mode === 'single' && value) close();
    if (mode === 'range' && value && !(value instanceof Date) && !Array.isArray(value)) {
      if (value.from && value.to && value.from.getTime() !== value.to.getTime()) close();
    }
  };

  const goToToday = () => {
    setMonth(startOfMonth(today));
    setView('days');
    if (mode === 'single') handleSelect(today);
  };

  // Pages start at the viewed year, or line up with minDate's year so the first page starts there
  const showYears = () => {
    setYearPageStart(
      minYear !== undefined
        ? minYear + Math.floor((year - minYear) / YEARS_PER_PAGE) * YEARS_PER_PAGE
        : year,
    );
    setView('years');
  };

  const pickYear = (y: number) => {
    // Keep the viewed month, clamped into the allowed range for that year
    let m = month.getMonth();
    if (minDate && y === minYear) m = Math.max(m, minDate.getMonth());
    if (maxDate && y === maxYear) m = Math.min(m, maxDate.getMonth());
    setMonth(new Date(y, m, 1));
    setView('months');
  };

  const pickMonth = (m: number) => {
    setMonth(new Date(year, m, 1));
    setView('days');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      close();
      document.getElementById(inputId)?.focus();
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && ['ArrowDown', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      open();
    }
  };

  // Header label, navigation step and limits for the current view
  const header = {
    days: {
      title: formatMonthYear(month),
      titleLabel: DATE_PICKER.CHOOSE_MONTH,
      onTitle: () => setView('months'),
      prevLabel: DATE_PICKER.PREVIOUS_MONTH,
      nextLabel: DATE_PICKER.NEXT_MONTH,
      prevDisabled: minMonth !== undefined && monthIndex(month) <= minMonth,
      nextDisabled: maxMonth !== undefined && monthIndex(month) >= maxMonth,
      onPrev: () => setMonth(new Date(year, month.getMonth() - 1, 1)),
      onNext: () => setMonth(new Date(year, month.getMonth() + 1, 1)),
    },
    months: {
      title: String(year),
      titleLabel: DATE_PICKER.CHOOSE_YEAR,
      onTitle: showYears,
      prevLabel: DATE_PICKER.PREVIOUS_YEAR,
      nextLabel: DATE_PICKER.NEXT_YEAR,
      prevDisabled: minYear !== undefined && year <= minYear,
      nextDisabled: maxYear !== undefined && year >= maxYear,
      onPrev: () => setMonth(new Date(year - 1, month.getMonth(), 1)),
      onNext: () => setMonth(new Date(year + 1, month.getMonth(), 1)),
    },
    years: {
      title: `${yearPageStart} – ${yearPageStart + YEARS_PER_PAGE - 1}`,
      titleLabel: DATE_PICKER.BACK_TO_DAYS,
      onTitle: () => setView('days'),
      prevLabel: DATE_PICKER.PREVIOUS_YEARS,
      nextLabel: DATE_PICKER.NEXT_YEARS,
      prevDisabled: minYear !== undefined && yearPageStart <= minYear,
      nextDisabled: maxYear !== undefined && yearPageStart + YEARS_PER_PAGE - 1 >= maxYear,
      onPrev: () => setYearPageStart((start) => start - YEARS_PER_PAGE),
      onNext: () => setYearPageStart((start) => start + YEARS_PER_PAGE),
    },
  }[view];

  const renderDays = () => {
    const common = {
      month,
      onMonthChange: setMonth,
      weekStartsOn: 1 as const,
      hideNavigation: true,
      disabled: disabledMatchers,
      startMonth: minDate,
      endMonth: maxDate,
      formatters,
      classNames: dayPickerClassNames,
    };

    if (mode === 'multiple')
      return (
        <DayPicker
          {...common}
          mode="multiple"
          selected={selection as Date[] | undefined}
          onSelect={handleSelect}
        />
      );
    if (mode === 'range')
      return (
        <DayPicker
          {...common}
          mode="range"
          min={props.mode === 'range' ? props.min : undefined}
          max={props.mode === 'range' ? props.max : undefined}
          selected={selection as DateRange | undefined}
          onSelect={handleSelect}
        />
      );
    return (
      <DayPicker
        {...common}
        mode="single"
        selected={selection as Date | undefined}
        onSelect={handleSelect}
      />
    );
  };

  const renderMonths = () => (
    <div className={styles.pickerGrid}>
      {MONTH_LABELS.map((monthLabel, m) => (
        <button
          key={monthLabel}
          type="button"
          className={clsx(styles.pickerCell, {
            [styles.pickerCurrent]: year === today.getFullYear() && m === today.getMonth(),
            [styles.pickerActive]: m === month.getMonth(),
          })}
          aria-pressed={m === month.getMonth()}
          disabled={isMonthOutOfRange(year, m)}
          onClick={() => pickMonth(m)}
        >
          {monthLabel}
        </button>
      ))}
    </div>
  );

  const renderYears = () => (
    <div className={styles.pickerGrid}>
      {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i).map((y) => (
        <button
          key={y}
          type="button"
          className={clsx(styles.pickerCell, {
            [styles.pickerCurrent]: y === today.getFullYear(),
            [styles.pickerActive]: y === year,
          })}
          aria-pressed={y === year}
          disabled={isYearOutOfRange(y)}
          onClick={() => pickYear(y)}
        >
          {y}
        </button>
      ))}
    </div>
  );

  const panel = (
    <div
      id={popoverId}
      role="dialog"
      aria-label={DATE_PICKER.DIALOG_LABEL}
      className={styles.panel}
    >
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          aria-label={header.prevLabel}
          disabled={header.prevDisabled}
          onClick={header.onPrev}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={styles.title}
          aria-label={`${header.title}, ${header.titleLabel}`}
          aria-live="polite"
          onClick={header.onTitle}
        >
          {header.title}
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={clsx(styles.titleChevron, { [styles.titleChevronUp]: view !== 'days' })}
          />
        </button>

        <button
          type="button"
          className={styles.navButton}
          aria-label={header.nextLabel}
          disabled={header.nextDisabled}
          onClick={header.onNext}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.body}>
        {view === 'days' && renderDays()}
        {view === 'months' && renderMonths()}
        {view === 'years' && renderYears()}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.footerButton}
          disabled={!formatSelection(selection)}
          onClick={() => emitChange(undefined)}
        >
          {DATE_PICKER.CLEAR}
        </button>
        <button
          type="button"
          className={clsx(styles.footerButton, styles.todayButton)}
          disabled={isTodayOutOfRange}
          onClick={goToToday}
        >
          {DATE_PICKER.TODAY}
        </button>
      </div>
    </div>
  );

  return (
    <div
      data-testid="DatePickerTest"
      ref={wrapperRef}
      className={clsx(styles.datePicker, className)}
      onKeyDown={handleKeyDown}
    >
      {/* The visible field shows the readable date; forms submit the API format */}
      {name &&
        (typeof apiValue === 'string' ? (
          <input type="hidden" name={name} value={apiValue} />
        ) : Array.isArray(apiValue) ? (
          apiValue.map((date) => <input key={date} type="hidden" name={name} value={date} />)
        ) : (
          <>
            <input type="hidden" name={`${name}From`} value={apiValue?.from ?? ''} />
            <input type="hidden" name={`${name}To`} value={apiValue?.to ?? ''} />
          </>
        ))}

      <InputField
        id={inputId}
        label={label}
        required={required}
        error={error}
        helperText={helperText}
        disabled={disabled}
        readOnly
        placeholder={placeholder}
        value={formatSelection(selection)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
        autoComplete="off"
        onClick={toggle}
        onKeyDown={handleInputKeyDown}
        fieldClassName={clsx({ [styles.enabled]: !disabled, [styles.fieldOpen]: isOpen })}
        inputClassName={styles.input}
        rightIcon={
          <Calendar size={16} aria-hidden="true" className={styles.icon} onClick={toggle} />
        }
      />

      {isOpen &&
        (displayMode === 'inline' ? (
          <div
            className={clsx(styles.popover, { [styles.popoverAbove]: placement.above })}
            style={placement.style}
          >
            {panel}
          </div>
        ) : (
          <div className={styles.modalOverlay} onClick={close}>
            <div className={styles.modalContainer} onClick={(event) => event.stopPropagation()}>
              {panel}
            </div>
          </div>
        ))}
    </div>
  );
}
