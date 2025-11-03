/**
 * BaseLayout is a reusable layout component that structures the page with a main content area and an optional responsive right-side navbar.
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
'use client';

import { useState } from 'react';
import LeftSidebar from '../LeftSidebar';
import styles from './BaseLayout.module.scss';

/**
 * Define the props available for the BaseLayout component.
 */
interface BaseLayoutProps {
  children: React.ReactNode;
  showLeftNavbar?: boolean;
}

export default function BaseLayout({ children, showLeftNavbar = true }: BaseLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`${styles.container} ${
        showLeftNavbar ? (collapsed ? styles.collapsed : styles.expanded) : ''
      }`}
    >
      {showLeftNavbar && (
        <aside className={styles.leftNavbar}>
          <LeftSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
      )}

      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
