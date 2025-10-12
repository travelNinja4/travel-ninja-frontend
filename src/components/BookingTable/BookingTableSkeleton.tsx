import React from 'react';
import ContentLoader from 'react-content-loader';
import styles from './BookingTable.module.scss';

interface BookingTableSkeletonProps {
  rows?: number;
  columns?: { key: string; label: string }[];
}

const BookingTableSkeleton: React.FC<BookingTableSkeletonProps> = ({
  rows = 5,
  columns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'tour', label: 'Tour' },
    { key: 'date', label: 'Date' },
    { key: 'slots', label: 'Slots' },
    { key: 'status', label: 'Status' },
    { key: 'amount', label: 'Amount' },
  ],
}) => {
  const renderSkeletonCell = (key: string) => {
    switch (key) {
      case 'customer':
        return (
          <ContentLoader
            speed={2}
            width={200}
            height={50}
            viewBox="0 0 200 50"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <circle cx="20" cy="20" r="20" />
            <rect x="50" y="5" rx="3" ry="3" width="120" height="10" />
            <rect x="50" y="20" rx="3" ry="3" width="100" height="8" />
            <rect x="50" y="34" rx="3" ry="3" width="90" height="8" />
          </ContentLoader>
        );

      case 'status':
        return (
          <ContentLoader
            speed={2}
            width={100}
            height={24}
            viewBox="0 0 100 24"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="12" ry="12" width="80" height="24" />
          </ContentLoader>
        );

      default:
        return (
          <ContentLoader
            speed={2}
            width={120}
            height={20}
            viewBox="0 0 120 20"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="3" ry="3" width="100" height="12" />
          </ContentLoader>
        );
    }
  };

  return (
    <div className={styles.cardBody}>
      <div className={styles.cardBodyResponsive}>
        <table className={styles.cardBodyTable}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className={styles.tableRow}>
                {columns.map((col) => (
                  <td key={col.key}>{renderSkeletonCell(col.key)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTableSkeleton;
