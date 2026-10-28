/**
 * The customers toolbar (search and city filter) above one page of the
 * customers table, with pagination in its footer.
 *
 * It reads the page and the cities from promises the page started in
 * parallel, so it must render inside a Suspense boundary (Customers provides one).
 *
 * - Search, city and page live in the URL and are applied by the API, so
 *   only one page of customers is ever loaded. Any change goes back to page 1.
 * - Navigations are transitions: the current page stays on screen (dimmed)
 *   while the next one loads, so the skeleton only shows on first load, and a
 *   newer navigation replaces an older one still in flight.
 * - The city dropdown shows the chosen city straight away (optimistic) and
 *   adds a history entry; searches replace the current entry, so Back doesn't
 *   step through every term typed.
 * - A row's View opens the customer's details in a drawer, from the row's
 *   own data, so it opens straight away without a request.
 */
'use client';

import { use, useMemo, useOptimistic, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Dropdown from '../Dropdown';
import type { DropdownOption } from '../Dropdown/Dropdown';
import SearchInput from '../SearchInput';
import CustomerDetails from './CustomerDetails';
import CustomerTable from './CustomerTable';
import { CUSTOMERS } from '@/constants/strings';
import type { Customer, CustomerPage, CustomerSearch } from '@/constants/types';
import { customersHref } from '@/utils/customersQuery';
import styles from './Customers.module.scss';

/** Value of the "All cities" option */
const ALL = '';

/**
 * Define the props available for the CustomersContent component.
 */
interface CustomersContentProps {
  /**
   * The page of customers to show. Suspends until the promise resolves; a
   * rejection reaches the nearest error boundary.
   */
  customersPromise: Promise<CustomerPage>;

  /**
   * Options for the city filter, from GET /customers/cities.
   */
  citiesPromise: Promise<string[]>;

  /**
   * The search and city from the URL, applied by the API.
   */
  filters?: CustomerSearch;
}

export default function CustomersContent({
  customersPromise,
  citiesPromise,
  filters = {},
}: CustomersContentProps) {
  const { customers, page, total, pageCount } = use(customersPromise);
  const cities = use(citiesPromise);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSearching, startSearch] = useTransition();
  // Shows the chosen city straight away, while its customers load
  const [selected, setSelected] = useOptimistic(filters);
  // The customer whose details are open in the drawer. The setter is stable,
  // so passing it as `onView` doesn't make the table rebuild its columns.
  const [viewing, setViewing] = useState<Customer | null>(null);

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

  // The API matches cities case-insensitively, so a link with `city=chennai`
  // selects "Chennai". A city that isn't in the list (e.g. from an old link)
  // is added, so the dropdown still shows what the table is filtered by.
  const selectedCity = selected.city
    ? (cities.find((city) => city.toLowerCase() === selected.city!.toLowerCase()) ?? selected.city)
    : ALL;
  const cityOptions = useMemo<DropdownOption<string>[]>(() => {
    const options = [ALL, ...cities];
    if (selectedCity && !cities.includes(selectedCity)) options.push(selectedCity);
    return options.map((city) => ({ value: city, label: city || CUSTOMERS.ALL_CITIES }));
  }, [cities, selectedCity]);

  // Builds on the optimistic filters, so a change made while another is
  // loading keeps it. Leaving out `page` goes back to page 1.
  const changeCity = (city: string) => {
    startTransition(() => {
      const next = { ...selected, city: city || undefined };
      setSelected(next);
      router.push(customersHref(next), { scroll: false });
    });
  };

  const search = (term: string) => {
    setRequestedSearch(term);
    startSearch(() => {
      const next = { ...selected, search: term || undefined };
      setSelected(next);
      router.replace(customersHref(next), { scroll: false });
    });
  };

  let empty: { title?: string; description?: string } = {};
  if (customers.length === 0 && page > 1) {
    empty = { title: CUSTOMERS.PAGE_EMPTY_TITLE, description: CUSTOMERS.PAGE_EMPTY_DESCRIPTION };
  } else if (filters.search || filters.city) {
    empty = { title: CUSTOMERS.NO_MATCHES_TITLE, description: CUSTOMERS.NO_MATCHES_DESCRIPTION };
  }

  const isBusy = isPending || isSearching;

  return (
    <div data-testid="CustomersContentTest" className={styles.content}>
      <div className={styles.toolbar}>
        {/* onSearch is debounced and trimmed, so the API is called once typing pauses */}
        <SearchInput
          value={text}
          onChange={setText}
          onSearch={search}
          loading={isSearching}
          placeholder={CUSTOMERS.SEARCH_PLACEHOLDER}
        />
        <Dropdown
          aria-label={CUSTOMERS.CITY_FILTER}
          options={cityOptions}
          fieldClassName={styles.filter}
          value={selectedCity}
          onChange={changeCity}
        />
      </div>

      <div aria-busy={isBusy || undefined} className={clsx({ [styles.pending]: isBusy })}>
        <CustomerTable
          customers={customers}
          onView={setViewing}
          total={total}
          emptyTitle={empty.title}
          emptyDescription={empty.description}
          pagination={{
            page,
            pageCount,
            getHref: (target) => customersHref({ ...filters, page: target }),
          }}
        />
      </div>

      <CustomerDetails customer={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
