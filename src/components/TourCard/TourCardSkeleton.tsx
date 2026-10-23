/**
 * Placeholder for a TourCard while the tours load. It reuses the card's own
 * classes and type styles, and each bar is a line of blank text, so it takes
 * the card's exact size at every width: the 11:5 cover, a two-line title
 * (one line on phones, where cards are wide), the four stats and the footer.
 *
 * @example
 * ```tsx
 * import TourCardSkeleton from '@/components/TourCard/TourCardSkeleton'
 *
 * export default function LoadingCard() {
 *   return <TourCardSkeleton />;
 * }
 * ```
 */

import clsx from 'clsx';
import Typography from '../Typography';
import styles from './TourCard.module.scss';
import skeleton from './TourCardSkeleton.module.scss';

/** A line of blank text, so the bar is exactly one line of that type style tall */
const BLANK = ' ';

const STAT_COUNT = 4;

export default function TourCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-testid="TourCardSkeletonTest"
      aria-hidden="true"
      className={clsx(styles.card, className)}
    >
      <div className={clsx(styles.media, skeleton.pulse)} />

      <div className={styles.body}>
        <div className={styles.header}>
          <div className={skeleton.title}>
            <Typography variant="heading-3" tag="div" className={clsx(styles.title, skeleton.bar)}>
              {BLANK}
            </Typography>
            <Typography
              variant="heading-3"
              tag="div"
              className={clsx(styles.title, skeleton.bar, skeleton.secondLine)}
            >
              {BLANK}
            </Typography>
          </div>
          <Typography
            variant="caption-medium"
            className={clsx(styles.status, skeleton.bar, skeleton.badge)}
          >
            {BLANK}
          </Typography>
        </div>

        <Typography
          variant="body"
          className={clsx(styles.destination, skeleton.bar, skeleton.destination)}
        >
          {BLANK}
        </Typography>

        <div className={styles.stats}>
          {Array.from({ length: STAT_COUNT }, (_, index) => (
            <div key={index}>
              <Typography
                variant="body-sm"
                tag="div"
                className={clsx(styles.statLabel, skeleton.bar, skeleton.statLabel)}
              >
                {BLANK}
              </Typography>
              <Typography
                variant="title-md"
                tag="div"
                className={clsx(styles.statValue, skeleton.bar, skeleton.statValue)}
              >
                {BLANK}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <span className={clsx(styles.edit, skeleton.bar, skeleton.action)}>{BLANK}</span>
      </div>
    </div>
  );
}
