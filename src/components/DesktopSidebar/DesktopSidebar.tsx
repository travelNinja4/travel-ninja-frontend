/**
 * component to show sidebar navigation for desktop
 *
 * @example
 * ```tsx
 * import DesktopSidebar from '@src/components/DesktopSidebar'
 *
 * export default function DesktopSidebar() {
 *   return <DesktopSidebar label="Hello" />;
 * }
 * ```
 */

import clsx from 'clsx';
import Typography from '../Typography';
import SidebarNav from '../SidebarNav';
import { STRINGS } from '@/constants/strings';
import { ChevronRight, ChevronLeft, CircleUserRound } from 'lucide-react';
import styles from './DesktopSidebar.module.scss';

/**
 * Define the props available for the DesktopSidebar component.
 */
interface DesktopSidebarProps {
  /**
   * Controls whether the sidebar is collapsed.
   *
   * - `true` → Sidebar is collapsed (icons only)
   * - `false` → Sidebar is expanded (full view)
   *
   * This value is controlled externally by the parent component.
   */
  collapsed?: boolean;

  /**
   * Setter function to toggle the collapsed state of the sidebar.
   *
   * Typically used when the user clicks the collapse/expand toggle button.
   */
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DesktopSidebar({ collapsed, setCollapsed }: DesktopSidebarProps) {
  return (
    <aside
      data-testid="DesktopSidebarTest"
      className={clsx(styles.sidebar, collapsed && styles.collapsed)}
    >
      {/* Header Section */}
      <div className={styles.header}>
        {!collapsed && (
          <Typography tag="h1" className={styles.logo}>
            {STRINGS.APP_NAME}
          </Typography>
        )}
        <button className={clsx(styles.collapseBtn)} onClick={() => setCollapsed?.(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Profile Section */}
      {!collapsed ? (
        <div className={clsx(styles.profileSection)}>
          <div className={styles.profile}>
            <CircleUserRound size={40} className={styles.avatar} />
            <div>
              <Typography tag="p" className={styles.userName}>
                Adventure Tours
              </Typography>
              <Typography tag="p" className={styles.userRole}>
                {STRINGS.AGENCY_OWNER}
              </Typography>
            </div>
          </div>
        </div>
      ) : (
        <div className={clsx(styles.profileCollapsed)}>
          <div className={styles.profile}>
            <CircleUserRound size={40} className={styles.avatar} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <SidebarNav collapsed={!!collapsed} />
    </aside>
  );
}
