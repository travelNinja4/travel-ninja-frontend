'use client';

/**
 * Custom React hook that tracks whether a CSS media query matches.
 *
 * Subscribes to the query's `change` event only, so it re-renders when the
 * match flips rather than on every resize. Returns `false` during server
 * rendering; pair it with CSS media queries for anything visible on first paint.
 *
 * @example
 * ```tsx
 * import { useMediaQuery } from '@/hooks/useMediaQuery';
 *
 * export default function MyComponent() {
 *   const isTablet = useMediaQuery('(max-width: 1023.98px)');
 *   return <p>{isTablet ? 'Tablet' : 'Desktop'}</p>;
 * }
 * ```
 *
 * @param {string} query A media query, e.g. `(min-width: 768px)`
 * @returns {boolean} `true` while the query matches
 */

import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = () => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
