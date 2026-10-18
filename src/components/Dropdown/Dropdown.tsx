/**
 * Select-style dropdown built on InputField. Shows the selected option's label
 * in a read-only field and opens a listbox of options below it.
 *
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`), and
 * follows the WAI-ARIA select-only combobox pattern: focus stays on the input
 * while Arrow keys, Home/End, Enter/Space, Escape and Tab drive the list.
 *
 * @example
 * ```tsx
 * import Dropdown from '@/components/Dropdown'
 *
 * export default function StatusFilter() {
 *   const [status, setStatus] = useState<string>();
 *   return (
 *     <Dropdown
 *       label="Status"
 *       options={[
 *         { value: 'confirmed', label: 'Confirmed' },
 *         { value: 'pending', label: 'Pending' },
 *       ]}
 *       value={status}
 *       onChange={setStatus}
 *     />
 *   );
 * }
 * ```
 */
'use client';

import { KeyboardEvent, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { STRINGS } from '@/constants/strings';
import InputField from '../InputField';
import styles from './Dropdown.module.scss';

export type DropdownOption<T> = {
  value: T;
  label: string;
};

/**
 * Define the props available for the Dropdown component.
 */
export interface DropdownProps<T> {
  /**
   * Text shown above the field. Linked to the input through `htmlFor`.
   */
  label?: ReactNode;

  /**
   * Shows a required marker next to the label and sets `aria-required`.
   */
  required?: boolean;

  /**
   * Options shown in the list. `label` is displayed, `value` is passed to `onChange`.
   */
  options: DropdownOption<T>[];

  /**
   * Selected value for a controlled dropdown. Pass `null` for "nothing selected".
   */
  value?: T | null;

  /**
   * Initial value for an uncontrolled dropdown.
   */
  defaultValue?: T;

  /**
   * Called with the chosen option's value and the option itself.
   */
  onChange?: (value: T, option: DropdownOption<T>) => void;

  /**
   * Text shown when nothing is selected.
   *
   * @default "Select..."
   */
  placeholder?: string;

  /**
   * Error message shown below the field. Turns the border red.
   */
  error?: string;

  /**
   * Hint shown below the field when there is no error.
   */
  helperText?: ReactNode;

  /**
   * Disables the field and the list.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Shows a loading row instead of the options.
   */
  isLoading?: boolean;

  /**
   * Id for the input. Generated when omitted.
   */
  id?: string;

  /**
   * Name for the input, for forms that read values by name.
   */
  name?: string;

  /**
   * Class for the outer wrapper (label + field + list).
   */
  className?: string;

  /**
   * Class for the bordered box that holds the input and the chevron.
   */
  fieldClassName?: string;
}

export default function Dropdown<T>({
  label,
  required,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select...',
  error,
  helperText,
  disabled = false,
  isLoading,
  id,
  name,
  className,
  fieldClassName,
}: DropdownProps<T>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-listbox`;
  const optionId = (index: number) => `${inputId}-option-${index}`;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;
  const selectedIndex = options.findIndex((option) => Object.is(option.value, selectedValue));
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const canSelect = !isLoading && options.length > 0;

  const open = () => {
    if (disabled) return;
    setIsOpen(true);
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  };

  const close = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const toggle = () => (isOpen ? close() : open());

  const select = (index: number) => {
    const option = options[index];
    if (!option) return;
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value, option);
    close();
  };

  // Close when clicking outside, only while open
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keep the highlighted option visible while moving through a long list
  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    const element = listRef.current?.querySelector<HTMLElement>(
      `#${CSS.escape(optionId(highlightedIndex))}`,
    );
    element?.scrollIntoView?.({ block: 'nearest' });
    // optionId only depends on inputId, which is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, highlightedIndex]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        open();
      }
      return;
    }

    const last = options.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (canSelect) setHighlightedIndex((prev) => (prev >= last ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (canSelect) setHighlightedIndex((prev) => (prev <= 0 ? last : prev - 1));
        break;
      case 'Home':
        event.preventDefault();
        if (canSelect) setHighlightedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        if (canSelect) setHighlightedIndex(last);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (canSelect) select(highlightedIndex);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
    }
  };

  return (
    <div data-testid="DropdownTest" ref={dropdownRef} className={clsx(styles.dropdown, className)}>
      <InputField
        id={inputId}
        name={name}
        label={label}
        required={required}
        error={error}
        helperText={helperText}
        disabled={disabled}
        readOnly
        placeholder={placeholder}
        value={selectedOption?.label ?? ''}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-required={required || undefined}
        aria-activedescendant={
          isOpen && canSelect && highlightedIndex >= 0 ? optionId(highlightedIndex) : undefined
        }
        autoComplete="off"
        onClick={toggle}
        onKeyDown={handleKeyDown}
        fieldClassName={clsx({ [styles.enabled]: !disabled }, fieldClassName)}
        inputClassName={styles.input}
        rightIcon={
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={clsx(styles.chevron, { [styles.chevronOpen]: isOpen })}
            onClick={() => !disabled && toggle()}
          />
        }
      />

      {isOpen && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className={styles.list}
          // Keep focus on the input when clicking inside the list
          onMouseDown={(event) => event.preventDefault()}
        >
          {isLoading ? (
            <li className={styles.status} aria-live="polite">
              <span className={styles.spinner} aria-hidden="true" />
              {STRINGS.LOADING}
            </li>
          ) : options.length > 0 ? (
            options.map((option, index) => (
              <li
                key={index}
                id={optionId(index)}
                role="option"
                aria-selected={index === selectedIndex}
                className={clsx(styles.option, {
                  [styles.highlighted]: index === highlightedIndex,
                  [styles.selected]: index === selectedIndex,
                })}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => select(index)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className={clsx(styles.status, styles.empty)}>{STRINGS.NO_OPTIONS_FOUND}</li>
          )}
        </ul>
      )}
    </div>
  );
}
