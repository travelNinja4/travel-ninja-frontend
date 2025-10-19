/**
 * TextField is a reusable input component that standardizes text input styles, behavior, and validation across the application.
 *
 * @example
 * ```tsx
 * import TextField from '@src/components/TextField'
 *
 * export default function TextField() {
 *   return (
 *          <TextField
 *            label="Username"
 *            name="username"
 *            placeholder="Enter your username"
 *            value={username}
 *            onChange={(e) => setUsername(e.target.value)}
 *            error={formErrors.username}
 *      />
 *    )
 * }
 * ```
 */
'use client';

import { useState } from 'react';
import Typography from '../Typography';
import { EyeOff, Eye, Calendar } from 'lucide-react';
import clsx from 'clsx';
import styles from './TextField.module.scss';

/**
 * Define the props available for the TextField component.
 */
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * The unique identifier for the input element.
   * Useful for associating the input with a label via the `htmlFor` attribute.
   */
  id?: string;

  /**
   * The name of the input field.
   * Used for form submissions and identifying form data.
   */
  name?: string;

  /**
   * The text label displayed alongside the input.
   * Helps describe the purpose of the input for users and accessibility tools.
   */
  label?: string | React.ReactNode;

  /**
   * The type of input (e.g., "text", "password", "email").
   * Defaults to `"text"` if not provided.
   */
  type?: string;

  /**
   * The error message to display when validation fails.
   * Typically shown below the input in a distinct color (e.g., red).
   */
  error?: string;

  /**
   * The placeholder text displayed when the input is empty.
   * Gives users a hint about what to enter.
   */
  placeholder?: string;

  /**
   * The current value of the input.
   * Used in controlled components to manage state.
   */
  value?: string;

  /**
   * Whether the input should be disabled.
   * A disabled input cannot be focused or modified by the user.
   */
  disabled?: boolean;

  /**
   * Additional CSS class names for custom styling.
   */
  className?: string;

  /**
   * Additional CSS class names for custom styling the input.
   */
  inputClassName?: string;

  /**
   * The default value of the input (uncontrolled component).
   * Use `value` instead for controlled components.
   */
  defaultValue?: string;

  /**
   * Whether the input is required before form submission.
   * Adds `required` validation in HTML.
   */
  required?: boolean;

  /**
   * The maximum number of characters the user can enter.
   */
  maxLength?: number;

  /**
   * The minimum number of characters required for the input to be valid.
   */
  minLength?: number;

  /**
   * Controls capitalization behavior (e.g., "none", "sentences", "words", "characters").
   * Primarily used in mobile browsers.
   */
  autoCapitalize?: string;

  /**
   *
   */
  isCalender?: boolean;

  /**
   * Event handler triggered when the input value changes.
   * @param event - The change event containing the updated value.
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function TextField({
  label,
  error,
  type = 'text',
  id,
  name,
  placeholder,
  value,
  disabled = false,
  className,
  inputClassName,
  defaultValue,
  required = false,
  maxLength,
  minLength,
  autoCapitalize,
  isCalender,
  onChange,
  ...rest
}: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordType = type === 'password';

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div data-testid="TextFieldTest" className={clsx(styles.container, className)}>
      {label && (
        <Typography tag="label" htmlFor={id} className={styles.label}>
          {label}{' '}
          {required && (
            <Typography tag="span" className={styles.label}>
              *
            </Typography>
          )}
        </Typography>
      )}
      <div className={styles.inputWrapper}>
        <input
          type={isPasswordType && isPasswordVisible ? 'text' : type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          className={clsx(styles.inputField, inputClassName, {
            [styles.inputWithIcon]: isPasswordType,
          })}
          disabled={disabled}
          defaultValue={defaultValue}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          autoCapitalize={autoCapitalize}
          onChange={onChange}
          {...rest}
        />
        {isPasswordType && (
          <div className={styles.iconButton} onClick={togglePasswordVisibility}>
            {isPasswordVisible ? <EyeOff /> : <Eye />}
          </div>
        )}
        {isCalender && (
          <div className={styles.iconButton} onClick={togglePasswordVisibility}>
            <Calendar size={16} />
          </div>
        )}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
