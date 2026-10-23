/**
 * A card with a table of rows and a "Showing X of Y" footer, for any list of
 * records (bookings, customers, payments...). Built on TanStack Table, so each
 * module only describes its columns: the header text and how a cell renders.
 *
 * - Holds no pagination state: pass it one page of rows and `pagination`
 *   (the page, page count and page URLs), so the page lives in the URL like
 *   the tours list. The footer then shows a Pagination on the right.
 * - On phones the table scrolls sideways inside the card; from tablet up the
 *   text and spacing grow, and `meta.hideBelow` drops less important columns
 *   on narrower screens.
 * - `loading` keeps the header and shows placeholder rows, so nothing jumps
 *   when the rows arrive.
 *
 * Columns hold render functions, so define them in a Client Component, at
 * module level (or in a useMemo): new column objects on every render make the
 * table rebuild every row.
 *
 * @example
 * ```tsx
 * import DataTable from '@/components/DataTable'
 *
 * const columns: ColumnDef<Booking, any>[] = [
 *   { header: 'Reference', accessorKey: 'reference' },
 *   { header: 'Amount', accessorKey: 'amount', meta: { align: 'end' } },
 *   { header: 'Departure', accessorKey: 'departure', meta: { hideBelow: 'laptop' } },
 * ];
 *
 * export default function BookingsTable({ bookings, total, page, pageCount }) {
 *   return (
 *     <DataTable
 *       label="Bookings"
 *       columns={columns}
 *       data={bookings}
 *       total={total}
 *       getRowId={(booking) => booking.reference}
 *       pagination={{ page, pageCount, getHref: (p) => `?page=${p}` }}
 *     />
 *   );
 * }
 * ```
 */
'use client';

import type { ComponentProps, ReactNode } from 'react';
import {
  ColumnDef,
  ColumnMeta,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import EmptyState from '../EmptyState';
import Pagination from '../Pagination';
import Typography from '../Typography';
import { TABLE } from '@/constants/strings';
import styles from './DataTable.module.scss';

declare module '@tanstack/react-table' {
  // Names must match TanStack's declaration to merge with it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /**
     * Horizontal alignment of the header and cells, e.g. `end` for amounts.
     *
     * @default 'start'
     */
    align?: 'start' | 'center' | 'end';

    /**
     * Width of the column, any CSS length, e.g. `'3rem'` for an actions column.
     * Without it the column sizes to its content.
     */
    width?: string;

    /**
     * Hides the column on screens narrower than this breakpoint.
     */
    hideBelow?: 'tablet' | 'laptop' | 'desktop';

    /**
     * Extra class for the column's header and cells.
     */
    className?: string;
  }
}

type PaginationConfig = Pick<ComponentProps<typeof Pagination>, 'page' | 'pageCount' | 'getHref'>;

// One factory for every table: it memoizes per table instance
const coreRowModel = getCoreRowModel();

const HIDE_BELOW = {
  tablet: styles.hideBelowTablet,
  laptop: styles.hideBelowLaptop,
  desktop: styles.hideBelowDesktop,
};

/** Classes shared by a column's header and its cells */
function columnClassName(meta: ColumnMeta<RowData, unknown> | undefined) {
  if (!meta) return undefined;
  return clsx(
    meta.align && meta.align !== 'start' && styles[meta.align],
    meta.hideBelow && HIDE_BELOW[meta.hideBelow],
    meta.className,
  );
}

/**
 * Define the props available for the DataTable component.
 */
interface DataTableProps<TData> {
  /**
   * Accessible name of the table, e.g. "Bookings".
   */
  label: string;

  /**
   * The columns. Keep them stable (module level or useMemo).
   */
  columns: ColumnDef<TData, any>[];

  /**
   * The rows to show, usually one page of them.
   */
  data: TData[];

  /**
   * A stable id for a row, e.g. its reference. Lets React keep rows across
   * pages and re-sorts instead of matching them by position.
   */
  getRowId?: (row: TData, index: number) => string;

  /**
   * All rows across every page, for the "Showing X of Y" footer.
   *
   * @default data.length
   */
  total?: number;

  /**
   * The current page, how many there are and each page's URL. Shows a
   * Pagination at the right of the footer; without it there is none.
   */
  pagination?: PaginationConfig;

  /**
   * Shows placeholder rows under the header instead of `data`.
   */
  loading?: boolean;

  /**
   * How many placeholder rows to show while loading.
   *
   * @default 5
   */
  skeletonRows?: number;

  /**
   * Heading of the empty state.
   *
   * @default "Nothing to show"
   */
  emptyTitle?: string;

  /**
   * Text below the empty state heading.
   */
  emptyDescription?: string;

  className?: string;
}

export default function DataTable<TData>({
  label,
  columns,
  data,
  getRowId,
  total = data.length,
  pagination,
  loading = false,
  skeletonRows = 5,
  emptyTitle = TABLE.EMPTY_TITLE,
  emptyDescription = TABLE.EMPTY_DESCRIPTION,
  className,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: coreRowModel,
  });

  const leafColumns = table.getVisibleLeafColumns();
  const rows = table.getRowModel().rows;

  let body: ReactNode;
  if (loading) {
    body = Array.from({ length: skeletonRows }, (_, index) => (
      <tr key={index} className={styles.row}>
        {leafColumns.map((column) => (
          <td key={column.id} className={clsx(styles.cell, columnClassName(column.columnDef.meta))}>
            <span className={styles.skeleton} />
          </td>
        ))}
      </tr>
    ));
  } else if (rows.length === 0) {
    body = (
      <tr>
        <td colSpan={leafColumns.length}>
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </td>
      </tr>
    );
  } else {
    body = rows.map((row) => (
      <tr key={row.id} className={styles.row}>
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            className={clsx(styles.cell, columnClassName(cell.column.columnDef.meta))}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <section data-testid="DataTableTest" className={clsx(styles.panel, className)}>
      {/* Focusable so keyboard users can scroll it when it overflows on phones */}
      <div className={styles.scroller} role="region" aria-label={label} tabIndex={0}>
        <table className={styles.table} aria-busy={loading || undefined}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { meta } = header.column.columnDef;
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      colSpan={header.colSpan}
                      style={meta?.width ? { width: meta.width } : undefined}
                      className={clsx(styles.headerCell, columnClassName(meta))}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>{body}</tbody>
        </table>
      </div>

      {loading ? (
        <span role="status" className={styles.visuallyHidden}>
          {`${TABLE.LOADING} ${label}`}
        </span>
      ) : (
        <div className={styles.footer}>
          <Typography variant="body" className={styles.muted}>
            {`${TABLE.SHOWING} ${rows.length} ${TABLE.OF} ${total}`}
          </Typography>
          {pagination && (
            <Pagination
              page={pagination.page}
              pageCount={Math.max(pagination.pageCount, 1)}
              getHref={pagination.getHref}
            />
          )}
        </div>
      )}
    </section>
  );
}
