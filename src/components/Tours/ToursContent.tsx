/**
 * The tours toolbar (search, status and category filters) above one page of
 * the tours grid, with pagination in its footer.
 *
 * It reads the page from the promise the page started, so it must render
 * inside a Suspense boundary (Tours provides one).
 *
 * - Page and status live in the URL and are fetched on the server, one page
 *   at a time. While the next page loads the current one stays on screen
 *   (navigations are transitions), so the skeleton only shows on first load.
 * - Search and category have no API support yet, so they filter the loaded
 *   page in memory. Their state survives page changes. The filtered list keeps
 *   the original tour objects, so memoized cards that stay don't re-render.
 */
'use client';

import { use, useMemo, useOptimistic, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Dropdown from '../Dropdown';
import type { DropdownOption } from '../Dropdown/Dropdown';
import Pagination from '../Pagination';
import SearchInput from '../SearchInput';
import TourList from '../TourList';
import { TOURS, TOUR_CATEGORIES, TOUR_STATUS_LABEL } from '@/constants/strings';
import type { TourPage, TourStatusFilter } from '@/constants/types';
import { toursHref } from '@/utils/toursQuery';
import styles from './Tours.module.scss';

/** Value of the "All statuses" / "All categories" options */
const ALL = '';

type StatusOption = TourStatusFilter | typeof ALL;

const STATUS_OPTIONS: DropdownOption<StatusOption>[] = [
  { value: ALL, label: TOURS.ALL_STATUSES },
  { value: 'published', label: TOUR_STATUS_LABEL.published },
  { value: 'draft', label: TOUR_STATUS_LABEL.draft },
];

const CATEGORY_OPTIONS: DropdownOption<string>[] = [
  { value: ALL, label: TOURS.ALL_CATEGORIES },
  ...TOUR_CATEGORIES.map((value) => ({ value, label: value })),
];

/**
 * Define the props available for the ToursContent component.
 */
interface ToursContentProps {
  /**
   * The page of tours to show. Suspends until the promise resolves; a
   * rejection reaches the nearest error boundary.
   */
  toursPromise: Promise<TourPage>;

  /**
   * The status filter from the URL, applied by the API.
   */
  status?: TourStatusFilter;
}

export default function ToursContent({ toursPromise, status }: ToursContentProps) {
  const { tours, page, hasNextPage } = use(toursPromise);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Shows the chosen status straight away, while its tours load
  const [selectedStatus, setSelectedStatus] = useOptimistic<StatusOption>(status ?? ALL);
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState(ALL);

  const changeStatus = (next: StatusOption) => {
    startTransition(() => {
      setSelectedStatus(next);
      // Back to page 1: the old page number may not exist for the new status
      router.push(toursHref({ status: next || undefined }), { scroll: false });
    });
  };

  const filteredTours = useMemo(() => {
    const query = term.toLowerCase();
    return tours.filter(
      (tour) =>
        (category === ALL || tour.category === category) &&
        (!query ||
          tour.title.toLowerCase().includes(query) ||
          tour.destination.toLowerCase().includes(query)),
    );
  }, [tours, term, category]);

  let empty: { title?: string; description?: string } = {};
  if (tours.length === 0 && page > 1) {
    empty = { title: TOURS.PAGE_EMPTY_TITLE, description: TOURS.PAGE_EMPTY_DESCRIPTION };
  } else if (tours.length > 0 || status) {
    empty = { title: TOURS.NO_MATCHES_TITLE, description: TOURS.NO_MATCHES_DESCRIPTION };
  }

  return (
    <div data-testid="ToursContentTest" className={styles.content}>
      <div className={styles.toolbar}>
        {/* onSearch is debounced and trimmed, so filtering runs once typing pauses */}
        <SearchInput onSearch={setTerm} />
        <Dropdown
          aria-label={TOURS.STATUS_FILTER}
          options={STATUS_OPTIONS}
          fieldClassName={styles.filter}
          value={selectedStatus}
          onChange={changeStatus}
        />
        <Dropdown
          aria-label={TOURS.CATEGORY_FILTER}
          options={CATEGORY_OPTIONS}
          fieldClassName={styles.filter}
          value={category}
          onChange={setCategory}
        />
      </div>

      <div aria-busy={isPending || undefined} className={clsx({ [styles.pending]: isPending })}>
        <TourList
          tours={filteredTours}
          total={tours.length}
          emptyTitle={empty.title}
          emptyDescription={empty.description}
          pagination={
            <Pagination
              page={page}
              // Without a total from the API, only the next page is known to exist
              pageCount={hasNextPage ? page + 1 : page}
              getHref={(target) => toursHref({ page: target, status })}
            />
          }
        />
      </div>
    </div>
  );
}
