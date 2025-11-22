/**
 * component to handle the sidebar navigation for mobile view
 *
 * @example
 * ```tsx
 * import MobileSidebar from '@src/components/MobileSidebar'
 *
 * export default function MobileSidebar() {
 *   return <MobileSidebar label="Hello" />;
 * }
 * ```
 */
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { STRINGS } from '@/constants/strings';
import Typography from '@/components/Typography';
import SidebarNav from '@/components/SidebarNav';
import { Menu, X, CircleUserRound } from 'lucide-react';
import styles from './MobileSidebar.module.scss';

/**
 * Define the props available for the MobileSidebar component.
 */
interface MobileSidebarProps {}

export default function MobileSidebar({}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <div data-testid="MobileSidebarTest">
      {/* Hamburger Button */}
      {!isOpen && (
        <button className={styles.hamburgerBtn} onClick={() => setIsOpen(true)}>
          <Menu size={22} />
        </button>
      )}

      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

      {/* Sidebar Drawer */}
      <aside className={clsx(styles.sidebar, isOpen && styles.show)}>
        <div className={styles.header}>
          <Typography tag="h1" className={styles.logo}>
            {STRINGS.APP_NAME}
          </Typography>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.profileSection}>
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

        <SidebarNav isMobile />
      </aside>
    </div>
  );
}
