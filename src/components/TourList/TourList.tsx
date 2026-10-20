/**
 * The tours grid with a "Showing X of Y" footer, or an empty state when there
 * are no tours.
 *
 * The grid is pure CSS: it fits as many ~256px columns as the space allows,
 * so it reflows with the sidebar collapsing or expanding without any
 * JavaScript. Like TourCard it holds no state, so pass it the tours from a
 * Server Component; it only needs a Client Component parent for `onDuplicate`.
 *
 * @example
 * ```tsx
 * import TourList from '@/components/TourList'
 *
 * export default async function ToursPage() {
 *   const { data, total } = await tourService.getTours();
 *   return <TourList tours={data} total={total} />;
 * }
 * ```
 */

import Typography from '../Typography';
import TourCard from '../TourCard';
import { TOURS } from '@/constants/strings';
import type { Tour } from '@/constants/types';
import styles from './TourList.module.scss';

/**
 * Define the props available for the TourList component.
 */
interface TourListProps {
  tours: Tour[];

  /**
   * All tours matching the current filters, when `tours` is only one page of them.
   *
   * @default tours.length
   */
  total?: number;

  /**
   * How many covers, from the first, to preload. They are the first row on
   * wide screens and the largest paint when the page loads.
   *
   * @default 4
   */
  preloadCount?: number;

  /**
   * Called with the tour when a card's Duplicate is clicked. Duplicate is
   * hidden without it. Keep it stable (useCallback) so unchanged cards
   * don't re-render.
   */
  onDuplicate?: (tour: Tour) => void;
}

export default function TourList({
  tours,
  total = tours.length,
  preloadCount = 4,
  onDuplicate,
}: TourListProps) {
  return (
    <section data-testid="TourListTest" aria-label={TOURS.LIST_LABEL} className={styles.panel}>
      {tours.length > 0 ? (
        <ul className={styles.grid}>
          {tours.map((tour, index) => (
            <li key={tour.id}>
              <TourCard tour={tour} preload={index < preloadCount} onDuplicate={onDuplicate} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <Typography variant="heading-4" tag="p">
            {TOURS.EMPTY_TITLE}
          </Typography>
          <Typography variant="body" className={styles.emptyDescription}>
            {TOURS.EMPTY_DESCRIPTION}
          </Typography>
        </div>
      )}

      <div className={styles.footer}>
        <Typography variant="body" className={styles.count}>
          {`${TOURS.SHOWING} ${tours.length} ${TOURS.OF} ${total}`}
        </Typography>
      </div>
    </section>
  );
}
