/**
 * A component that allows users to search, filter, and select options from a list with dynamic suggestions as they type.
 *
 * @example
 * ```tsx
 * import Autocomplete from '@src/components/Autocomplete'
 *
 * export default function Autocomplete() {
 *   return <Autocomplete label="Hello" />;
 * }
 * ```
 */
'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import clsx from 'clsx';
import styles from './Autocomplete.module.scss';

export type AutocompleteOption<T> = {
  value: T;
  label: string;
};

/**
 * Define the props available for the Autocomplete component.
 */
interface AutocompleteProps<T> {
  options: AutocompleteOption<T>[];
  value?: T | string;
  onChange?: (value: T | string | undefined) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  dropdownContainerClassName?: string;
  dropdownTextContainerClassName?: string;
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
    <div ref={dropdownRef} className={clsx(styles.dropdown, dropdownContainerClassName)}>
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
          <li className={styles.noOptions}>No options</li>
        </ul>
      )}
    </div>
  );
}
