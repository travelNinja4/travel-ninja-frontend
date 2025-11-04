/**
 * LeftSidebar is a responsive, collapsible navigation component that adapts seamlessly between desktop (persistent sidebar) and mobile (hamburger toggle) layouts.
 *
 * @example
 * ```tsx
 * import LeftSidebar from '@src/components/LeftSidebar'
 *
 * export default function LeftSidebar() {
 *   return <LeftSidebar label="Hello" />;
 * }
 * ```
 */
'use client';

import { useState } from 'react';
import {
  LayoutGrid,
  Calendar,
  MapPin,
  Map,
  Users,
  FileText,
  MessageCircle,
  Bell,
  Settings,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  User,
  CircleUserRound,
} from 'lucide-react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './LeftSidebar.module.scss';
import Typography from '../Typography';
import AppLink from '../AppLink';

/**
 * Define the props available for the LeftSidebar component.
 */
interface LeftSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavItem {
  name: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: LayoutGrid },
  { name: 'Calendar', icon: Calendar },
  { name: 'Tours', icon: MapPin },
  { name: 'Bookings', icon: Map },
  { name: 'Customers', icon: FileText },
  { name: 'Travelers', icon: Users },
  { name: 'Invoices & Billing', icon: FileText },
];

const bottomNavItems: NavItem[] = [
  { name: 'Profile', icon: User },
  { name: 'Settings', icon: Settings },
];

export default function LeftSidebar({ collapsed, setCollapsed }: LeftSidebarProps) {
  return (
    <aside className={clsx(styles.sidebar, collapsed && styles.sidebarCollapsed)}>
      {/* Logo + Collapse Button Section */}
      <div className={styles.headerSection}>
        {!collapsed && (
          <Typography tag="h1" className={styles.logoText}>
            TravelNinja
          </Typography>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(styles.collapseBtn, collapsed && styles.collapseBtnCollapsed)}
        >
          {!collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Profile Section */}
      {!collapsed ? (
        <div className={clsx(styles.profileSection, collapsed && styles.profileCollapsed)}>
          <div className={styles.profile}>
            <CircleUserRound size={40} className={styles.avatar} />
            <div className={clsx(styles.profileInfo, collapsed && styles.hiddenText)}>
              <Typography tag="p" className={styles.userName}>
                Adventure Tours
              </Typography>
              <Typography tag="p" className={styles.userRole}>
                Agency Owner
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
      <nav className={styles.navSection}>
        {navItems.map(({ name, icon: Icon }, i) => (
          <AppLink key={i} href="/dashboard" className={styles.navItem}>
            <Icon size={20} className={styles.navIcon} />
            <Typography tag="span" className={clsx(styles.navText, collapsed && styles.hiddenText)}>
              {name}
            </Typography>
          </AppLink>
        ))}
      </nav>

      <hr className={styles.divider} />

      {/* Bottom Section */}
      <nav className={styles.navSection}>
        {bottomNavItems.map(({ name, icon: Icon }, i) => (
          <AppLink key={i} href="/dashboard" className={styles.navItem}>
            <Icon size={20} className={styles.navIcon} />
            <Typography tag="span" className={clsx(styles.navText, collapsed && styles.hiddenText)}>
              {name}
            </Typography>
          </AppLink>
        ))}
      </nav>
    </aside>
  );
}
