/**
 * The PasswordFeedback component provides real-time visual feedback for password requirements.
 *
 * @example
 * ```tsx
 * import PasswordFeedback from '@src/components/PasswordFeedback'
 *
 * export default function PasswordFeedback() {
 *   return <PasswordFeedback label="Hello" />;
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
  value: string;
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
        console.log('valid>>>', valid);
        return (
          <div className={styles.subContainer}>
            {valid ? (
              <Check
                data-testid={`check-icon-${idx}`}
                color="#28a745"
                size={20}
                className={styles.valid}
              />
            ) : (
              <Dot
                data-testid={`dot-icon-${idx}`}
                color={hasValue ? '#dc3545' : '#666666'}
                size={30}
              />
            )}
            <Typography key={idx} tag="li">
              {hint.label}
            </Typography>
          </div>
        );
      })}
    </ul>
  );
}
