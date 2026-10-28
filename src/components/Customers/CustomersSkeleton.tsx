/**
 * Placeholder for the Customers component while the customers load: the
 * toolbar and the table with placeholder rows, laid out like the loaded
 * screen so nothing jumps when the customers arrive.
 */

import clsx from 'clsx';
import CustomerTable from './CustomerTable';
import { CUSTOMERS } from '@/constants/strings';
import styles from './Customers.module.scss';

export default function CustomersSkeleton() {
  return (
    <div
      data-testid="CustomersSkeletonTest"
      role="status"
      aria-label={CUSTOMERS.LOADING}
      className={styles.content}
    >
      <div className={styles.toolbar}>
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className={clsx(styles.skeletonBlock, styles.skeletonField)} />
        ))}
      </div>
      <CustomerTable customers={[]} loading />
    </div>
  );
}
