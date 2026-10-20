'use client';

/**
 * Custom React hook that delays calling a function until `delay` ms have
 * passed without another call. Only the last call's arguments are used.
 *
 * The returned function keeps the same identity across renders (it only
 * changes with `delay`) and always calls the latest `callback`, so the
 * callback does not need to be memoised. Any pending call is dropped on unmount.
 *
 * @example
 * ```tsx
 * import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
 *
 * export default function Filter() {
 *   const saveFilter = useDebouncedCallback((text: string) => save(text), 300);
 *   return <input onChange={(e) => saveFilter(e.target.value)} onBlur={saveFilter.flush} />;
 * }
 * ```
 *
 * @param callback The function to debounce
 * @param delay Wait time in milliseconds
 * @returns The debounced function, with `cancel()` to drop a pending call and
 * `flush()` to run it now
 */

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

export interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void;
  /** Drops the pending call, if any. */
  cancel: () => void;
  /** Runs the pending call now, if any. */
  flush: () => void;
}

export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): DebouncedFunction<Args> => {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingArgsRef = useRef<Args | null>(null);

  // Keep the latest callback without changing the debounced function's identity
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useMemo(() => {
    const run = () => {
      const args = pendingArgsRef.current;
      timerRef.current = undefined;
      pendingArgsRef.current = null;
      if (args) callbackRef.current(...args);
    };

    const debounced = ((...args: Args) => {
      pendingArgsRef.current = args;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(run, delay);
    }) as DebouncedFunction<Args>;

    debounced.cancel = () => {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
      pendingArgsRef.current = null;
    };

    debounced.flush = () => {
      clearTimeout(timerRef.current);
      run();
    };

    return debounced;
  }, [delay]);
};
