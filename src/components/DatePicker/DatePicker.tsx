/**
 * A customizable date picker that integrates easily with forms and supports themes, disabled dates, and validation.
 *
 * @example
 * ```tsx
 * import DatePicker from '@src/components/DatePicker'
 *
 * export default function DatePicker() {
 *   return <DatePicker label="Hello" />;
 * }
 * ```
 */
'use client';

import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import styles from './DatePicker.module.scss';
import { useMemo, useState } from 'react';
import TextField from '../TextField';
import { Calendar } from 'lucide-react';

/**
 * Define the props available for the DatePicker component.
 */
interface DatePickerProps {
  label?: string;
  /**
   * Where to show the calendar popup:
   * - "inline" = below the text field
   * - "modal" = centered overlay
   */
  displayMode?: 'inline' | 'modal';

  /**
   * The mode prop determines the selection mode.
   * When the mode prop is set to "single", only one date can be selected at a time
   * Set the mode prop to "multiple" to enable the selection of multiple dates in DayPicker.
   * Set the mode prop to "range" to enable the selection of a continuous range of dates in DayPicker.
   */
  mode?: 'single' | 'multiple' | 'range';

  /**
   *
   */
  min?: number;

  /**
   *
   */
  max?: number;

  initialRange?: DateRange;
  navLayout?: 'around' | 'after' | undefined;

  /**
   * To prevent the user from navigating between months, set the disableNavigation prop to true.
   */
  disableNavigation?: boolean;
  disabled?: Date[];
  inputClassName?: string;
  onChange?: (value: Date | Date[] | DateRange | undefined) => void;
}

export default function DatePicker({
  displayMode = 'inline',
  label,
  mode = 'single',
  initialRange,
  navLayout = 'around',
  disableNavigation = false,
  min,
  max,
  disabled,
  inputClassName,
  onChange,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date>();
  const [selectedMultiple, setSelectedMultiple] = useState<Date[]>();
  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  const handleSelect = (value: any) => {
    if (mode === 'range') setRange(value);
    else if (mode === 'single') setSelected(value);
    else if (mode === 'multiple') setSelectedMultiple(value);

    onChange?.(value);
    setOpen(false);
  };

  // Helper to render DayPicker for all modes
  const renderPicker = () => {
    const props = {
      month,
      onMonthChange: setMonth,
      navLayout,
      disableNavigation,
      pagedNavigation: true,
      fixedWeeks: true,
      disabled,
      className: styles.dayPicker,
      onSelect: handleSelect,
    };

    if (mode === 'single')
      return (
        <DayPicker
          {...props}
          mode="single"
          captionLayout="dropdown"
          reverseYears
          reverseMonths
          startMonth={new Date(2024, 6)}
          endMonth={new Date(2025, 9)}
          selected={selected}
        />
      );
    if (mode === 'multiple')
      return <DayPicker {...props} mode="multiple" selected={selectedMultiple} />;
    return (
      <DayPicker
        {...props}
        mode="range"
        selected={range}
        min={min}
        max={max}
        captionLayout="dropdown"
        reverseYears
        reverseMonths
        startMonth={new Date(2024, 6)}
        endMonth={new Date(2025, 9)}
      />
    );
  };

  return (
    <div data-testid="DatePickerTest">
      <TextField
        readOnly
        label={label}
        placeholder="Select date"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={inputClassName}
        isCalender
      />

      {open && (
        <div className={styles.datePickerWrapper}>
          <>
            {displayMode === 'inline' ? (
              <div className={styles.inlineContainer}>{renderPicker()}</div>
            ) : (
              <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
                <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                  {renderPicker()}
                </div>
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );
}
