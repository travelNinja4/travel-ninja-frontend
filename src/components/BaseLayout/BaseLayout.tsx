/**
 * BaseLayout is the app shell for signed-in pages: the sidebar, the header
 * (breadcrumb and actions) and the page content. Only the content scrolls;
 * the sidebar and header stay put.
 *
 * Breakpoints are handled in CSS (no resize listeners), so this stays a
 * server component:
 * - phone   < 768px   rows: Sidebar's top bar, then content
 * - tablet  768px+    columns: Sidebar's rail, then content
 *
 * @example
 * ```tsx
 * import BaseLayout from '@src/components/BaseLayout'
 *
 * export default function DashboardLayout() {
 *   return (
 *     <BaseLayout>
 *       <h1>Dashboard Content</h1>
 *     </BaseLayout>
 *   );
 * }
 * ```
 */

import type { ReactNode } from 'react';
import { logoutAction } from '@/actions/auth';
import AppHeader from '../AppHeader';
import Sidebar from '../Sidebar';
import styles from './BaseLayout.module.scss';

/**
 * Define the props available for the BaseLayout component.
 */
interface BaseLayoutProps {
  /**
   * The page content rendered beside the sidebar.
   */
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div data-testid="BaseLayoutTest" className={styles.container}>
      <Sidebar onSignOut={logoutAction} />
      <div className={styles.content}>
        <AppHeader />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
