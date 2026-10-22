/**
 * The modal atom: a centred panel over a dimmed page. It only provides the
 * shell (backdrop, sizing, scrolling, dismissal); what goes inside is up to
 * the component using it, e.g. ConfirmDialog.
 *
 * Built on the native `<dialog>` opened with `showModal()`, so the browser
 * traps focus inside it, makes the page behind inert, focuses the first
 * focusable element and returns focus to where it was on close. Its content
 * only renders while open, so a closed modal costs nothing.
 *
 * Escape and clicks on the backdrop call `onClose`; the parent decides whether
 * to close by setting `open`. Turn them off with `dismissible={false}`, e.g.
 * while a request is in flight.
 *
 *   phone    full width less a 1rem gap each side, up to the screen's height
 *   tablet+  the chosen size's width (sm 24rem, md 30rem, lg 40rem)
 *
 * @example
 * ```tsx
 * import Modal from '@/components/Modal'
 *
 * <Modal open={open} onClose={() => setOpen(false)} aria-labelledby={titleId}>
 *   <h2 id={titleId}>Share tour</h2>
 *   ...
 * </Modal>
 * ```
 */
'use client';

import { MouseEvent, ReactNode, SyntheticEvent, useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './Modal.module.scss';

export type ModalSize = 'sm' | 'md' | 'lg';

/**
 * Define the props available for the Modal component.
 */
export interface ModalProps {
  open: boolean;

  /**
   * Called on Escape or a click on the backdrop, while `dismissible`.
   */
  onClose: () => void;

  children: ReactNode;

  /**
   * Maximum width from tablet up. Phones always get the full width less a small gap.
   *
   * @default "md"
   */
  size?: ModalSize;

  /**
   * Whether Escape and backdrop clicks call `onClose`.
   *
   * @default true
   */
  dismissible?: boolean;

  /**
   * `alertdialog` for content that needs a response, e.g. a confirmation.
   *
   * @default "dialog"
   */
  role?: 'dialog' | 'alertdialog';

  /**
   * Id of the modal's title. A modal needs an accessible name.
   */
  'aria-labelledby'?: string;

  'aria-describedby'?: string;

  className?: string;
}

export default function Modal({
  open,
  onClose,
  children,
  size = 'md',
  dismissible = true,
  role = 'dialog',
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  // The panel fills the dialog, so a click on the dialog element itself is on the backdrop
  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget && dismissible) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      data-testid="ModalTest"
      role={role}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={clsx(styles.modal, styles[size], className)}
      onCancel={onCancel}
      onClick={onClick}
    >
      {open && <div className={styles.panel}>{children}</div>}
    </dialog>
  );
}
