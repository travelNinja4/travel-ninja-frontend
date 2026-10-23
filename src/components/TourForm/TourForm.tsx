/**
 * The create and edit tour screens: title, description and the action buttons
 * above the tour form. The form owns every card's fields, so the buttons
 * validate and submit them together.
 *
 *   create (no `tour`)  empty form, Save draft and Publish
 *   edit (`tour`)       filled with the saved tour, a single Update that keeps
 *                       the tour's status
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
 * import TourForm from '@/components/TourForm'
 *
 * export default async function NewTourPage() {
 *   const { tour_category } = await commonService.getMetaOptions(['tour_category']);
 *   return <TourForm categories={tour_category} guides={TOUR_GUIDES} />;
 * }
 *
 * export default async function EditTourPage() {
 *   const tour = await tourService.getTour(id);
 *   return <TourForm tour={tour} categories={tour_category} guides={TOUR_GUIDES} />;
 * }
 * ```
 */
'use client';

import { useId, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TOUR_BASICS, TOUR_FORM, TOUR_POLICIES, TOUR_STATUS_LABEL } from '@/constants/strings';
import type { MetaOption, TourDetails, TourFormValues, TourStatus } from '@/constants/types';
import { toTourFormValues, withCategory, withGuide } from '@/utils/tourForm';
import Typography from '../Typography';
import Button from '../Button';
import DynamicForm from '../DynamicForm';
import { FieldConfig, FieldWidth } from '../DynamicForm/DynamicForm';
import SchedulePricing from '../SchedulePricing';
import CoverGallery from '../CoverGallery';
import Itinerary, { EMPTY_DAY } from '../Itinerary/Itinerary';
import { DropdownOption } from '../Dropdown/Dropdown';
import { tourFormSchema } from './TourFormSchema';
import styles from './TourForm.module.scss';

// Number fields start empty: valueAsNumber reads an empty input as NaN, which the schema rejects
const DEFAULT_VALUES: Partial<TourFormValues> = {
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
 * Define the props available for the TourForm component.
 */
export interface TourFormProps {
  /**
   * Active `tour_category` options for the Category field.
   */
  categories: MetaOption[];

  /**
   * Guides the agency can pick from.
   */
  guides: DropdownOption<string>[];

  /**
   * The saved tour to edit. Fills the form and swaps the create actions for Update.
   */
  tour?: TourDetails;

  /**
   * Called with the valid form values and the status the tour is saved with
   * (the tour's own status when editing). The fields and buttons are disabled
   * until the returned promise settles.
   */
  onSave?: (values: TourFormValues, status: TourStatus) => void | Promise<void>;
}

export default function TourForm({ categories, guides, tour, onSave }: TourFormProps) {
  const basicsTitleId = useId();
  const policiesTitleId = useId();

  // A saved tour's guide or category may be missing from the lists; add it so its field isn't blank
  const categoryOptions = useMemo(
    () =>
      withCategory(categories, tour?.category).map(({ id, label }) => ({
        value: String(id),
        label,
      })),
    [categories, tour?.category],
  );
  const guideOptions = useMemo(() => withGuide(guides, tour?.guide), [guides, tour?.guide]);

  // Read once, like useForm's defaultValues
  const [defaultValues] = useState(() =>
    tour ? toTourFormValues(tour, guideOptions) : DEFAULT_VALUES,
  );
  const methods = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues,
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
        options: categoryOptions,
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
    [categoryOptions, isSubmitting],
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
        data-testid="TourFormTest"
        noValidate
        className={styles.page}
        onSubmit={save(tour?.status ?? 'published')}
      >
        <header className={styles.header}>
          <div className={styles.heading}>
            <Typography variant="heading-1" tag="h1">
              {tour ? TOUR_FORM.EDIT_TITLE : TOUR_FORM.CREATE_TITLE}
            </Typography>
            <Typography variant="body-lg" className={styles.description}>
              {tour
                ? `${tour.title} · ${TOUR_STATUS_LABEL[tour.status]}`
                : TOUR_FORM.CREATE_DESCRIPTION}
            </Typography>
          </div>

          <div className={styles.actions}>
            {tour ? (
              <Button type="submit" className={styles.action} disabled={isSubmitting}>
                {TOUR_FORM.UPDATE}
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  className={styles.action}
                  disabled={isSubmitting}
                  onClick={save('draft')}
                >
                  {TOUR_FORM.SAVE_DRAFT}
                </Button>
                <Button type="submit" className={styles.action} disabled={isSubmitting}>
                  {TOUR_FORM.PUBLISH}
                </Button>
              </>
            )}
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
            <SchedulePricing guides={guideOptions} disabled={isSubmitting} />
          </aside>
        </div>
      </form>
    </FormProvider>
  );
}
