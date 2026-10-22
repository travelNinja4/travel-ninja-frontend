/**
 * Labelled multi-line text input with helper text, error state and focus
 * ring — the `<textarea>` counterpart of InputField, styled the same way.
 *
 * Accepts every native `<textarea>` attribute plus `ref`, so it works with
 * react-hook-form's `register()` out of the box.
 *
 * @example
 * ```tsx
 * import TextArea from '@/components/TextArea'
 *
 * export default function DayForm() {
 *   return <TextArea label="Description" rows={4} required error={errors.description} />;
 * }
 * ```
 */
'use client';

import { ComponentPropsWithRef, ReactNode, useId } from 'react';
import clsx from 'clsx';
import { Caption, Label } from '../Typography';
import styles from './TextArea.module.scss';

/**
 * Define the props available for the TextArea component.
 * Every native textarea attribute (and `ref`) is passed through to the `<textarea>`.
 */
export interface TextAreaProps extends ComponentPropsWithRef<'textarea'> {
  /**
   * Text shown above the textarea. Linked to it through `htmlFor`.
   */
  label?: ReactNode;

  /**
   * Error message shown below the textarea. Turns the border red and marks it
   * as `aria-invalid`.
   */
  error?: string;

  /**
   * Hint shown below the textarea when there is no error.
   */
  helperText?: ReactNode;

  /**
   * Class for the outer wrapper (label + textarea + message).
   */
  className?: string;

  /**
   * Class for the `<textarea>` element itself.
   */
  textAreaClassName?: string;
}

export default function TextArea({
  label,
  error,
  helperText,
  className,
  textAreaClassName,
  id,
  rows = 4,
  required,
  ...rest
}: TextAreaProps) {
  const generatedId = useId();
  const textAreaId = id ?? generatedId;
  const messageId = `${textAreaId}-message`;

  const message = error || helperText;

  return (
    <div data-testid="TextAreaTest" className={clsx(styles.container, className)}>
      {label && (
        <Label tag="label" htmlFor={textAreaId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}

      <textarea
        id={textAreaId}
        rows={rows}
        className={clsx(styles.textarea, { [styles.hasError]: !!error }, textAreaClassName)}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={message ? messageId : undefined}
        {...rest}
      />

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
