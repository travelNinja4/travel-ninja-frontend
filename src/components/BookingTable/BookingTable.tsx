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

import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  getFilteredRowModel,
} from '@tanstack/react-table';
import AppLink from '../AppLink';
import Typography from '../Typography';
import styles from './BookingTable.module.scss';
import BookingTableSkeleton from './BookingTableSkeleton';
import { bookingColumns, Booking } from './BookingTable.columns';

interface BookingTableProps {
  header?: string;
  showViewAllBookings?: boolean;
}

export default function BookingTable({ header, showViewAllBookings }: BookingTableProps) {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  // ✅ Prevent table from recalculating columns each render
  const columns = useMemo(() => bookingColumns, []);

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<Booking, any>[],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  });

  const filteredRows = table.getFilteredRowModel().rows;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  // ✅ Memoize sliced data for current page
  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredRows.slice(start, end);
  }, [filteredRows, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const mockData = Array.from({ length: 50 }).map((_, i) => ({
        bookingId: `BKG-${(i + 1).toString().padStart(3, '0')}`,
        customerName: `Customer ${i + 1}`,
        customerMobileNo: `+1 (555) 100-${1000 + i}`,
        customerAvatar: `https://i.pravatar.cc/100?img=${(i % 10) + 1}`,
        tour: ['Mountain Adventure', 'Beach Paradise', 'City Explorer'][i % 3],
        date: 'Dec 15, 2024',
        slots: `${(i % 4) + 1} slots`,
        status: ['Confirmed', 'Pending', 'Cancelled'][i % 3],
        amount: `$${(800 + i * 10).toLocaleString()}`,
      }));
      setData(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await getBookings({ page: currentPage, limit: rowsPerPage });
  //       setData(response.data);
  //       setTotalPages(response.pagination.totalPages);
  //     } catch (error) {
  //       console.error('Error fetching bookings:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBookings();
  // }, [currentPage]);

  // ✅ Reset to page 1 when data length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return (
    <div data-testid="BookingTableTest">
      {loading ? (
        <BookingTableSkeleton />
      ) : (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderFlex}>
              <Typography tag="h3" className={styles.cardHeaderTitle}>
                {header}
              </Typography>
              {showViewAllBookings && (
                <AppLink href="/">
                  <Typography tag="h3" className={styles.cardHeaderLink}>
                    View all bookings
                  </Typography>
                </AppLink>
              )}
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.cardBodyResponsive}>
              <table className={styles.cardBodyTable}>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {currentRows.map((row) => (
                    <tr key={row.id} className={styles.tableRow}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={styles.tableRow}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Responsive Pagination */}
      {totalPages > 1 && (
        <nav className={styles.paginationNav}>
          <ul className={styles.paginationList}>
            {/* Previous */}
            <li className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}>
              <button
                className={styles.pageLink}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
            </li>

            {/* Page numbers (desktop only) */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1),
              )
              .map((page, i, arr) => (
                <React.Fragment key={page}>
                  {i > 0 && page - arr[i - 1] > 1 && (
                    <li className={`${styles.pageItem} ${styles.ellipsis}`}>…</li>
                  )}
                  <li
                    className={`${styles.pageItem} ${
                      currentPage === page ? styles.active : ''
                    } desktopOnly`}
                  >
                    <button className={styles.pageLink} onClick={() => setCurrentPage(page)}>
                      {page}
                    </button>
                  </li>
                </React.Fragment>
              ))}

            {/* Next */}
            <li
              className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}
            >
              <button
                className={styles.pageLink}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
