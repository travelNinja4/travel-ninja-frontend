/**
 * A common dialog that asks the user to confirm an action, or tells them one
 * went through: deleting a tour, discarding changes, "Tour published", and so
 * on. Built on the Modal atom, so it gets the native modal behaviour (focus
 * trap, inert page, Escape) and its responsive sizing.
 *
 * The `tone` sets the icon and the confirm button: `danger` uses the red
 * button, the others the primary one. Cancel comes first, so the browser
 * focuses it and pressing Enter straight away never confirms a destructive
 * action. Set `showCancel={false}` for a single acknowledgement button, e.g.
 * after a success.
 *
 * While `loading`, the buttons are disabled and Escape and backdrop clicks are
 * ignored, so the dialog stays until the action settles.
 *
 *   every screen  icon above the title and description, centred
 *   phone         buttons share the row
 *   tablet+       buttons at their own width, centred
 *
 * @example
 * ```tsx
 * import ConfirmDialog from '@/components/ConfirmDialog'
 *
 * <ConfirmDialog
 *   open={tourToDelete !== null}
 *   tone="danger"
 *   icon={Trash2}
 *   title="Delete this tour?"
 *   description="This can't be undone."
 *   confirmLabel="Delete tour"
 *   loading={isDeleting}
 *   onConfirm={deleteTour}
 *   onCancel={() => setTourToDelete(null)}
 * />
 *
 * <ConfirmDialog
 *   open={published}
 *   tone="success"
 *   title="Tour published"
 *   description="Guests can now find and book it."
 *   confirmLabel="Done"
 *   showCancel={false}
 *   onConfirm={close}
 *   onCancel={close}
 * />
 * ```
 */
'use client';

import { ReactNode, useId } from 'react';
import { CircleAlert, CircleCheck, Info, LucideIcon, TriangleAlert } from 'lucide-react';
import clsx from 'clsx';
import { STRINGS } from '@/constants/strings';
import Modal from '../Modal';
import Typography from '../Typography';
import Button from '../Button';
import styles from './ConfirmDialog.module.scss';

export type ConfirmDialogTone = 'danger' | 'warning' | 'success' | 'info';

const TONE_ICONS: Record<ConfirmDialogTone, LucideIcon> = {
  danger: CircleAlert,
  warning: TriangleAlert,
  success: CircleCheck,
  info: Info,
};

/**
 * Define the props available for the ConfirmDialog component.
 */
export interface ConfirmDialogProps {
  open: boolean;

  title: string;

  /**
   * What happens on confirm, or what just happened, below the title.
   */
  description?: ReactNode;

  /**
   * Label of the confirm button, naming the action, e.g. "Delete tour".
   */
  confirmLabel: string;

  /**
   * @default "Cancel"
   */
  cancelLabel?: string;

  /**
   * Hide Cancel for a dialog with a single acknowledgement button.
   *
   * @default true
   */
  showCancel?: boolean;

  /**
   * Sets the icon and its colour, and the confirm button's style.
   *
   * @default "info"
   */
  tone?: ConfirmDialogTone;

  /**
   * Replaces the tone's icon, e.g. a bin for a delete.
   */
  icon?: LucideIcon;

  /**
   * Shows a spinner on the confirm button and stops the dialog from closing.
   *
   * @default false
   */
  loading?: boolean;

  onConfirm: () => void;

  /**
   * Called on Cancel, Escape or a click on the backdrop.
   */
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = STRINGS.CANCEL,
  showCancel = true,
  tone = 'info',
  icon: Icon = TONE_ICONS[tone],
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      role="alertdialog"
      dismissible={!loading}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div data-testid="ConfirmDialogTest" className={styles.content}>
        <span className={clsx(styles.icon, styles[tone])}>
          <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
        </span>

        <div className={styles.text}>
          <Typography variant="heading-3" tag="h2" id={titleId} className={styles.title}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body" id={descriptionId} className={styles.description}>
              {description}
            </Typography>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        {showCancel && (
          <Button
            variant="secondary"
            className={styles.action}
            disabled={loading}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          variant={tone === 'danger' ? 'danger' : 'primary'}
          className={styles.action}
          loading={loading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
