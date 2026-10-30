/**
 * Grouped navigation links for the sidebar (desktop rail and mobile drawer).
 * It is the sidebar's scrollable middle: when the list outgrows the viewport,
 * only this area scrolls while the sidebar header and footer stay put.
 *
 * @example
 * ```tsx
 * import SidebarNav from '@/components/SidebarNav'
 *
 * export default function Sidebar() {
 *   return <SidebarNav collapsed={false} />;
 * }
 * ```
 */
'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Building,
  CalendarCheck,
  CalendarDays,
  // ChartLine,
  // IndianRupee,
  LayoutDashboard,
  Map,
  // MessageSquare,
  Settings,
  // Star,
  Ticket,
  Users,
  Wallet,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import AppLink from '../AppLink';
import Tooltip from '../Tooltip';
import { Overline } from '../Typography';
import { NAV_ITEM, NAV_SECTION, ROUTES, SIDEBAR } from '@/constants/strings';
import styles from './SidebarNav.module.scss';

/**
 * Define the props available for the SidebarNav component.
 */
interface SidebarNavProps {
  /**
   * Whether the sidebar is currently collapsed to icons.
   *
   * Labels are hidden by CSS; this flag only switches on the hover tooltips
   * that name each icon.
   */
  collapsed?: boolean;

  /**
   * Called after a link is clicked, e.g. to close the mobile drawer.
   */
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Count shown as a pill (a dot when collapsed), e.g. unread messages. */
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: NAV_SECTION.OPERATIONS,
    items: [
      { label: NAV_ITEM.DASHBOARD, href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: NAV_ITEM.TOURS, href: ROUTES.TOURS, icon: Map },
      { label: NAV_ITEM.BOOKINGS, href: ROUTES.BOOKINGS, icon: Ticket },
      { label: NAV_ITEM.CUSTOMERS, href: ROUTES.CUSTOMERS, icon: Users },
      { label: NAV_ITEM.CALENDAR, href: ROUTES.CALENDAR, icon: CalendarDays },
      { label: NAV_ITEM.AVAILABILITY, href: ROUTES.AVAILABILITY, icon: CalendarCheck },
    ],
  },
  // Engage and Insights are hidden until their screens are built
  // {
  //   title: NAV_SECTION.ENGAGE,
  //   items: [
  //     { label: NAV_ITEM.MESSAGES, href: ROUTES.MESSAGES, icon: MessageSquare, badge: 2 },
  //     { label: NAV_ITEM.REVIEWS, href: ROUTES.REVIEWS, icon: Star },
  //   ],
  // },
  // {
  //   title: NAV_SECTION.INSIGHTS,
  //   items: [
  //     { label: NAV_ITEM.TOUR_PERFORMANCE, href: ROUTES.TOUR_PERFORMANCE, icon: ChartLine },
  //     { label: NAV_ITEM.REVENUE, href: ROUTES.REVENUE, icon: IndianRupee },
  //   ],
  // },
  {
    title: NAV_SECTION.ACCOUNT,
    items: [
      { label: NAV_ITEM.AGENCY_PROFILE, href: ROUTES.AGENCY_PROFILE, icon: Building },
      { label: NAV_ITEM.SETTINGS, href: ROUTES.SETTINGS, icon: Settings },
      { label: NAV_ITEM.BILLING, href: ROUTES.BILLING, icon: Wallet },
    ],
  },
];

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export default function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname() ?? '';

  return (
    <nav data-testid="SidebarNavTest" aria-label={SIDEBAR.MAIN_NAVIGATION} className={styles.nav}>
      {NAV_SECTIONS.map(({ title, items }) => (
        <div key={title} className={styles.section}>
          <Overline tag="h2" className={styles.sectionTitle}>
            {title}
          </Overline>

          <ul className={styles.list}>
            {items.map(({ label, href, icon: Icon, badge }) => {
              const isActive = isActivePath(pathname, href);
              const link = (
                <AppLink
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={collapsed ? label : undefined}
                  className={clsx(styles.navItem, isActive && styles.active)}
                  onClick={onNavigate}
                >
                  <Icon size={18} strokeWidth={1.75} className={styles.icon} aria-hidden="true" />
                  <span className={styles.label}>{label}</span>
                  {badge ? <span className={styles.badge}>{badge}</span> : null}
                </AppLink>
              );

              return (
                <li key={href} className={styles.listItem}>
                  {collapsed ? (
                    <Tooltip content={label} position="right" variant="dark" arrow={false}>
                      {link}
                    </Tooltip>
                  ) : (
                    link
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
