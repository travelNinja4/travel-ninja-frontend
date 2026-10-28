/**
 * The customers table: one row per guest with their contact details, city,
 * bookings, total spend and last trip, and a "Showing X of Y" footer.
 *
 * Every column shows on every screen. Where they don't fit (tablets, and
 * laptops with the sidebar open) the table scrolls sideways inside its card,
 * with a shadow on the side there is more to see. View calls `onView` with
 * the row's customer, e.g. to open their details in a drawer.
 */
'use client';

import { useMemo, type ComponentProps } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from '../DataTable';
import { CUSTOMERS } from '@/constants/strings';
import type { Customer } from '@/constants/types';
import { formatCurrency, formatDate, formatPhone } from '@/utils/format';
import styles from './Customers.module.scss';

// Built once per `onView` (memoized below), so the table doesn't rebuild every row on each render
const buildColumns = (onView?: (customer: Customer) => void): ColumnDef<Customer, any>[] => [
  {
    id: 'customer',
    header: CUSTOMERS.CUSTOMER,
    cell: ({ row: { original } }) => <span className={styles.name}>{original.fullName}</span>,
  },
  {
    id: 'contact',
    header: CUSTOMERS.CONTACT,
    cell: ({ row: { original } }) => (
      <div className={styles.stack}>
        <span className={styles.truncate} title={original.email}>
          {original.email}
        </span>
        <span className={styles.secondary}>{formatPhone(original.phoneNumber)}</span>
      </div>
    ),
  },
  {
    header: CUSTOMERS.CITY,
    accessorKey: 'city',
    cell: ({ row: { original } }) => original.city ?? CUSTOMERS.NOT_AVAILABLE,
  },
  {
    header: CUSTOMERS.BOOKINGS,
    accessorKey: 'bookingsCount',
  },
  {
    header: CUSTOMERS.TOTAL_SPEND,
    accessorKey: 'totalSpend',
    cell: ({ row: { original } }) => formatCurrency(original.totalSpend),
  },
  {
    id: 'lastTrip',
    header: CUSTOMERS.LAST_TRIP,
    cell: ({ row: { original } }) => (
      <div className={styles.stack}>
        <span className={styles.truncate} title={original.lastTrip.tourTitle}>
          {original.lastTrip.tourTitle}
        </span>
        <span className={styles.secondary}>{formatDate(original.lastTrip.tripDate)}</span>
      </div>
    ),
  },
  {
    id: 'actions',
    header: () => <span className={styles.visuallyHidden}>{CUSTOMERS.ACTIONS}</span>,
    cell: ({ row: { original } }) => (
      <button
        type="button"
        aria-label={`${CUSTOMERS.VIEW} ${original.fullName}`}
        aria-haspopup="dialog"
        className={styles.view}
        onClick={() => onView?.(original)}
      >
        {CUSTOMERS.VIEW}
      </button>
    ),
    meta: { align: 'end', width: '4.5rem' },
  },
];

const getRowId = (customer: Customer) => String(customer.id);

/**
 * Define the props available for the CustomerTable component.
 */
interface CustomerTableProps
  extends Pick<
    ComponentProps<typeof DataTable<Customer>>,
    'total' | 'pagination' | 'loading' | 'emptyTitle' | 'emptyDescription'
  > {
  /** One page of customers. */
  customers: Customer[];

  /**
   * Called with the customer when their View is clicked. Keep it stable
   * (useCallback), or the table rebuilds every row on each render.
   */
  onView?: (customer: Customer) => void;
}

export default function CustomerTable({
  customers,
  onView,
  emptyTitle = CUSTOMERS.EMPTY_TITLE,
  emptyDescription = CUSTOMERS.EMPTY_DESCRIPTION,
  ...rest
}: CustomerTableProps) {
  const columns = useMemo(() => buildColumns(onView), [onView]);

  return (
    <DataTable
      label={CUSTOMERS.LIST_LABEL}
      columns={columns}
      data={customers}
      getRowId={getRowId}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      className={styles.table}
      {...rest}
    />
  );
}
