/**
 * A live preview of the agency's public card, as guests see it when browsing
 * tours: banner, logo, name, tagline, description and destinations.
 *
 * Every empty part shows a dashed prompt ("+ Add a tagline") that calls
 * `onAdd`, e.g. to focus the matching field. Missing images fall back to the
 * plain green banner (with "Banner preview" across its middle) and the
 * agency's initials as logo. Long descriptions are cut to four lines;
 * destinations are split on commas.
 *
 * @example
 * ```tsx
 * import AgencyPreviewCard from '@/components/AgencyPreviewCard'
 *
 * export default function AgencyProfile() {
 *   return (
 *     <AgencyPreviewCard
 *       name="Wanderly Travels"
 *       tagline="Curated journeys across India"
 *       destinations="Karnataka, Kerala"
 *       onAdd={(field) => setFocus(field)}
 *     />
 *   );
 * }
 * ```
 */
'use client';

import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { AGENCY_PREVIEW } from '@/constants/strings';
import { getInitials } from '@/utils/format';
import Typography from '../Typography';
import Image from '../Image';
import styles from './AgencyPreviewCard.module.scss';

/** A part of the card with an "Add" prompt while it's empty */
export type PreviewField = 'tagline' | 'description' | 'destinations';

/** `Karnataka, Kerala ,, Goa, kerala` -> `['Karnataka', 'Kerala', 'Goa']`: blanks and repeats (any case) dropped */
const splitDestinations = (destinations: string) => {
  const byKey = new Map<string, string>();
  destinations.split(',').forEach((entry) => {
    const place = entry.trim();
    const key = place.toLowerCase();
    if (place && !byKey.has(key)) byKey.set(key, place);
  });
  return [...byKey.values()];
};

/**
 * Define the props available for the AgencyPreviewCard component.
 */
export interface AgencyPreviewCardProps {
  name: string;
  tagline?: string;
  description?: string;

  /**
   * Comma-separated places, as typed in Destinations served.
   */
  destinations?: string;

  /**
   * Logo to show; the agency's initials show without one.
   */
  logoUrl?: string;

  /**
   * Banner to show; the plain green banner shows without one.
   */
  bannerUrl?: string;

  /**
   * Called when an "Add" prompt is clicked.
   */
  onAdd?: (field: PreviewField) => void;

  className?: string;
}

export default function AgencyPreviewCard({
  name,
  tagline = '',
  description = '',
  destinations = '',
  logoUrl,
  bannerUrl,
  onAdd,
  className,
}: AgencyPreviewCardProps) {
  const agencyName = name.trim();
  const places = splitDestinations(destinations);

  const addPrompt = (field: PreviewField, label: string, extraClass?: string) => (
    <button type="button" className={clsx(styles.add, extraClass)} onClick={() => onAdd?.(field)}>
      <Plus size={14} aria-hidden="true" />
      {label}
    </button>
  );

  return (
    <section
      data-testid="AgencyPreviewCardTest"
      aria-label={AGENCY_PREVIEW.TITLE}
      className={clsx(styles.card, className)}
    >
      <div className={styles.banner}>
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={AGENCY_PREVIEW.BANNER}
            fill
            unoptimized
            sizes="20rem"
            className={styles.cover}
          />
        ) : (
          <Typography variant="body-sm-strong" tag="span" className={styles.bannerText}>
            {AGENCY_PREVIEW.DEFAULT_BANNER}
          </Typography>
        )}
      </div>

      <div className={styles.body}>
        <div className={clsx(styles.logo, logoUrl && styles.hasImage)}>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={AGENCY_PREVIEW.LOGO}
              fill
              unoptimized
              sizes="5rem"
              className={styles.cover}
            />
          ) : (
            <span aria-hidden="true">{getInitials(agencyName)}</span>
          )}
        </div>

        <div className={styles.identity}>
          <Typography
            variant="heading-4"
            tag="h2"
            className={clsx(styles.name, !agencyName && styles.placeholder)}
          >
            {agencyName || AGENCY_PREVIEW.NAME_PLACEHOLDER}
          </Typography>
          {tagline.trim() ? (
            <Typography variant="body" className={styles.tagline}>
              {tagline.trim()}
            </Typography>
          ) : (
            addPrompt('tagline', AGENCY_PREVIEW.ADD_TAGLINE, styles.addBlock)
          )}
        </div>

        {description.trim() ? (
          <Typography variant="body" truncation="lineClamp-4" className={styles.description}>
            {description.trim()}
          </Typography>
        ) : (
          <div className={styles.descriptionEmpty}>
            <span className={styles.line} aria-hidden="true" />
            <span className={styles.line} aria-hidden="true" />
            <span className={clsx(styles.line, styles.short)} aria-hidden="true" />
            {addPrompt('description', AGENCY_PREVIEW.ADD_DESCRIPTION)}
          </div>
        )}

        {places.length > 0 ? (
          <ul className={styles.chips} aria-label={AGENCY_PREVIEW.DESTINATIONS}>
            {places.map((place) => (
              <li key={place} className={styles.chip}>
                {place}
              </li>
            ))}
          </ul>
        ) : (
          addPrompt('destinations', AGENCY_PREVIEW.ADD_DESTINATIONS, styles.addPill)
        )}
      </div>
    </section>
  );
}
