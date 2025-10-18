import { ColumnDef } from '@tanstack/react-table';
import CustomImage from '../CustomImage';
import styles from './BookingTable.module.scss';
import Typography from '../Typography';
import clsx from 'clsx';

export interface Booking {
  bookingId: string;
  customerName: string;
  customerMobileNo: string;
  customerAvatar: string;
  tour: string;
  date: string;
  slots: string;
  status: string;
  amount: string;
}

export const bookingColumns: ColumnDef<Booking>[] = [
  {
    header: 'Booking ID',
    accessorKey: 'bookingId',
    cell: ({ row }) => (
      <Typography tag="span" className={styles.bookingID}>
        {row.original.bookingId}
      </Typography>
    ),
  },
  {
    header: 'Customer',
    accessorKey: 'customer',
    cell: ({ row }) => {
      const { customerName, customerMobileNo, customerAvatar } = row.original;
      return (
        <div className={styles.subContainer}>
          <div className={styles.customerAvatar}>
            <CustomImage src={customerAvatar} alt={customerName} isUrl />
          </div>
          <div>
            <div className={styles.fwMedium}>{customerName}</div>
            <div className={styles.textMuted}>{customerMobileNo}</div>
          </div>
        </div>
      );
    },
  },
  {
    header: 'Tour',
    accessorKey: 'tour',
    cell: ({ row }) => (
      <Typography tag="span" className={styles.fwMedium}>
        {row.original.tour}
      </Typography>
    ),
  },
  {
    header: 'Date',
    accessorKey: 'date',
    cell: ({ row }) => (
      <Typography tag="span" className={styles.fwMedium}>
        {row.original.date}
      </Typography>
    ),
  },
  {
    header: 'Slots',
    accessorKey: 'slots',
    cell: ({ row }) => (
      <Typography tag="span" className={styles.fwMedium}>
        {row.original.slots}
      </Typography>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <Typography
        tag="span"
        className={clsx(styles.statusBadge, {
          [styles.statusConfirmed]: row.original.status === 'Confirmed',
          [styles.statusPending]: row.original.status === 'Pending',
          [styles.statusCancelled]: row.original.status === 'Cancelled',
        })}
      >
        {row.original.status}
      </Typography>
    ),
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ row }) => (
      <Typography tag="span" className={styles.fwMedium}>
        {row.original.amount}
      </Typography>
    ),
  },
];
