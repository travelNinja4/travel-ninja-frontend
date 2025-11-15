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

import { useState, useEffect, ReactNode } from 'react';
import MobileSidebar from '../MobileSidebar';
import DesktopSidebar from '../DesktopSidebar';
import styles from './BaseLayout.module.scss';

/**
 * Define the props available for the BaseLayout component.
 */
interface BaseLayoutProps {
  /**
   * The main content to be rendered inside the layout.
   *
   * * This represents the page-specific content that appears
   * beside the sidebar and within the main viewport area.
   *
   * Typically passed as:
   *
   * @example
   * ```tsx
   * <BaseLayout>
   *   <DashboardPage />
   * </BaseLayout>
   * ```
   */
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      data-testid="BaseLayoutTest"
      className={`${styles.container} ${collapsed ? styles.collapsed : styles.expanded}`}
    >
      {isMobile ? (
        <MobileSidebar />
      ) : (
        <DesktopSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
