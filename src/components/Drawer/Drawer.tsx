/**
 * The drawer atom: a full-height panel that slides in from the right over a
 * dimmed page, e.g. a customer's or a booking's details. It provides the shell
 * (backdrop, header with the title and a close button, a scrolling body,
 * dismissal); what goes in the body is up to the component using it.
 *
 * Built on the native `<dialog>` opened with `showModal()`, so the browser
 * traps focus inside it, makes the page behind inert, and returns focus to
 * where it was on close. The title names the drawer. Its body only renders
 * while open, so a closed drawer costs nothing.
 *
 * The close button, Escape and clicks on the backdrop call `onClose`; the
 * parent decides whether to close by setting `open`. Turn them off with
 * `dismissible={false}`, e.g. while a request is in flight.
 *
 *   phone    the full screen
 *   tablet+  the chosen size's width (sm 24rem, md 28rem, lg 36rem), full height
 *   desktop+ a little more padding and a larger title
 *
 * @example
 * ```tsx
 * import Drawer from '@/components/Drawer'
 *
 * <Drawer open={customer !== null} title={customer?.name} onClose={() => setCustomer(null)}>
 *   ...
 * </Drawer>
 * ```
 */
'use client';

import { MouseEvent, ReactNode, SyntheticEvent, useEffect, useId, useRef } from 'react';
import { LucideIcon, X } from 'lucide-react';
import clsx from 'clsx';
import { STRINGS } from '@/constants/strings';
import Typography from '../Typography';
import styles from './Drawer.module.scss';

export type DrawerSize = 'sm' | 'md' | 'lg';

/**
 * Define the props available for the Drawer component.
 */
export interface DrawerProps {
  open: boolean;

  /**
   * Called on the close button, Escape or a click on the backdrop, while `dismissible`.
   */
  onClose: () => void;

  /**
   * Shown in the header and used as the drawer's accessible name.
   */
  title: ReactNode;

  children: ReactNode;

  /**
   * Icon of the close button in the header.
   *
   * @default X
   */
  closeIcon?: LucideIcon;

  /**
   * Accessible label of the close button.
   *
   * @default "Close"
   */
  closeLabel?: string;

  /**
   * Width from tablet up. Phones always get the full screen.
   *
   * @default "md"
   */
  size?: DrawerSize;

  /**
   * Whether the close button, Escape and backdrop clicks call `onClose`.
   *
   * @default true
   */
  dismissible?: boolean;

  className?: string;
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
  closeIcon: CloseIcon = X,
  closeLabel = STRINGS.CLOSE,
  size = 'md',
  dismissible = true,
  className,
}: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    dialog.showModal();
    return () => dialog.close();
  }, [open]);

  // The browser would close the dialog itself on Escape; leave that to the parent's `open`
  const onCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    if (dismissible) onClose();
  };

  // The header and body fill the dialog, so a click on the dialog element itself is on the backdrop
  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget && dismissible) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      data-testid="DrawerTest"
      aria-labelledby={titleId}
      className={clsx(styles.drawer, styles[size], className)}
      onCancel={onCancel}
      onClick={onClick}
    >
      {open && (
        <>
          <header className={styles.header}>
            <Typography
              variant="heading-3"
              tag="h2"
              id={titleId}
              truncation="ellipsis"
              className={styles.title}
            >
              {title}
            </Typography>
            <button
              type="button"
              className={styles.close}
              aria-label={closeLabel}
              disabled={!dismissible}
              onClick={onClose}
            >
              <CloseIcon size={20} aria-hidden="true" />
            </button>
          </header>
          <div className={styles.body}>{children}</div>
        </>
      )}
    </dialog>
  );
}
