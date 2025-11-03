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
  const [active, setActive] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setMobileOpen((prev) => !prev);

  return (
    <>
      {/* Mobile Hamburger */}
      {/* <div className={clsx(styles.mobileToggle, 'md:hidden')}>
        <button onClick={toggleSidebar} className={styles.hamburgerBtn}>
          {mobileOpen ? <X className={styles.icon} /> : <Menu className={styles.icon} />}
        </button>
      </div> */}

      {/* Sidebar */}
      <aside
        className={clsx(
          styles.sidebar,
          collapsed && styles.collapsed,
          mobileOpen ? styles.open : styles.closed,
        )}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(styles.collapseBtn, 'hidden md:block')}
        >
          {!collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Logo section */}
        {!collapsed && (
          <div className={styles.headerSection}>
            <div className={styles.headerContent}>
              <Typography tag="h1" className={styles.companyName}>
                TravelNinja
              </Typography>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {!collapsed && (
          <div className={styles.profileSection}>
            <div className={styles.profile}>
              <CircleUserRound size={40} className={styles.avatar} />
              <div>
                <Typography tag="p" className={styles.userName}>
                  Adventure Tours
                </Typography>
                <Typography tag="p" className={styles.userRole}>
                  Agency Owner
                </Typography>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className={styles.nav}>
          {navItems.map(({ name, icon: Icon }) => (
            <li className={styles.navItem}>
              <AppLink href="/dashboard" className={styles.navLink}>
                <Icon className={styles.navIcon} />
                {!collapsed && <Typography tag="span">{name}</Typography>}
              </AppLink>
            </li>
          ))}
        </nav>

        <hr className={styles.divider} />

        {/* Utility Section */}
        <nav className={styles.nav}>
          {bottomNavItems.map(({ name, icon: Icon, badge }) => (
            <li className={styles.navItem}>
              <AppLink href="/dashboard" className={styles.navLink}>
                <Icon className={styles.navIcon} />
                {!collapsed && <Typography tag="span">{name}</Typography>}
              </AppLink>
            </li>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)}></div>}
    </>
  );
}
