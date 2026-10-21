/**
 * The tours toolbar (search, status and category filters) above one page of
 * the tours grid, with pagination in its footer.
 *
 * It reads the page and the filter options from promises the page started in
 * parallel, so it must render inside a Suspense boundary (Tours provides one).
 *
 * - Search, filters and page live in the URL and are applied by the API, so
 *   only one page of tours is ever loaded. Any change goes back to page 1.
 * - Navigations are transitions: the current page stays on screen (dimmed)
 *   while the next one loads, so the skeleton only shows on first load, and a
 *   newer navigation replaces an older one still in flight.
 * - Dropdowns show the chosen value straight away (optimistic) and add a
 *   history entry; searches replace the current entry, so Back doesn't step
 *   through every term typed.
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
import { TOURS } from '@/constants/strings';
import type { MetaOptions, TourPage, TourSearch, TourStatusFilter } from '@/constants/types';
import { toursHref } from '@/utils/toursQuery';
import styles from './Tours.module.scss';

/** Value of the "All statuses" / "All categories" options */
const ALL = '';

type StatusOption = TourStatusFilter | typeof ALL;
type CategoryOption = number | typeof ALL;

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
   * Options for the status and category filters, from POST /meta/options.
   */
  filterOptionsPromise: Promise<MetaOptions>;

  /**
   * The search and filters from the URL, applied by the API.
   */
  filters?: TourSearch;
}

export default function ToursContent({
  toursPromise,
  filterOptionsPromise,
  filters = {},
}: ToursContentProps) {
  const { tours, page, total, pageCount } = use(toursPromise);
  const filterOptions = use(filterOptionsPromise);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSearching, startSearch] = useTransition();
  // Shows the chosen filters straight away, while their tours load
  const [selected, setSelected] = useOptimistic(filters);

  // The search box text. It is only reset from the URL when the search there
  // changes to a term this box didn't ask for (Back, a link), so a navigation
  // that lands mid-typing never overwrites what's being typed.
  const urlSearch = filters.search ?? '';
  const [text, setText] = useState(urlSearch);
  const [requestedSearch, setRequestedSearch] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    if (urlSearch !== requestedSearch) {
      setText(urlSearch);
      setRequestedSearch(urlSearch);
    }
  }

  const statusOptions = useMemo<DropdownOption<StatusOption>[]>(
    () => [
      { value: ALL, label: TOURS.ALL_STATUSES },
      ...filterOptions.tour_status.map(({ value, label }) => ({ value, label })),
    ],
    [filterOptions],
  );
  const categoryOptions = useMemo<DropdownOption<CategoryOption>[]>(
    () => [
      { value: ALL, label: TOURS.ALL_CATEGORIES },
      ...filterOptions.tour_category.map(({ id, label }) => ({ value: id, label })),
    ],
    [filterOptions],
  );

  // Builds on the optimistic filters, so a change made while another is
  // loading keeps it. Leaving out `page` goes back to page 1.
  const changeFilter = (change: TourSearch) => {
    startTransition(() => {
      const next = { ...selected, ...change };
      setSelected(next);
      router.push(toursHref(next), { scroll: false });
    });
  };

  const search = (term: string) => {
    setRequestedSearch(term);
    startSearch(() => {
      const next = { ...selected, search: term || undefined };
      setSelected(next);
      router.replace(toursHref(next), { scroll: false });
    });
  };

  let empty: { title?: string; description?: string } = {};
  if (tours.length === 0 && page > 1) {
    empty = { title: TOURS.PAGE_EMPTY_TITLE, description: TOURS.PAGE_EMPTY_DESCRIPTION };
  } else if (filters.search || filters.status || filters.categoryId) {
    empty = { title: TOURS.NO_MATCHES_TITLE, description: TOURS.NO_MATCHES_DESCRIPTION };
  }

  const isBusy = isPending || isSearching;

  return (
    <div data-testid="ToursContentTest" className={styles.content}>
      <div className={styles.toolbar}>
        {/* onSearch is debounced and trimmed, so the API is called once typing pauses */}
        <SearchInput value={text} onChange={setText} onSearch={search} loading={isSearching} />
        <Dropdown
          aria-label={TOURS.STATUS_FILTER}
          options={statusOptions}
          fieldClassName={styles.filter}
          value={selected.status ?? ALL}
          onChange={(status: StatusOption) => changeFilter({ status: status || undefined })}
        />
        <Dropdown
          aria-label={TOURS.CATEGORY_FILTER}
          options={categoryOptions}
          fieldClassName={styles.filter}
          value={selected.categoryId ?? ALL}
          onChange={(categoryId: CategoryOption) =>
            changeFilter({ categoryId: categoryId || undefined })
          }
        />
      </div>

      <div aria-busy={isBusy || undefined} className={clsx({ [styles.pending]: isBusy })}>
        <TourList
          tours={tours}
          total={total}
          emptyTitle={empty.title}
          emptyDescription={empty.description}
          pagination={
            <Pagination
              page={page}
              pageCount={Math.max(pageCount, 1)}
              getHref={(target) => toursHref({ ...filters, page: target })}
            />
          }
        />
      </div>
    </div>
  );
}
