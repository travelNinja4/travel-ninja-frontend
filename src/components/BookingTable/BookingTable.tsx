/**
 * A reusable table component that displays booking details with support for dynamic data, status badges, and skeleton loading states.
 *
 * @example
 * ```tsx
 * import BookingTable from '@src/components/BookingTable'
 *
 * export default function BookingTable() {
 *   return <BookingTable label="Hello" />;
 * }
 * ```
 */

import AppLink from '../AppLink';
import CustomImage from '../CustomImage';
import Typography from '../Typography';
import styles from './BookingTable.module.scss';

/**
 * Define the props available for the BookingTable component.
 */
interface BookingTableProps {
  label?: string;
}

export default function BookingTable({ label = 'label' }: BookingTableProps) {
  const tableData = {
    tableHeader: ['Booking ID', 'Customer', 'Tour', 'Date', 'Slots', 'Status', 'Amount'],
    tableRows: [
      {
        id: 'BKG-001',
        customerName: 'John Smith',
        customerEmail: 'john@email.com',
        customerAvatar: 'https://i.pravatar.cc/100?img=2',
        tour: 'Mountain Adventure',
        date: 'Dec 15, 2024',
        slots: '2 slots',
        status: 'Confirmed',
        amount: '$1,200',
      },
      {
        id: 'BKG-002',
        customerName: 'Maria Johnson',
        customerEmail: 'maria@email.com',
        customerAvatar: 'https://i.pravatar.cc/100?img=3',
        tour: 'City Explorer',
        date: 'Dec 18, 2024',
        slots: '4 slots',
        status: 'Confirmed',
        amount: '$800',
      },
      {
        id: 'BKG-003',
        customerName: 'Robert Davis',
        customerEmail: 'robert@email.com',
        customerAvatar: 'https://i.pravatar.cc/100?img=4',
        tour: 'Beach Paradise',
        date: 'Dec 20, 2024',
        slots: '3 slots',
        status: 'Confirmed',
        amount: '$1,500',
      },
      {
        id: 'BKG-004',
        customerName: 'Lisa Wilson',
        customerEmail: 'lisa@email.com',
        customerAvatar: 'https://i.pravatar.cc/100?img=5',
        tour: 'Cultural Heritage',
        date: 'Dec 22, 2024',
        slots: '1 slot',
        status: 'Confirmed',
        amount: '$600',
      },
      {
        id: 'BKG-005',
        customerName: 'John Smith',
        customerEmail: 'john@email.com',
        customerAvatar: 'https://i.pravatar.cc/100?img=2',
        tour: 'Mountain Adventure',
        date: 'Dec 15, 2024',
        slots: '2 slots',
        status: 'Confirmed',
        amount: '$1,200',
      },
    ],
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderFlex}>
          <Typography tag="h3" className={styles.cardHeaderTitle}>
            Recent Bookings
          </Typography>
          <AppLink href="/">
            <Typography tag="h3" className={styles.cardHeaderLink}>
              View all bookings
            </Typography>
          </AppLink>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardBodyResponsive}>
          <table className={styles.cardBodyTable}>
            <thead>
              <tr>
                {tableData.tableHeader.map((title) => (
                  <th key={title}>{title}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableData.tableRows.map((row) => (
                <tr key={row.id} className={styles.tableRow}>
                  <td>{row.id}</td>

                  <td>
                    <div className={styles.subContainer}>
                      <div className={styles.customerAvatar}>
                        <CustomImage src={row.customerAvatar} alt={row.customerName} isUrl />
                      </div>
                      <div>
                        <div className={styles.fwMedium}>{row.customerName}</div>
                        <div className={styles.textMuted}>{row.customerEmail}</div>
                      </div>
                    </div>
                  </td>

                  <td>{row.tour}</td>
                  <td>{row.date}</td>
                  <td>{row.slots}</td>

                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        row.status === 'Confirmed'
                          ? styles.statusConfirmed
                          : row.status === 'Pending'
                            ? styles.statusPending
                            : styles.statusCancelled
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  <td>{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
