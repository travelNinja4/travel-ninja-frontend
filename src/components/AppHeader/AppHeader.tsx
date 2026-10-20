/**
 * The top bar of every signed-in screen: the breadcrumb for the current route
 * on the left, and the theme toggle and notifications on the right.
 *
 * The breadcrumb follows the URL, starting from the Dashboard:
 * `/dashboard` shows `Dashboard`, `/tours` shows `Dashboard / Tours`.
 * BaseLayout renders it, so screens get it without doing anything.
 *
 * @example
 * ```tsx
 * import AppHeader from '@/components/AppHeader'
 *
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       <AppHeader />
 *       <main>{children}</main>
 *     </>
 *   );
 * }
 * ```
 */
'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import Breadcrumb from '../Breadcrumb';
import ThemeToggle from '../ThemeToggle';
import { APP_HEADER } from '@/constants/strings';
import { getBreadcrumbs } from '@/utils/breadcrumbs';
import styles from './AppHeader.module.scss';

/**
 * Define the props available for the AppHeader component.
 */
interface AppHeaderProps {
  /**
   * Called when the notifications button is clicked.
   */
  onNotificationsClick?: () => void;
}

export default function AppHeader({ onNotificationsClick }: AppHeaderProps) {
  const pathname = usePathname() ?? '';
  const breadcrumbs = useMemo(() => getBreadcrumbs(pathname), [pathname]);

  return (
    <header data-testid="AppHeaderTest" className={styles.header}>
      <Breadcrumb items={breadcrumbs} />

      <div className={styles.actions}>
        <ThemeToggle />
        <button
          type="button"
          className={styles.iconButton}
          aria-label={APP_HEADER.NOTIFICATIONS}
          onClick={onNotificationsClick}
        >
          <Bell size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
