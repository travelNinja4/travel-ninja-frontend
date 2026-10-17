/**
 * Labelled text input with optional left/right icons, helper text, error state,
 * focus ring and a built-in visibility toggle for password fields.
 *
 * Accepts every native `<input>` attribute plus `ref`, so it works with
 * react-hook-form's `register()` out of the box.
 *
 * @example
 * ```tsx
 * import InputField from '@/components/InputField'
 * import { Mail } from 'lucide-react'
 *
 * export default function LoginForm() {
 *   return (
 *     <>
 *       <InputField
 *         label="Work email"
 *         type="email"
 *         placeholder="ops@wanderlytravels.example"
 *         leftIcon={<Mail size={16} />}
 *         error={errors.email}
 *       />
 *       <InputField label="Password" type="password" placeholder="Enter password" />
 *     </>
 *   );
 * }
 * ```
 */
'use client';

import { ComponentPropsWithRef, MouseEvent, ReactNode, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';
import { Caption, Label } from '../Typography';
import styles from './InputField.module.scss';

/**
 * Define the props available for the InputField component.
 * Every native input attribute (and `ref`) is passed through to the `<input>`.
 */
export interface InputFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  /**
   * Text shown above the input. Linked to the input through `htmlFor`.
   */
  label?: ReactNode;

  /**
   * Error message shown below the input. Turns the border red and marks the
   * input as `aria-invalid`.
   */
  error?: string;

  /**
   * Hint shown below the input when there is no error.
   */
  helperText?: ReactNode;

  /**
   * Icon rendered inside the field, before the text.
   */
  leftIcon?: ReactNode;

  /**
   * Icon rendered inside the field, after the text. Can be interactive
   * (e.g. a clear button); give it an `aria-label` so screen readers can name it.
   * Ignored for `type="password"`, which shows the visibility toggle instead.
   */
  rightIcon?: ReactNode;

  /**
   * Class for the outer wrapper (label + field + message).
   */
  className?: string;

  /**
   * Class for the bordered box that holds the icons and the input.
   */
  fieldClassName?: string;

  /**
   * Class for the `<input>` element itself.
   */
  inputClassName?: string;
}

export default function InputField({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  fieldClassName,
  inputClassName,
  id,
  type = 'text',
  required,
  disabled,
  readOnly,
  ...rest
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === 'password';

  const message = error || helperText;

  /**
   * Clicking anywhere in the box (icons, padding) focuses the input, except
   * on interactive children like the password toggle or a custom button.
   * preventDefault stops the mousedown from blurring the input first.
   */
  const focusInput = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (disabled || target.closest('input, button, a, [role="button"]')) return;
    event.preventDefault();
    event.currentTarget.querySelector('input')?.focus();
  };

  return (
    <div data-testid="InputFieldTest" className={clsx(styles.container, className)}>
      {label && (
        <Label tag="label" htmlFor={inputId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}

      <div
        className={clsx(
          styles.field,
          {
            [styles.hasError]: !!error,
            [styles.disabled]: disabled,
            [styles.readOnly]: readOnly,
          },
          fieldClassName,
        )}
        onMouseDown={focusInput}
      >
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}

        <input
          id={inputId}
          type={isPassword && isPasswordVisible ? 'text' : type}
          className={clsx(styles.input, inputClassName)}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error || undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        />

        {isPassword ? (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isPasswordVisible}
            disabled={disabled}
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : (
          rightIcon && <span className={styles.icon}>{rightIcon}</span>
        )}
      </div>

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
