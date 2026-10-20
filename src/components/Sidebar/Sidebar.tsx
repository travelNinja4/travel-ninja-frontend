/**
 * The app sidebar for every screen size, rendered once and placed by CSS:
 *
 * - phone   < 768px    top bar with a menu button; the panel is a slide-in drawer
 * - tablet  768–1023px panel is a rail, collapsed to icons by default
 * - laptop  1024px+    panel is a rail, expanded by default
 *
 * The panel's brand header and agency footer stay fixed while the navigation
 * between them scrolls. The rail's collapsed state lives in `data-sidebar`:
 * `auto` follows the breakpoint until the toggle sets `collapsed`/`expanded`.
 * Because the breakpoints are CSS, the server render is right for every device
 * and nothing jumps on hydration.
 *
 * @example
 * ```tsx
 * import Sidebar from '@/components/Sidebar'
 *
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       <Sidebar />
 *       <main>{children}</main>
 *     </>
 *   );
 * }
 * ```
 */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, LogOut, MapIcon, Menu, X } from 'lucide-react';
import AppLink from '../AppLink';
import SidebarNav from '../SidebarNav';
import Tooltip from '../Tooltip';
import { Caption, TitleMd, TitleSm } from '../Typography';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MEDIA_QUERIES, ROUTES, SIDEBAR, STRINGS } from '@/constants/strings';
import styles from './Sidebar.module.scss';

/**
 * Define the props available for the Sidebar component.
 */
interface SidebarProps {
  /**
   * Agency shown in the footer.
   */
  agencyName?: string;

  /**
   * Subscription plan shown under the agency name.
   */
  planName?: string;

  /**
   * Called when "Sign out" is clicked.
   */
  onSignOut?: () => void;
}

const PANEL_ID = 'app-sidebar';

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

export default function Sidebar({
  agencyName = SIDEBAR.AGENCY_NAME,
  planName = SIDEBAR.AGENCY_PLAN,
  onSignOut,
}: SidebarProps) {
  const isPhone = useMediaQuery(MEDIA_QUERIES.PHONE);
  const isTablet = useMediaQuery(MEDIA_QUERIES.TABLET_ONLY);
  // null = follow the breakpoint until the user picks a state
  const [collapsedChoice, setCollapsedChoice] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // The drawer only exists on phones; widening the window simply drops it
  const drawerOpen = isPhone && isOpen;
  // Collapsing only applies to the rail; it switches on tooltips and icon-only labels
  const collapsed = !isPhone && (collapsedChoice ?? isTablet);
  let sidebarState = 'auto';
  if (collapsedChoice !== null) sidebarState = collapsedChoice ? 'collapsed' : 'expanded';

  const closeDrawer = useCallback(() => setIsOpen(false), []);

  // While the drawer is open: focus its close button and close on Escape.
  // No scroll lock needed: only <main> scrolls, and the overlay covers it.
  useEffect(() => {
    if (!drawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };

    closeBtnRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, closeDrawer]);

  const signOutButton = (
    <button
      type="button"
      className={styles.signOut}
      aria-label={collapsed ? SIDEBAR.SIGN_OUT : undefined}
      onClick={onSignOut}
    >
      <LogOut size={18} strokeWidth={1.75} className={styles.signOutIcon} aria-hidden="true" />
      <span className={styles.label}>{SIDEBAR.SIGN_OUT}</span>
    </button>
  );

  return (
    <div data-testid="SidebarTest" className={styles.root}>
      {/* Phones only */}
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.menuBtn}
          aria-label={SIDEBAR.OPEN_NAVIGATION}
          aria-expanded={drawerOpen}
          aria-controls={PANEL_ID}
          onClick={() => setIsOpen(true)}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <span className={clsx(styles.brandMark, styles.brandMarkSm)} aria-hidden="true">
          <MapIcon size={16} strokeWidth={1.75} />
        </span>
        <TitleMd tag="span">{STRINGS.APP_NAME}</TitleMd>
      </header>

      {drawerOpen && (
        <div data-testid="SidebarOverlay" className={styles.overlay} onClick={closeDrawer} />
      )}

      <aside
        id={PANEL_ID}
        data-sidebar={sidebarState}
        role={drawerOpen ? 'dialog' : undefined}
        aria-modal={drawerOpen || undefined}
        aria-label={SIDEBAR.MAIN_NAVIGATION}
        className={clsx(styles.panel, drawerOpen && styles.open)}
      >
        <div className={styles.header}>
          <AppLink
            href={ROUTES.DASHBOARD}
            className={styles.brand}
            aria-label={collapsed ? STRINGS.APP_NAME : undefined}
            onClick={closeDrawer}
          >
            <span className={styles.brandMark} aria-hidden="true">
              <MapIcon size={18} strokeWidth={1.75} />
            </span>
            <span className={styles.brandText}>
              <TitleMd tag="span" truncation="ellipsis">
                {STRINGS.APP_NAME}
              </TitleMd>
              <Caption tag="span" truncation="ellipsis" className={styles.muted}>
                {STRINGS.AGENCY_DASHBOARD}
              </Caption>
            </span>
          </AppLink>

          {/* Phones only */}
          <button
            ref={closeBtnRef}
            type="button"
            className={styles.closeBtn}
            aria-label={SIDEBAR.CLOSE_NAVIGATION}
            onClick={closeDrawer}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Tablet and up */}
        <button
          type="button"
          className={styles.toggle}
          aria-label={collapsed ? SIDEBAR.EXPAND : SIDEBAR.COLLAPSE}
          aria-expanded={!collapsed}
          aria-controls={PANEL_ID}
          onClick={() => setCollapsedChoice(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight size={14} aria-hidden="true" />
          ) : (
            <ChevronLeft size={14} aria-hidden="true" />
          )}
        </button>

        <SidebarNav collapsed={collapsed} onNavigate={closeDrawer} />

        <div className={styles.footer}>
          <div className={styles.account}>
            <span className={styles.avatar} aria-hidden="true">
              {getInitials(agencyName)}
            </span>
            <span className={styles.accountText}>
              <TitleSm tag="span" truncation="ellipsis">
                {agencyName}
              </TitleSm>
              <Caption tag="span" truncation="ellipsis" className={styles.muted}>
                {planName}
              </Caption>
            </span>
          </div>

          {collapsed ? (
            <Tooltip content={SIDEBAR.SIGN_OUT} position="right" variant="dark" arrow={false}>
              {signOutButton}
            </Tooltip>
          ) : (
            signOutButton
          )}
        </div>
      </aside>
    </div>
  );
}
