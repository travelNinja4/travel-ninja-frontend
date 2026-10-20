/**
 * Numbered page links: the current page highlighted, the others linking to
 * their URL. Long ranges collapse to `1 … 4 5 6 … 20` so the row stays short.
 *
 * The pages are real links, so they work with the back button, open in a new
 * tab, and the clicked number dims while its page loads.
 *
 * @example
 * ```tsx
 * import Pagination from '@/components/Pagination'
 *
 * export default function BookingsFooter({ page, pageCount }) {
 *   return (
 *     <Pagination page={page} pageCount={pageCount} getHref={(p) => `/bookings?page=${p}`} />
 *   );
 * }
 * ```
 */
'use client';

import Link, { useLinkStatus } from 'next/link';
import clsx from 'clsx';
import { PAGINATION } from '@/constants/strings';
import styles from './Pagination.module.scss';

/** Above this many pages, the middle collapses into ellipses */
const MAX_VISIBLE = 7;

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * The page numbers to show. `getPageItems(5, 20)` -> `[1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 20]`
 */
export function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= MAX_VISIBLE) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  // Keep the window 3 pages wide at either end: 1 2 3 4 … 20, not 1 2 … 20
  const start = Math.max(2, Math.min(page - 1, pageCount - 4));
  const end = Math.min(pageCount - 1, Math.max(page + 1, 5));

  const items: PageItem[] = [1];
  if (start > 2) items.push('ellipsis-start');
  for (let index = start; index <= end; index += 1) items.push(index);
  if (end < pageCount - 1) items.push('ellipsis-end');
  items.push(pageCount);
  return items;
}

/**
 * Define the props available for the Pagination component.
 */
interface PaginationProps {
  /** The current page, 1-based. */
  page: number;

  /** How many pages there are. */
  pageCount: number;

  /** URL of a page. */
  getHref: (page: number) => string;

  className?: string;
}

// Rendered inside the Link so it can read that link's pending state
function PageNumber({ page }: { page: number }) {
  const { pending } = useLinkStatus();
  return <span className={clsx({ [styles.pending]: pending })}>{page}</span>;
}

export default function Pagination({ page, pageCount, getHref, className }: PaginationProps) {
  return (
    <nav data-testid="PaginationTest" aria-label={PAGINATION.LABEL} className={className}>
      <ul className={styles.list}>
        {getPageItems(page, pageCount).map((item) => {
          if (typeof item !== 'number') {
            return (
              <li key={item} className={styles.ellipsis} aria-label={PAGINATION.MORE_PAGES}>
                …
              </li>
            );
          }

          return (
            <li key={item}>
              {item === page ? (
                <span aria-current="page" className={clsx(styles.page, styles.current)}>
                  {item}
                </span>
              ) : (
                <Link
                  href={getHref(item)}
                  aria-label={`${PAGINATION.PAGE} ${item}`}
                  className={styles.page}
                >
                  <PageNumber page={item} />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
