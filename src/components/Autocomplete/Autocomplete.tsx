/**
 * A component that allows users to search, filter, and select options from a list with dynamic suggestions as they type.
 *
 * @example
 * ```tsx
 * import Autocomplete from '@src/components/Autocomplete'
 *
 * export default function Autocomplete() {
 *   const [value, setValue] = useState<string>('');
 *   const [search, setSearch] = useState<string>('');
 *
 *   const options: AutocompleteOption<string>[] = [
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana' },
 *     { value: 'cherry', label: 'Cherry' },
 *   ];
 *
 *   return (
 *     <Autocomplete
 *       options={options}
 *       value={value}
 *       onChange={setValue}
 *       searchValue={search}
 *       onSearchChange={setSearch}
 *       placeholder="Search fruits..."
 *     />
 *   );
 * }
 * ```
 */
'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import clsx from 'clsx';
import styles from './Autocomplete.module.scss';
import { STRINGS } from '@/constants/strings';

export type AutocompleteOption<T> = {
  value: T;
  label: string;
};

/**
 * Define the props available for the Autocomplete component.
 */
interface AutocompleteProps<T> {
  /**
   * List of options to display in the dropdown.
   *
   * Each option must have a `label` (string shown to the user)
   * and a `value` (the underlying data of generic type `T`).
   */
  options: AutocompleteOption<T>[];

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
   * The current value of the search input field.
   *
   * Useful when controlling the search text externally.
   */
  searchValue?: string;

  /**
   * Callback fired when the search input changes.
   *
   * @param value - The updated search text.
   */
  onSearchChange?: (value: string) => void;

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
}

export default function Autocomplete<T>({
  options,
  value,
  onChange,
  searchValue = '',
  onSearchChange,
  placeholder = 'Search...',
  dropdownContainerClassName,
  dropdownTextContainerClassName,
  disabled = false,
}: AutocompleteProps<T>) {
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
      data-testid="AutocompleteTest"
      ref={dropdownRef}
      className={clsx(styles.dropdown, dropdownContainerClassName)}
    >
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue || (value as string)}
          className={clsx(styles.input, dropdownTextContainerClassName)}
          onFocus={() => !disabled && setIsOpen(true)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (disabled) return;
            onSearchChange?.(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>

      {isOpen && options.length > 0 && (
        <ul role="listbox" tabIndex={-1} onKeyDown={handleKeyDown} className={styles.list}>
          {options.map((option, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <li
                key={idx}
                role="option"
                className={clsx(styles.option, { [styles.highlighted]: isHighlighted })}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && options.length === 0 && (
        <ul className={styles.list}>
          <li className={styles.noOptions}>{STRINGS.NO_OPTIONS_FOUND}</li>
        </ul>
      )}
    </div>
  );
}
