/**
 * One tour in the tours grid: cover image with the place on it, title and
 * status, destination, the departure / price / capacity / occupancy stats,
 * and the Edit and Duplicate actions.
 *
 * It holds no state, so it renders in Server Components too (only the image
 * and the Edit link ship JavaScript). It is memoized, so in a client list a
 * parent re-render (e.g. typing in a search box) skips cards whose `tour`
 * and `onDuplicate` didn't change — keep `onDuplicate` stable with useCallback.
 *
 * @example
 * ```tsx
 * import TourCard from '@/components/TourCard'
 *
 * export default function FeaturedTour({ tour }) {
 *   return <TourCard tour={tour} preload />;
 * }
 * ```
 */

import { memo } from 'react';
import { MapPin } from 'lucide-react';
import clsx from 'clsx';
import AppLink from '../AppLink';
import Image from '../Image';
import StatusBadge from '../StatusBadge';
import Typography from '../Typography';
import { ROUTES, TOURS, TOUR_STATUS_LABEL } from '@/constants/strings';
import type { Tour } from '@/constants/types';
import { formatCurrency, formatDate } from '@/utils/format';
import styles from './TourCard.module.scss';

/**
 * Rendered width of the cover at each breakpoint, so the browser downloads a
 * small enough image. Matches the TourList grid: 1 column on phones, then
 * 2, 3 and 4 as the screen widens.
 */
export const TOUR_COVER_SIZES =
  '(min-width: 1440px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';

/**
 * Define the props available for the TourCard component.
 */
interface TourCardProps {
  tour: Tour;

  /**
   * Preloads the cover image. Set it on the cards in the first row: their
   * covers are usually the largest thing on the page when it first paints.
   *
   * @default false
   */
  preload?: boolean;

  /**
   * Called with the tour when Duplicate is clicked. Duplicate is hidden without it.
   */
  onDuplicate?: (tour: Tour) => void;

  className?: string;
}

/** `"Coorg, Karnataka"` -> `"Coorg"`, `"North Goa"` -> `"North Goa"` */
const getPlace = (destination: string) => destination.split(',')[0].trim();

function TourCard({ tour, preload = false, onDuplicate, className }: TourCardProps) {
  const { id, title, destination, status, departureDate, price, capacity, bookedSeats } = tour;
  const hasBookings = bookedSeats !== undefined;

  const stats = [
    { label: TOURS.DEPARTURE, value: formatDate(departureDate) },
    { label: TOURS.PRICE, value: formatCurrency(price) },
    { label: TOURS.CAPACITY, value: hasBookings ? `${bookedSeats}/${capacity}` : capacity },
    {
      label: TOURS.OCCUPANCY,
      value:
        hasBookings && capacity > 0
          ? `${Math.round((bookedSeats / capacity) * 100)}%`
          : TOURS.NOT_AVAILABLE,
    },
  ];

  return (
    <article data-testid="TourCardTest" className={clsx(styles.card, className)}>
      <div className={styles.media}>
        {/* Decorative: the title right below already names the tour */}
        <Image
          src={tour.coverImageUrl}
          alt=""
          fill
          sizes={TOUR_COVER_SIZES}
          preload={preload}
          className={styles.cover}
        />
        <Typography variant="caption-medium" className={styles.place}>
          {getPlace(destination)}
        </Typography>
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <Typography
            variant="heading-3"
            tag="h3"
            truncation="lineClamp-2"
            className={styles.title}
          >
            {title}
          </Typography>
          <StatusBadge status={status} className={styles.status}>
            {TOUR_STATUS_LABEL[status] ?? status}
          </StatusBadge>
        </div>

        <Typography variant="body" className={styles.destination}>
          <MapPin size={16} strokeWidth={1.75} aria-hidden="true" className={styles.pin} />
          {destination}
        </Typography>

        <dl className={styles.stats}>
          {stats.map(({ label, value }) => (
            <div key={label}>
              <Typography variant="body-sm" tag="dt" className={styles.statLabel}>
                {label}
              </Typography>
              <Typography variant="title-md" tag="dd" className={styles.statValue}>
                {value}
              </Typography>
            </div>
          ))}
        </dl>
      </div>

      <div className={styles.footer}>
        {/* The tour name is part of the accessible name, so a list of "Edit" links stays distinguishable */}
        <AppLink
          href={`${ROUTES.TOURS}/${id}/edit`}
          aria-label={`${TOURS.EDIT} ${title}`}
          className={styles.edit}
        >
          {TOURS.EDIT}
        </AppLink>
        {onDuplicate && (
          <button
            type="button"
            aria-label={`${TOURS.DUPLICATE} ${title}`}
            className={styles.duplicate}
            onClick={() => onDuplicate(tour)}
          >
            {TOURS.DUPLICATE}
          </button>
        )}
      </div>
    </article>
  );
}

export default memo(TourCard);
