/**
 * A reusable and customizable button component that supports various styles, sizes, and interaction states.
 *
 * @example
 * ```tsx
 * import Button from '@src/components/Button'
 *
 * export default function Button() {
 *   <Button startIcon={Plus} endIcon={ArrowRight} iconSize={18} iconColor="#333">
 *      Hello
 *    </Button>
 * }
 * ```
 */

import Typography from '../Typography';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import styles from './Button.module.scss';

/**
 * Define the props available for the Button component.
 */
interface ButtonProps {
  /**
   * The content inside the button.
   * Typically a string or JSX (e.g., <span>Save</span>).
   */
  children: React.ReactNode;

  /**
   * Defines the behavior of the button when clicked.
   * - `button`: Standard clickable button (default).
   * - `submit`: Submits the form it belongs to.
   * - `reset`: Resets all form fields.
   *
   * @default "button"
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * If `true`, disables the button and prevents user interaction.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback function triggered when the button is clicked.
   *
   * @param e The mouse click event.
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Icon component (from `lucide-react`) rendered at the **start** of the button.
   */
  startIcon?: LucideIcon;

  /**
   * Icon component (from `lucide-react`) rendered at the **end** of the button.
   */
  endIcon?: LucideIcon;

  /**
   * Size of the start/end icons (in pixels).
   * Passed directly to the Lucide icon component.
   */
  iconSize?: number;

  /**
   * Color of the icons (CSS color value).
   * Accepts named colors, hex, rgb, or CSS variables.
   */
  iconColor?: string;

  /**
   * Additional CSS class names for customizing the button styles.
   * Useful for applying variant-specific styles.
   */
  className?: string;

  /**
   * If `true`, shows a loading spinner inside the button
   * and disables interaction.
   */
  loading?: boolean;
}

export default function Button({
  children,
  type = 'button',
  disabled = false,
  onClick,
  startIcon: StartIcon,
  endIcon: EndIcon,
  iconSize,
  iconColor,
  className,
  loading = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      data-testid="ButtonTest"
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(styles.button, className)}
      {...rest}
    >
      {loading ? (
        <>
          <span className={styles.loader} />
          <Typography tag="span" className={className}>
            {children}
          </Typography>
        </>
      ) : (
        <>
          {StartIcon && (
            <span className={styles.icon}>
              <StartIcon size={iconSize} color={iconColor} />
            </span>
          )}
          <Typography tag="span" className={className}>
            {children}
          </Typography>
          {EndIcon && (
            <span className={styles.icon}>
              <EndIcon size={iconSize} color={iconColor} />
            </span>
          )}
        </>
      )}
    </button>
  );
}
