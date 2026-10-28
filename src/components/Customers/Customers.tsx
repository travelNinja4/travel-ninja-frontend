/**
 * The customers screen: title and description above the toolbar and
 * customers table (CustomersContent).
 *
 * Pass the page of customers as a promise the page started without awaiting
 * it: the header paints straight away and the table streams in behind a
 * skeleton when the customers arrive. It holds no state, so it stays a Server
 * Component; only CustomersContent ships JavaScript for the search and filter.
 *
 * @example
 * ```tsx
 * import Customers from '@/components/Customers'
 *
 * export default function CustomersPage() {
 *   const customers = customerService.searchCustomers({ page: 1 });
 *   const cities = customerService.getCities();
 *   return <Customers customers={customers} cities={cities} />;
 * }
 * ```
 */

import { Suspense } from 'react';
import Typography from '../Typography';
import CustomersContent from './CustomersContent';
import CustomersSkeleton from './CustomersSkeleton';
import { CUSTOMERS, SIDEBAR } from '@/constants/strings';
import type { CustomerPage, CustomerSearch } from '@/constants/types';
import styles from './Customers.module.scss';

/**
 * Define the props available for the Customers component.
 */
interface CustomersProps {
  /**
   * The page of customers to show, still loading. A rejection reaches the route's error boundary.
   */
  customers: Promise<CustomerPage>;

  /**
   * Options for the city filter, still loading. Started alongside `customers`, so
   * the toolbar waits for whichever arrives last.
   */
  cities: Promise<string[]>;

  /**
   * The search and city the customers were fetched with, from the URL.
   */
  filters?: CustomerSearch;
}

export default function Customers({ customers, cities, filters }: CustomersProps) {
  return (
    <div data-testid="CustomersTest" className={styles.page}>
      <header className={styles.heading}>
        <Typography variant="heading-1" tag="h1">
          {CUSTOMERS.PAGE_TITLE}
        </Typography>
        <Typography variant="body-lg" className={styles.description}>
          {`${CUSTOMERS.PAGE_DESCRIPTION} ${SIDEBAR.AGENCY_NAME} ${CUSTOMERS.TOURS}.`}
        </Typography>
      </header>

      <Suspense fallback={<CustomersSkeleton />}>
        <CustomersContent customersPromise={customers} citiesPromise={cities} filters={filters} />
      </Suspense>
    </div>
  );
}
