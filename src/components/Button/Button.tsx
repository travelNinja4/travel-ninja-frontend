/**
 * A reusable and customizable button component that supports various styles, sizes, and interaction states.
 *
 * @example
 * ```tsx
 * import Button from '@src/components/Button'
 *
 * export default function Button() {
 *   return <Button label="Hello" />;
 * }
 * ```
 */

import styles from './Button.module.scss';

/**
 * Define the props available for the Button component.
 */
interface ButtonProps {
  label?: string;
}

export default function Button({ label = 'label' }: ButtonProps) {
  return (
    <div data-testid='ButtonTest' className={styles.wrapper}>
      Button component - {label}
    </div>
  );
}
