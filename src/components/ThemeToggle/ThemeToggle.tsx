/**
 * Switches between the light and dark theme and remembers the choice.
 *
 * The theme is the `data-theme` attribute on `<html>`; until the user picks
 * one, the app follows the OS preference. An inline script in app/layout.tsx
 * applies the saved theme before first paint, so pages never flash.
 *
 * Shows a moon in the light theme and a sun in the dark one. CSS picks the
 * icon from the same attribute, so the server render is always right.
 *
 * @example
 * ```tsx
 * import ThemeToggle from '@/components/ThemeToggle'
 *
 * export default function Header() {
 *   return <ThemeToggle />;
 * }
 * ```
 */
'use client';

import { useLayoutEffect } from 'react';
import clsx from 'clsx';
import { Moon, Sun } from 'lucide-react';
import { APP_HEADER, MEDIA_QUERIES, THEME } from '@/constants/strings';
import styles from './ThemeToggle.module.scss';

/**
 * Define the props available for the ThemeToggle component.
 */
interface ThemeToggleProps {
  className?: string;
}

type Theme = typeof THEME.LIGHT | typeof THEME.DARK;

const readSavedTheme = (): Theme | null => {
  try {
    const saved = localStorage.getItem(THEME.STORAGE_KEY);
    return saved === THEME.LIGHT || saved === THEME.DARK ? saved : null;
  } catch {
    return null;
  }
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  // React's dev-only Strict Mode remount resets <html> attributes, dropping the
  // one the inline script set. Re-apply it before paint; a no-op in production.
  useLayoutEffect(() => {
    const saved = readSavedTheme();
    if (saved) document.documentElement.dataset.theme = saved;
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia(MEDIA_QUERIES.PREFERS_DARK).matches;
    const current = root.dataset.theme ?? (prefersDark ? THEME.DARK : THEME.LIGHT);
    const next = current === THEME.DARK ? THEME.LIGHT : THEME.DARK;

    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME.STORAGE_KEY, next);
    } catch {
      // Storage blocked: the theme still applies for this visit
    }
  };

  return (
    <button
      type="button"
      data-testid="ThemeToggleTest"
      aria-label={APP_HEADER.TOGGLE_THEME}
      className={clsx(styles.button, className)}
      onClick={toggleTheme}
    >
      <Moon size={20} strokeWidth={1.75} className={styles.moon} aria-hidden="true" />
      <Sun size={20} strokeWidth={1.75} className={styles.sun} aria-hidden="true" />
    </button>
  );
}
