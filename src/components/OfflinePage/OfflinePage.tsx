/**
 * A React component that shows a floating offline icon and message when the user is not connected to the internet.
 *
 * @example
 * ```tsx
 * import OfflinePage from '@src/components/OfflinePage'
 *
 * export default function OfflinePage() {
 *   return <OfflinePage label="Hello" />;
 * }
 * ```
 */

import { WifiOff } from 'lucide-react';
import { STRINGS } from '@/constants/strings';
import styles from './OfflinePage.module.scss';

export default function OfflinePage() {
  return (
    <div data-testid="OfflinePageTest" className={styles.container}>
      <WifiOff size={64} color="var(--color-red-500)" />
      <h1 className={styles.title}>{STRINGS.YOUR_OFFLINE}</h1>
      <p className={styles.message}>{STRINGS.PLEASE_CONNECT_TO_INTERNET}</p>
      <div className={styles.waiting}>{STRINGS.WAITING_FOR_CONNECTION}</div>
    </div>
  );
}
