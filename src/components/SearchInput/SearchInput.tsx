/**
 * Search box with a debounced `onSearch`, a clear button and a loading state.
 * Built on InputField, so it shares its label, error and focus styles.
 *
 * - `onChange` fires on every keystroke (for the visible text);
 *   `onSearch` fires once typing pauses for `debounceMs`.
 * - Enter searches straight away; Escape or the clear button empties the box
 *   and searches for `''` straight away, so results reset without a wait.
 * - Terms are trimmed, terms shorter than `minChars` search as `''`, and the
 *   same term is never searched twice in a row.
 * - Nothing is searched while an IME composition (e.g. Japanese input) is open.
 * - Each search gets an `AbortSignal` that aborts when a newer search starts
 *   or the component unmounts; pass it to `fetch` to drop stale responses.
 *
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 * Changing `value` from outside does not trigger a search.
 *
 * @example
 * ```tsx
 * import SearchInput from '@/components/SearchInput'
 *
 * export default function TourSearch() {
 *   const [loading, setLoading] = useState(false);
 *
 *   const searchTours = async (term: string, signal: AbortSignal) => {
 *     setLoading(true);
 *     try {
 *       const res = await fetch(`/api/tours?q=${encodeURIComponent(term)}`, { signal });
 *       setTours(await res.json());
 *       setLoading(false);
 *     } catch (error) {
 *       if (!signal.aborted) setLoading(false);
 *     }
 *   };
 *
 *   return <SearchInput onSearch={searchTours} loading={loading} minChars={2} />;
 * }
 * ```
 */
'use client';

import {
  ChangeEvent,
  CompositionEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LoaderCircle, Search, X } from 'lucide-react';
import clsx from 'clsx';
import InputField, { InputFieldProps } from '../InputField';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { SEARCH_INPUT } from '@/constants/strings';
import styles from './SearchInput.module.scss';

/**
 * Define the props available for the SearchInput component.
 * Other native input attributes (and `ref`) are passed through to the `<input>`.
 */
export interface SearchInputProps
  extends Omit<
    InputFieldProps,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'leftIcon' | 'rightIcon'
  > {
  /**
   * The text in the box. Pass it with `onChange` to control the input.
   */
  value?: string;

  /**
   * Starting text when the input is uncontrolled.
   */
  defaultValue?: string;

  /**
   * Called on every change with the raw text, including when it is cleared.
   */
  onChange?: (value: string) => void;

  /**
   * Called with the trimmed term once typing pauses, on Enter, or with `''`
   * when the box is cleared. `signal` aborts when a newer search starts.
   */
  onSearch?: (term: string, signal: AbortSignal) => void;

  /**
   * How long typing must pause before `onSearch` runs, in milliseconds.
   * @default 300
   */
  debounceMs?: number;

  /**
   * Shortest term worth searching; shorter terms search as `''`.
   * @default 1
   */
  minChars?: number;

  /**
   * Shows a spinner in place of the clear button while results load.
   */
  loading?: boolean;

  /**
   * Called after the clear button or Escape empties the box.
   */
  onClear?: () => void;
}

export default function SearchInput({
  value,
  defaultValue = '',
  onChange,
  onSearch,
  debounceMs = 300,
  minChars = 1,
  loading = false,
  onClear,
  placeholder = SEARCH_INPUT.PLACEHOLDER,
  label,
  disabled,
  readOnly,
  ref,
  fieldClassName,
  inputClassName,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  'aria-label': ariaLabel,
  ...rest
}: SearchInputProps) {
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = isControlled ? value : innerValue;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastTermRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isComposingRef = useRef(false);

  useEffect(() => () => abortRef.current?.abort(), []);

  const search = (raw: string) => {
    const trimmed = raw.trim();
    const term = trimmed.length >= minChars ? trimmed : '';
    if (term === lastTermRef.current) return;
    lastTermRef.current = term;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    onSearch?.(term, controller.signal);
  };

  const debouncedSearch = useDebouncedCallback(search, debounceMs);

  // Searches now, dropping any pending debounced search
  const searchNow = (raw: string) => {
    debouncedSearch.cancel();
    search(raw);
  };

  const setValue = (next: string) => {
    if (!isControlled) setInnerValue(next);
    onChange?.(next);
  };

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setValue(next);
    if (isComposingRef.current) return;

    // An emptied box resets results straight away instead of after the delay
    if (next.trim() === '') searchNow(next);
    else debouncedSearch(next);
  };

  const clear = () => {
    setValue('');
    searchNow('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing) return;

    if (event.key === 'Enter') {
      searchNow(event.currentTarget.value);
    } else if (event.key === 'Escape' && currentValue) {
      // Stop the browser's own search-field clear and any parent dialog closing
      event.preventDefault();
      event.stopPropagation();
      clear();
    }
  };

  const handleCompositionStart = (event: CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = true;
    onCompositionStart?.(event);
  };

  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    debouncedSearch(event.currentTarget.value);
    onCompositionEnd?.(event);
  };

  const canClear = !!currentValue && !disabled && !readOnly;

  let rightIcon = null;
  if (loading) {
    rightIcon = (
      <LoaderCircle
        size={16}
        className={styles.spinner}
        role="status"
        aria-label={SEARCH_INPUT.LOADING}
      />
    );
  } else if (canClear) {
    rightIcon = (
      <button
        type="button"
        className={styles.clear}
        onClick={clear}
        aria-label={SEARCH_INPUT.CLEAR}
      >
        <X size={16} aria-hidden="true" />
      </button>
    );
  }

  return (
    <InputField
      data-testid="SearchInputTest"
      {...rest}
      ref={setRefs}
      type="search"
      inputMode="search"
      enterKeyHint="search"
      autoComplete="off"
      spellCheck={false}
      label={label}
      aria-label={ariaLabel ?? (label ? undefined : placeholder)}
      aria-busy={loading || undefined}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      value={currentValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      leftIcon={<Search size={18} aria-hidden="true" />}
      rightIcon={rightIcon}
      fieldClassName={clsx(styles.field, fieldClassName)}
      inputClassName={clsx(styles.input, inputClassName)}
    />
  );
}
