/**
 * Checkbox component is a clickable UI element that allows users to select or deselect an option
 *
 * @example
 * ```tsx
 * import CheckBox from '@src/components/CheckBox'
 *
 * export default function CheckBox() {
 *   return <CheckBox
 *          name="policyCheck"
 *          label={
 *               <>
 *               I agree to the{' '}
 *               <Link href="/terms">
 *                Terms of Service
 *                </Link>{' '}
 *                and <Link href="/privacy">Privacy Policy</Link>
 *                </>
 *          }
 *          checked={true}
 *          onChange={()=>{}}
 *      />;
 * }
 * ```
 */

'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import Typography, { Tags } from '@/components/Typography';
import styles from './CheckBox.module.scss';

/**
 * Define the props available for the CheckBox component.
 */
interface CheckBoxProps {
  /**
   * The label displayed next to the checkbox.
   * Can be a string, React element, or any valid ReactNode.
   *
   * @example
   * label="Accept terms"
   * @example
   * label={<span>Custom label element</span>}
   */
  label: ReactNode;

  /**
   * The HTML tag to use for rendering the label text.
   * Defaults to `'span'`.
   * Useful for semantic markup (e.g., 'h3', 'p', etc.).
   */
  tag?: Tags;

  /**
   * Name attribute of the checkbox input element.
   * Also used to generate a unique `id` for the checkbox if not provided.
   */
  name?: string;

  /**
   * Value attribute of the checkbox input element.
   * Sent as part of form data when the checkbox is checked.
   */
  value?: string;

  /**
   * Whether the checkbox is required in a form.
   * When `true`, form submission will be blocked until this checkbox is checked.
   */
  required?: boolean;

  /**
   * Whether the checkbox is displayed in an indeterminate state.
   * This is a visual state often used to represent a partially selected group.
   */
  indeterminate?: boolean;
  /**
   * Controlled checked state for the checkbox.
   * Use this for fully controlled components where state is managed externally.
   * @default false
   */
  checked?: boolean;

  /**
   * Initial checked state for the checkbox.
   * Use this for uncontrolled components where the checkbox manages its own state.
   */
  defaultChecked?: boolean;

  /**
   * Whether the checkbox is disabled.
   * When `true`, the checkbox cannot be interacted with.
   */
  disabled?: boolean;

  /**
   * Callback fired when the checked state changes.
   * Will not be called if the checkbox is disabled.
   *
   * @param checked - The new checked state of the checkbox.
   * @returns
   */
  onChange?: (checked: boolean) => void;

  /**
   * Additional CSS class names to apply to the root label element.
   */
  className?: string;

  /**
   * Inline CSS styles to apply to the root label element.
   */
  style?: React.CSSProperties;
}

export default function CheckBox({
  label,
  tag = 'span',
  name,
  value,
  required,
  indeterminate = false,
  checked,
  defaultChecked,
  disabled,
  onChange,
  style,
}: CheckBoxProps) {
  const checkboxId = name || `checkbox-${Math.random()}`;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    } else if (onChange) {
      onChange(e.target.checked);
    }
  };

  const getLabelContent = () => {
    if (typeof label === 'string' || React.isValidElement(label)) {
      return label;
    }
  };

  return (
    <label
      data-testid="CheckBoxTest"
      htmlFor={checkboxId}
      className={styles.checkBoxContainer}
      style={style}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={checkboxId}
        name={name}
        value={value}
        required={required}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        className={styles.checkbox}
      />
      {label && <Typography tag={tag}>{getLabelContent()}</Typography>}
    </label>
  );
}
