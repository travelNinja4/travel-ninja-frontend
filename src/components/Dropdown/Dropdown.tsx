/**
 * A reusable dropdown component that allows users to select an option from a list. It supports customizable labels, dynamic options, and flexible styling for use across the application.
 *
 * @example
 * ```tsx
 * import Dropdown from '@src/components/Dropdown'
 *
 * export default function Dropdown() {
 *   return <Dropdown label="Hello" />;
 * }
 * ```
 */
'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { STRINGS } from '@/constants/strings';
import Typography from '../Typography';
import TextField from '../TextField';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import styles from './Dropdown.module.scss';

export type DropdownOption<T> = {
  value: T;
  label: string;
};

/**
 * Define the props available for the Dropdown component.
 */
interface DropdownProps<T> {
  /**
   * The label displayed above the dropdown input.
   */
  label?: string;

  /**
   * If true, indicates that selecting a value is required.
   * Typically adds a visual indicator (like a *) next to the label.
   */
  required?: boolean;

  /**
   * List of options to display in the dropdown.
   *
   * Each option must have a `label` (string shown to the user)
   * and a `value` (the underlying data of generic type `T`).
   */
  options: DropdownOption<T>[];

  /**
   * The currently selected value.
   *
   * Can be a string or of type `T`. Useful for controlled components
   * where the parent manages the selected state.
   */
  value?: T | string;

  /**
   * Callback fired when an option is selected.
   *
   * @param value The selected value of type `T` or string.
   * If cleared, it may be `undefined`.
   */
  onChange?: (value: T | string | undefined) => void;

  /**
   * Placeholder text for the search input field.
   *
   * @default "Search..."
   */
  placeholder?: string;

  /**
   * Additional class name(s) applied to the dropdown container.
   * Allows custom styling.
   */
  dropdownContainerClassName?: string;

  /**
   * Additional class name(s) applied to the text input container.
   * Allows custom styling.
   */
  dropdownTextContainerClassName?: string;

  /**
   * If true, disables the input and dropdown interaction.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, shows loading state in the dropdown options.
   */
  isLoading?: boolean;
}

export default function Dropdown<T>({
  label,
  required,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  dropdownContainerClassName,
  dropdownTextContainerClassName,
  disabled = false,
  isLoading,
}: DropdownProps<T>) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLUListElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev + 1) % options.length);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      const option = options[highlightedIndex];
      onChange?.(option.value);
      setIsOpen(false);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      e.preventDefault();
    }
  };

  return (
    <div
      data-testid="DropdownTest"
      ref={dropdownRef}
      tabIndex={0}
      className={clsx(styles.dropdown, dropdownContainerClassName)}
    >
      <div className={styles.inputWrapper}>
        {label && (
          <Typography tag="label" className={styles.label}>
            {label}
            {required && (
              <Typography tag="span" className={styles.requiredMark}>
                *
              </Typography>
            )}
          </Typography>
        )}

        <div
          className={styles.inputWithIcon}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
        >
          <TextField
            readOnly
            placeholder={placeholder}
            value={value as string}
            className={clsx(dropdownTextContainerClassName)}
            onFocus={() => !disabled && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />

          {/* Chevron inside the input */}
          <span className={clsx(styles.chevronIcon)}>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </div>

      {isOpen && (
        <ul role="listbox" tabIndex={-1} onKeyDown={handleKeyDown} className={styles.list}>
          {isLoading ? (
            // Loading State (fixed)
            <li className={styles.loading}>
              <span className={styles.spinner}></span>
              Loading...
            </li>
          ) : options?.length > 0 ? (
            //  Normal Options
            options.map((option, idx) => {
              const isHighlighted = idx === highlightedIndex;
              return (
                <li
                  key={idx}
                  role="option"
                  className={clsx(styles.option, {
                    [styles.highlighted]: isHighlighted,
                    [styles.selected]: option.value === value,
                  })}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </li>
              );
            })
          ) : (
            // No Options Fallback
            <li className={styles.noOptions}>{STRINGS.NO_OPTIONS_FOUND}</li>
          )}
        </ul>
      )}
    </div>
  );
}
