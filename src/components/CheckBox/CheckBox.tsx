/**
 * Labelled checkbox built on a native `<input type="checkbox">`, so it keeps
 * keyboard support (Space), form submission, `required` validation and the
 * `:indeterminate` state for free. The box is restyled with CSS and an icon.
 *
 * Works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`),
 * and accepts every native input attribute plus `ref`, so it works with
 * react-hook-form's `register()` as well as `Controller`.
 *
 * @example
 * ```tsx
 * import CheckBox from '@/components/CheckBox'
 *
 * export default function TermsField() {
 *   const [accepted, setAccepted] = useState(false);
 *   return (
 *     <CheckBox
 *       name="termStatus"
 *       required
 *       checked={accepted}
 *       onChange={setAccepted}
 *       label={
 *         <>
 *           I agree to the <Link href="/terms">Terms of Service</Link> and{' '}
 *           <Link href="/privacy">Privacy Policy</Link>
 *         </>
 *       }
 *     />
 *   );
 * }
 * ```
 */
'use client';

import {
  ChangeEvent,
  ComponentPropsWithRef,
  ReactNode,
  RefCallback,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react';
import { Check, Minus } from 'lucide-react';
import clsx from 'clsx';
import { Body, Caption } from '../Typography';
import styles from './CheckBox.module.scss';

/**
 * Define the props available for the CheckBox component.
 * Every other native input attribute (and `ref`) is passed through to the `<input>`.
 */
export interface CheckBoxProps
  extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size' | 'onChange'> {
  /**
   * Text or elements shown next to the box. Links inside it stay clickable
   * without toggling the checkbox.
   */
  label?: ReactNode;

  /**
   * Secondary text shown under the label when there is no error.
   */
  helperText?: ReactNode;

  /**
   * Error message shown under the label. Turns the box red and marks the
   * input as `aria-invalid`.
   */
  error?: string;

  /**
   * Shows a dash instead of a check, e.g. for a "select all" box when only
   * some items are selected. Visual only: the next click still checks the box.
   *
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Called with the new checked state, followed by the original event.
   */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;

  /**
   * Class for the outer wrapper (box + label + message).
   */
  className?: string;

  /**
   * Class for the label text.
   */
  labelClassName?: string;
}

export default function CheckBox({
  label,
  helperText,
  error,
  indeterminate = false,
  onChange,
  className,
  labelClassName,
  id,
  required,
  disabled,
  ref,
  ...rest
}: CheckBoxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error || helperText;

  const inputRef = useRef<HTMLInputElement | null>(null);

  // `indeterminate` only exists as a DOM property, not an attribute
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  // Keep our own ref while still forwarding the caller's (object or callback ref)
  const setRefs: RefCallback<HTMLInputElement> = useCallback(
    (node) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <div data-testid="CheckBoxTest" className={clsx(styles.container, className)}>
      <label
        htmlFor={inputId}
        className={clsx(styles.root, {
          [styles.disabled]: disabled,
          [styles.hasError]: !!error,
        })}
      >
        <span className={styles.control}>
          <input
            ref={setRefs}
            type="checkbox"
            id={inputId}
            className={styles.input}
            required={required}
            disabled={disabled}
            aria-invalid={!!error || undefined}
            aria-describedby={message ? messageId : undefined}
            onChange={(event) => !disabled && onChange?.(event.target.checked, event)}
            {...rest}
          />
          <Check
            className={clsx(styles.icon, styles.checkIcon)}
            strokeWidth={3}
            aria-hidden="true"
          />
          <Minus
            className={clsx(styles.icon, styles.indeterminateIcon)}
            strokeWidth={3}
            aria-hidden="true"
          />
        </span>

        {label && (
          <Body tag="span" className={clsx(styles.label, labelClassName)}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </Body>
        )}
      </label>

      {message && (
        <Caption
          tag="p"
          id={messageId}
          role={error ? 'alert' : undefined}
          className={clsx(styles.message, { [styles.errorMessage]: !!error })}
        >
          {message}
        </Caption>
      )}
    </div>
  );
}
