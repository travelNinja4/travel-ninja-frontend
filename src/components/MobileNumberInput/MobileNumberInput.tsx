/**
 * Mobile number field with a fixed dial code (+91 by default) the user can't edit, followed by
 * the national number. Built on `InputField`, so it takes every native input attribute plus `ref`
 * and works with react-hook-form's `register()` out of the box.
 *
 * Typed or pasted values are cleaned before they reach `onChange`: anything but digits is
 * dropped, as is a leading dial code or trunk `0`, so autofilled "+91 98765 43210" becomes
 * "9876543210".
 *
 * @example
 * ```tsx
 * import MobileNumberInput from '@/components/MobileNumberInput'
 *
 * export default function ContactForm() {
 *   return (
 *     <MobileNumberInput
 *       {...register('mobileNumber')}
 *       label="Mobile number"
 *       error={errors.mobileNumber?.message}
 *     />
 *   );
 * }
 * ```
 */
'use client';

import { ChangeEvent } from 'react';
import InputField, { InputFieldProps } from '../InputField/InputField';
import { STRINGS } from '@/constants/strings';
import clsx from 'clsx';
import styles from './MobileNumberInput.module.scss';

/**
 * Define the props available for the MobileNumberInput component.
 * Every other `InputField` prop is passed through.
 */
export interface MobileNumberInputProps extends Omit<InputFieldProps, 'leftIcon'> {
  /**
   * Dial code shown before the number. Not editable by the user.
   *
   * @default "+91"
   */
  dialCode?: string;

  /**
   * Class for the dial code, e.g. to match a larger `inputClassName` font size.
   */
  dialCodeClassName?: string;

  /**
   * Digits allowed in the national number, without the dial code.
   *
   * @default 10
   */
  maxLength?: number;
}

/**
 * Reduces a typed, pasted or autofilled value to the national number: keeps digits only, drops a
 * leading dial code or trunk `0` when that leaves exactly `length` digits, and caps the rest.
 */
export function toNationalNumber(value: string, dialCode = '+91', length = 10): string {
  let digits = value.replace(/\D/g, '');
  const dialDigits = dialCode.replace(/\D/g, '');

  if (dialDigits && digits.length === dialDigits.length + length && digits.startsWith(dialDigits)) {
    digits = digits.slice(dialDigits.length);
  } else if (digits.length === length + 1 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits.slice(0, length);
}

export default function MobileNumberInput({
  dialCode = '+91',
  dialCodeClassName,
  maxLength = 10,
  placeholder = STRINGS.ENTER_MOBILE_NUMBER,
  onChange,
  ...rest
}: MobileNumberInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Cleaned in place so register() and controlled parents both read the national number
    event.target.value = toNationalNumber(event.target.value, dialCode, maxLength);
    onChange?.(event);
  };

  return (
    <div data-testid="MobileNumberInputTest" className={styles.container}>
      <InputField
        autoComplete="tel-national"
        inputMode="numeric"
        placeholder={placeholder}
        {...rest}
        // No native maxLength: it would cut "+91 98765 43210" short on paste before it's cleaned
        type="tel"
        leftIcon={<span className={clsx(styles.dialCode, dialCodeClassName)}>{dialCode}</span>}
        onChange={handleChange}
      />
    </div>
  );
}
