/**
 * A customer's details in a drawer: an initials avatar with their name and
 * city, then their contact details, bookings, total spend and last trip.
 *
 * Everything shown comes with the customer's row in the table, so opening it
 * needs no request. The header has a fixed title rather than the customer's
 * name, which is already the first thing in the body.
 *
 * @example
 * ```tsx
 * import CustomerDetails from './CustomerDetails'
 *
 * <CustomerDetails customer={selected} onClose={() => setSelected(null)} />
 * ```
 */
'use client';

import Drawer from '../Drawer';
import Typography from '../Typography';
import { CUSTOMERS } from '@/constants/strings';
import type { Customer } from '@/constants/types';
import { formatCurrency, formatDate, formatPhone, getInitials } from '@/utils/format';
import styles from './CustomerDetails.module.scss';

/**
 * Define the props available for the CustomerDetails component.
 */
interface CustomerDetailsProps {
  /**
   * The customer to show. The drawer is closed while this is `null`.
   */
  customer: Customer | null;

  /**
   * Called on the close button, Escape or a click on the backdrop.
   */
  onClose: () => void;
}

export default function CustomerDetails({ customer, onClose }: CustomerDetailsProps) {
  return (
    <Drawer open={customer !== null} onClose={onClose} title={CUSTOMERS.DETAILS_TITLE}>
      {customer && (
        <div data-testid="CustomerDetailsTest" className={styles.details}>
          <div className={styles.profile}>
            <span className={styles.avatar} aria-hidden="true">
              {getInitials(customer.fullName)}
            </span>
            <div className={styles.identity}>
              <Typography variant="title-md" tag="h3" className={styles.name}>
                {customer.fullName}
              </Typography>
              {customer.city && (
                <Typography variant="body" className={styles.city}>
                  {customer.city}
                </Typography>
              )}
            </div>
          </div>

          <dl className={styles.list}>
            {[
              [CUSTOMERS.EMAIL, customer.email],
              [CUSTOMERS.PHONE, formatPhone(customer.phoneNumber)],
              [CUSTOMERS.CITY, customer.city ?? CUSTOMERS.NOT_AVAILABLE],
              [CUSTOMERS.BOOKINGS, customer.bookingsCount],
              [CUSTOMERS.TOTAL_SPEND, formatCurrency(customer.totalSpend)],
              [CUSTOMERS.LAST_TRIP, customer.lastTrip.tourTitle],
              [CUSTOMERS.LAST_TRIP_DATE, formatDate(customer.lastTrip.tripDate)],
            ].map(([label, value]) => (
              <div key={label} className={styles.item}>
                <dt className={styles.muted}>{label}</dt>
                <dd className={styles.value}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </Drawer>
  );
}
