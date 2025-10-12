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
'use client';

import { useEffect, useState } from 'react';
import AppLink from '../AppLink';
import CustomImage from '../CustomImage';
import Typography from '../Typography';
import styles from './BookingTable.module.scss';
import BookingTableSkeleton from './BookingTableSkeleton';

/**
 * Define the props available for the BookingTable component.
 */
interface BookingTableProps {
  label?: string;
}

interface TableData {
  tableHeader: string[];
  tableRows: any[];
}

export default function BookingTable({ label = 'label' }: BookingTableProps) {
  const [tableData, setTableData] = useState<TableData>({
    tableHeader: [],
    tableRows: [],
  });
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.tableRows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(tableData.tableRows.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setTableData({
        tableHeader: ['Booking ID', 'Customer', 'Tour', 'Date', 'Slots', 'Status', 'Amount'],
        tableRows: [
          {
            id: 'BKG-001',
            customerName: 'John Smith',
            customerEmail: 'john@email.com',
            mobileNumber: '+1 (555) 123-4567',
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
            mobileNumber: '+1 (555) 987-6543',
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
            mobileNumber: '+1 (555) 456-7890',
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
            mobileNumber: '+1 (555) 321-0987',
            customerAvatar: 'https://i.pravatar.cc/100?img=5',
            tour: 'Cultural Heritage',
            date: 'Dec 22, 2024',
            slots: '1 slot',
            status: 'Confirmed',
            amount: '$600',
          },
          {
            id: 'BKG-005',
            customerName: 'Alex Thompson',
            customerEmail: 'alex@email.com',
            mobileNumber: '+1 (555) 654-3210',
            customerAvatar: 'https://i.pravatar.cc/100?img=2',
            tour: 'Wildlife Safari',
            date: 'Jan 15, 2025',
            slots: '2 slots',
            status: 'Confirmed',
            amount: '$1,200',
          },
        ],
      });
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={styles.card}>
        {loading ? (
          <BookingTableSkeleton />
        ) : (
          <div className={styles.fadeIn}>
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
                    {currentRows.map((row) => (
                      <tr key={row.id} className={styles.tableRow}>
                        <td className={styles.bookingID}>{row.id}</td>

                        <td>
                          <div className={styles.subContainer}>
                            <div className={styles.customerAvatar}>
                              <CustomImage src={row.customerAvatar} alt={row.customerName} isUrl />
                            </div>
                            <div>
                              <div className={styles.fwMedium}>{row.customerName}</div>
                              <div className={styles.textMuted}>{row.customerEmail}</div>
                              <div className={styles.textMuted}>{row.mobileNumber}</div>
                            </div>
                          </div>
                        </td>

                        <td className={styles.fwMedium}>{row.tour}</td>
                        <td className={styles.fwMedium}>{row.date}</td>
                        <td className={styles.fwMedium}>{row.slots}</td>

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

                        <td className={styles.fwMedium}>{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Pagination */}
      <nav className={styles.paginationNav}>
        <ul className={styles.paginationList}>
          <li className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}>
            <button
              className={styles.pageLink}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i + 1}
              className={`${styles.pageItem} ${currentPage === i + 1 ? styles.active : ''}`}
            >
              <button className={styles.pageLink} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}>
            <button
              className={styles.pageLink}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
