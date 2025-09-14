/**
 * The PasswordFeedback component provides real-time visual feedback for password requirements.
 *
 * @example
 * ```tsx
 * import PasswordFeedback from '@src/components/PasswordFeedback'
 *
 * export default function PasswordFeedback() {
 *   return<PasswordFeedback value={password} hints={passwordHints} />;
 * }
 * ```
 */

import Typography from '../Typography';
import { Dot, Check } from 'lucide-react';
import styles from './PasswordFeedback.module.scss';

/**
 * Define the props available for the PasswordFeedback component.
 */
interface PasswordFeedbackProps {
  /**
   * The current password value entered by the user.
   * Used to test against the provided password hints.
   */
  value: string;

  /**
   * An array of password requirements (hints).
   * Each hint includes a `label` describing the rule and a `regex` to validate against.
   */
  hints: PasswordHint[];
}

export interface PasswordHint {
  label: string;
  regex: RegExp;
}

export default function PasswordFeedback({ value, hints }: PasswordFeedbackProps) {
  const hasValue = value.length > 0;
  return (
    <ul data-testid="PasswordFeedbackTest" className={styles.container} aria-live="polite">
      {hints.map((hint, idx) => {
        const valid = hint.regex.test(value || '');
        return (
          <div key={idx} className={styles.subContainer}>
            {valid ? (
              <Check
                data-testid={`check-icon-${idx}`}
                color="var(--color-green-500)"
                size={20}
                className={styles.valid}
              />
            ) : (
              <Dot
                data-testid={`dot-icon-${idx}`}
                color={hasValue ? 'var(--color-red-500)' : 'var(--color-gray-600)'}
                size={30}
              />
            )}
            <Typography tag="li">{hint.label}</Typography>
          </div>
        );
      })}
    </ul>
  );
}
