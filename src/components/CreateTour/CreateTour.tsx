/**
 * The create tour screen: title, description and the Save draft / Publish
 * buttons above the tour form. The form owns every card's fields, so both
 * buttons validate and submit them together.
 *
 *   phone / tablet  cards stacked, Schedule & pricing below the main cards
 *   desktop+        Basics, Cover & gallery, Itinerary and Inclusions & policy on the left,
 *                   Schedule & pricing in a side column
 *
 * The Basics card (title, destination, category, description) and the
 * Inclusions & policy card (inclusions, exclusions, cancellation policy) live
 * here as they're only used on this screen; their paired fields share a row
 * from tablet up.
 *
 * @example
 * ```tsx
 * import CreateTour from '@/components/CreateTour'
 *
 * export default async function NewTourPage() {
 *   const { tour_category } = await commonService.getMetaOptions(['tour_category']);
 *   return <CreateTour categories={tour_category} guides={TOUR_GUIDES} />;
 * }
 * ```
 */
'use client';

import { useId, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CREATE_TOUR, TOUR_BASICS, TOUR_POLICIES } from '@/constants/strings';
import type { CreateTourValues, MetaOption, TourStatus } from '@/constants/types';
import Typography from '../Typography';
import Button from '../Button';
import DynamicForm from '../DynamicForm';
import { FieldConfig, FieldWidth } from '../DynamicForm/DynamicForm';
import SchedulePricing from '../SchedulePricing';
import CoverGallery from '../CoverGallery';
import Itinerary, { EMPTY_DAY } from '../Itinerary/Itinerary';
import { DropdownOption } from '../Dropdown/Dropdown';
import { createTourSchema } from './CreateTourSchema';
import styles from './CreateTour.module.scss';

// Number fields start empty: valueAsNumber reads an empty input as NaN, which the schema rejects
const DEFAULT_VALUES: Partial<CreateTourValues> = {
  title: '',
  destination: '',
  categoryId: '',
  description: '',
  coverImage: null,
  gallery: [],
  departureDate: '',
  returnDate: '',
  guide: '',
  itinerary: [EMPTY_DAY],
  inclusions: '',
  exclusions: '',
  cancellationPolicy: '',
};

/**
 * Define the props available for the CreateTour component.
 */
export interface CreateTourProps {
  /**
   * Active `tour_category` options for the Category field.
   */
  categories: MetaOption[];

  /**
   * Guides the agency can pick from.
   */
  guides: DropdownOption<string>[];

  /**
   * Called with the valid form values and the status the tour is saved with.
   * The fields and buttons are disabled until the returned promise settles.
   */
  onSave?: (values: CreateTourValues, status: TourStatus) => void | Promise<void>;
}

export default function CreateTour({ categories, guides, onSave }: CreateTourProps) {
  const basicsTitleId = useId();
  const policiesTitleId = useId();
  const methods = useForm<CreateTourValues>({
    resolver: zodResolver(createTourSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const { isSubmitting } = methods.formState;

  const basicsFields = useMemo<FieldConfig[]>(
    () => [
      {
        name: 'title',
        label: TOUR_BASICS.TOUR_TITLE,
        type: 'input',
        maxLength: 120,
        required: true,
        disabled: isSubmitting,
      },
      {
        name: 'destination',
        label: TOUR_BASICS.DESTINATION,
        type: 'input',
        maxLength: 120,
        required: true,
        width: FieldWidth.HALF,
        disabled: isSubmitting,
      },
      {
        name: 'categoryId',
        label: TOUR_BASICS.CATEGORY,
        type: 'select',
        placeholder: TOUR_BASICS.SELECT_CATEGORY,
        options: categories.map(({ id, label }) => ({ value: String(id), label })),
        required: true,
        width: FieldWidth.HALF,
        disabled: isSubmitting,
      },
      {
        name: 'description',
        label: TOUR_BASICS.DESCRIPTION,
        type: 'textarea',
        rows: 5,
        maxLength: 2000,
        disabled: isSubmitting,
      },
    ],
    [categories, isSubmitting],
  );

  const policiesFields = useMemo<FieldConfig[]>(
    () => [
      {
        name: 'inclusions',
        label: TOUR_POLICIES.INCLUSIONS,
        type: 'textarea',
        rows: 5,
        maxLength: 2000,
        width: FieldWidth.HALF,
        disabled: isSubmitting,
      },
      {
        name: 'exclusions',
        label: TOUR_POLICIES.EXCLUSIONS,
        type: 'textarea',
        rows: 5,
        maxLength: 2000,
        width: FieldWidth.HALF,
        disabled: isSubmitting,
      },
      {
        name: 'cancellationPolicy',
        label: TOUR_POLICIES.CANCELLATION_POLICY,
        type: 'textarea',
        rows: 4,
        maxLength: 2000,
        disabled: isSubmitting,
      },
    ],
    [isSubmitting],
  );

  const save = (status: TourStatus) => methods.handleSubmit((values) => onSave?.(values, status));

  return (
    <FormProvider {...methods}>
      <form
        data-testid="CreateTourTest"
        noValidate
        className={styles.page}
        onSubmit={save('published')}
      >
        <header className={styles.header}>
          <div className={styles.heading}>
            <Typography variant="heading-1" tag="h1">
              {CREATE_TOUR.PAGE_TITLE}
            </Typography>
            <Typography variant="body-lg" className={styles.description}>
              {CREATE_TOUR.PAGE_DESCRIPTION}
            </Typography>
          </div>

          <div className={styles.actions}>
            <Button
              variant="secondary"
              className={styles.action}
              disabled={isSubmitting}
              onClick={save('draft')}
            >
              {CREATE_TOUR.SAVE_DRAFT}
            </Button>
            <Button type="submit" className={styles.action} disabled={isSubmitting}>
              {CREATE_TOUR.PUBLISH}
            </Button>
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.main}>
            <section aria-labelledby={basicsTitleId} className={styles.card}>
              <Typography
                variant="title-md"
                tag="h2"
                id={basicsTitleId}
                className={styles.cardHeader}
              >
                {TOUR_BASICS.TITLE}
              </Typography>

              <DynamicForm fields={basicsFields} className={styles.cardBody} />
            </section>

            <CoverGallery disabled={isSubmitting} />

            <Itinerary disabled={isSubmitting} />

            <section aria-labelledby={policiesTitleId} className={styles.card}>
              <Typography
                variant="title-md"
                tag="h2"
                id={policiesTitleId}
                className={styles.cardHeader}
              >
                {TOUR_POLICIES.TITLE}
              </Typography>

              <DynamicForm fields={policiesFields} className={styles.cardBody} />
            </section>
          </div>

          <aside className={styles.aside}>
            <SchedulePricing guides={guides} disabled={isSubmitting} />
          </aside>
        </div>
      </form>
    </FormProvider>
  );
}
