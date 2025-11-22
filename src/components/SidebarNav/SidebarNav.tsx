/**
 * wrapper component for sidebar navigation for both mobile and web
 *
 * @example
 * ```tsx
 * import SidebarNav from '@src/components/SidebarNav'
 *
 * export default function SidebarNav() {
 *   return <SidebarNav label="Hello" />;
 * }
 * ```
 */
'use client';

import AppLink from '../AppLink';
import Typography from '../Typography';
import Tooltip from '../Tooltip';
import { NAV_ITEM } from '@/constants/strings';
import { LayoutGrid, Calendar, MapPin, Map, Users, FileText, Settings, User } from 'lucide-react';
import styles from './SidebarNav.module.scss';

/**
 * Define the props available for the SidebarNav component.
 */
interface SidebarNavProps {
  /**
   * Indicates whether the sidebar is in a collapsed state.
   *
   * - `true` → Only icons are shown.
   * - `false` → Icons with labels are shown.
   *
   * Commonly controlled by the parent sidebar component.
   */
  collapsed?: boolean;

  /**
   * Specifies if the sidebar is being rendered in a mobile layout.
   *
   * This is used to:
   * - Disable tooltips (tooltips appear only on desktop when collapsed).
   * - Render mobile-friendly navigation behavior.
   *
   * Defaults to `false` when unspecified.
   */
  isMobile?: boolean;
}

const navItems = [
  { name: NAV_ITEM.DASHBOARD, icon: LayoutGrid },
  { name: NAV_ITEM.CALENDER, icon: Calendar },
  { name: NAV_ITEM.TOURS, icon: MapPin },
  { name: NAV_ITEM.BOOKINGS, icon: Map, href: '/bookings' },
  { name: NAV_ITEM.CUSTOMERS, icon: FileText },
  { name: NAV_ITEM.TRAVELERS, icon: Users },
  { name: NAV_ITEM.INVOICES_AND_BILLING, icon: FileText },
];

const bottomNavItems = [
  { name: NAV_ITEM.PROFILE, icon: User },
  { name: NAV_ITEM.SETTINGS, icon: Settings },
];

export default function SidebarNav({ collapsed, isMobile }: SidebarNavProps) {
  const renderNavItems = (items: typeof navItems) =>
    items.map(({ name, icon: Icon, href }, i) => {
      // Tooltip only for desktop collapsed
      if (collapsed && !isMobile) {
        return (
          <Tooltip key={i} content={name} position="right" variant="light" arrow>
            <AppLink href={href ?? '/'} className={styles.navItem}>
              <Icon size={20} className={styles.icon} />
            </AppLink>
          </Tooltip>
        );
      }

      // No tooltip for mobile or expanded
      return (
        <AppLink key={i} href={href ?? '/'} className={styles.navItem}>
          <Icon size={20} className={styles.icon} />
          {!collapsed && <Typography tag="span">{name}</Typography>}
        </AppLink>
      );
    });

  return (
    <nav data-testid="SidebarNavTest" className={styles.nav}>
      {renderNavItems(navItems)}
      <hr className={styles.divider} />
      {renderNavItems(bottomNavItems)}
    </nav>
  );
}
