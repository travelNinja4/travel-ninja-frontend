/**
 * A reusable, lightweight Tooltip component that displays contextual information on hover or focus with customizable position, theme, and arrow support.
 *
 * @example
 * ```tsx
 * import Tooltip from '@src/components/Tooltip'
 *
 * export default function Tooltip() {
 *   return <Tooltip label="Hello" />;
 * }
 * ```
 */
'use client';

import { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.scss';
import clsx from 'clsx';

/**
 * Define the props available for the Tooltip component.
 */
interface TooltipProps {
  /**
   * The trigger element that the tooltip wraps.
   *
   * he tooltip becomes visible when the user hovers or focuses on this element.
   */
  children: ReactNode;

  /**
   * The content displayed inside the tooltip.
   *
   * Can be plain text or any React node (icons, formatted text, etc.).
   */
  content: ReactNode;

  /**
   * Specifies the position of the tooltip relative to the trigger element.
   *
   * - `top` → Tooltip appears above the trigger
   * - `bottom` → Tooltip appears below the trigger
   * - `left` → Tooltip appears to the left
   * - `right` → Tooltip appears to the right
   *
   * @default "top"
   */
  position?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Defines the visual theme of the tooltip.
   *
   * - `light` → Light background with darker text
   * - `dark` → Dark background with lighter text
   *
   * @default "light"
   */
  variant?: 'dark' | 'light';

  /**
   * Whether to display the arrow pointing toward the trigger element.
   *
   * When `true`, a directional arrow is rendered based on the tooltip position.
   *
   * @default true
   */
  arrow?: boolean;

  /**
   * Optional custom class names for styling the tooltip container.
   *
   * Useful when you need to override or extend component styles.
   */
  className?: string;
}

export default function Tooltip({
  children,
  content,
  position = 'top',
  variant = 'light',
  arrow = true,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const showTooltip = (e: React.MouseEvent | React.FocusEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offset = 12;

    const pos: any = {
      top: { top: rect.top - offset, left: rect.left + rect.width / 2 },
      bottom: { top: rect.bottom + offset, left: rect.left + rect.width / 2 },
      left: { top: rect.top + rect.height / 2, left: rect.left - offset },
      right: { top: rect.top + rect.height / 2, left: rect.right + offset },
    };

    setCoords(pos[position]);
    setVisible(true);
  };

  const hideTooltip = () => setVisible(false);

  const tooltip = visible && (
    <div
      role="tooltip"
      className={clsx(styles.tooltip, styles[position], styles[variant], className)}
      style={{ top: coords.top, left: coords.left, position: 'fixed' }}
    >
      {content}
      {arrow && (
        <span className={clsx(styles.arrow, styles[`arrow-${position}`], styles[variant])} />
      )}
    </div>
  );

  return (
    <div
      data-testid="TooltipTest"
      className={styles.tooltipContainer}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {typeof window !== 'undefined' && createPortal(tooltip, document.body)}
    </div>
  );
}
