/**
 * One-time code input: a row of single-digit boxes that behave like one field.
 * Typing moves to the next box, Backspace clears a box and steps back, arrow
 * keys move between boxes, and pasting or SMS autofill (`one-time-code`) fills
 * every box at once.
 *
 * Clearing a box leaves the others where they are, so the boxes are kept here
 * and the parent gets the entered digits as one string. A code with an empty
 * box is shorter than `length`, so a "complete code" check still catches it.
 *
 * @example
 * ```tsx
 * import OtpInput from '@/components/OtpInput'
 *
 * export default function Example() {
 *   const [code, setCode] = useState('');
 *   return <OtpInput label="Verification code" value={code} onChange={setCode} />;
 * }
 * ```
 */
'use client';

import { ChangeEvent, ClipboardEvent, KeyboardEvent, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './OtpInput.module.scss';

/**
 * Define the props available for the OtpInput component.
 */
export interface OtpInputProps {
  /**
   * The digits entered, in box order (empty boxes are skipped).
   * Setting it from outside, e.g. to '' after a resend, refills the boxes from the start.
   */
  value: string;

  /**
   * Called with the entered digits whenever a box changes.
   */
  onChange: (value: string) => void;

  /**
   * Accessible name for the group of boxes, e.g. "Verification code".
   */
  label: string;

  /**
   * Number of boxes.
   *
   * @default 6
   */
  length?: number;

  /**
   * Disables every box, e.g. while the code is being verified.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Shows the boxes in the error state.
   *
   * @default false
   */
  hasError?: boolean;

  /**
   * Focuses the first box on mount.
   *
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Id of the element describing the field, e.g. its error message.
   */
  'aria-describedby'?: string;

  /**
   * Custom class for the row of boxes.
   */
  className?: string;
}

const onlyDigits = (text: string) => text.replace(/\D/g, '');

const toBoxes = (value: string, length: number) =>
  Array.from({ length }, (_, index) => value[index] ?? '');

export default function OtpInput({
  value,
  onChange,
  label,
  length = 6,
  disabled = false,
  hasError = false,
  autoFocus = false,
  'aria-describedby': ariaDescribedBy,
  className,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [boxes, setBoxes] = useState(() => toBoxes(value, length));

  // The parent changed the value itself (e.g. cleared it after a resend): refill the boxes
  if (value !== boxes.join('')) {
    setBoxes(toBoxes(value, length));
  }

  const focusBox = (index: number) => {
    const input = inputsRef.current[Math.min(Math.max(index, 0), length - 1)];
    input?.focus();
    input?.select();
  };

  const update = (next: string[]) => {
    setBoxes(next);
    onChange(next.join(''));
  };

  // Writes `digits` from box `index` onwards and moves focus past them.
  // A full code always starts at the first box, wherever it was pasted or autofilled.
  const fillFrom = (index: number, digits: string) => {
    const start = digits.length >= length ? 0 : index;
    const next = [...boxes];
    digits
      .slice(0, length - start)
      .split('')
      .forEach((digit, offset) => {
        next[start + offset] = digit;
      });
    update(next);
    focusBox(start + digits.length);
  };

  const clearBox = (index: number) => {
    const next = [...boxes];
    next[index] = '';
    update(next);
  };

  const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const typed = onlyDigits(e.target.value);

    // The box was emptied. Some Android keyboards send Backspace only as this change
    // (their keydown has key "Unidentified"), so step back here too.
    if (!e.target.value) {
      clearBox(index);
      focusBox(index - 1);
      return;
    }
    if (!typed) return;

    // Typing into a filled box: drop its old digit so the new one replaces it
    const current = boxes[index];
    const isReplacing = current && typed.length > 1 && typed.length < length;
    fillFrom(index, isReplacing ? typed.replace(current, '') : typed);
  };

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace':
        // A filled box clears through the change handler; an empty box clears the one before it
        if (!boxes[index] && index > 0) {
          e.preventDefault();
          clearBox(index - 1);
          focusBox(index - 1);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusBox(index - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        focusBox(index + 1);
        break;
    }
  };

  const handlePaste = (index: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = onlyDigits(e.clipboardData.getData('text'));
    if (digits) fillFrom(index, digits);
  };

  return (
    <div
      data-testid="OtpInputTest"
      role="group"
      aria-label={label}
      aria-describedby={ariaDescribedBy}
      className={clsx(styles.otpInput, className)}
    >
      {boxes.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={hasError || undefined}
          value={digit}
          disabled={disabled}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste(index)}
          onFocus={(e) => e.target.select()}
          className={clsx(styles.box, hasError && styles.hasError)}
        />
      ))}
    </div>
  );
}
