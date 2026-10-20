/**
 * BaseLayout is the app shell for signed-in pages: the sidebar and the page
 * content, which scrolls independently of the sidebar.
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
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
