/**
 * The "Itinerary" card of the tour form: one section per day, each with a
 * title, location and description, and an "Add day" button that appends a
 * new day below the last one. Every day but the only one has a "Remove"
 * button; the days after it renumber. Each day's header reads "Day N: <title>" and
 * follows the title as it's typed.
 *
 * Render the card inside a react-hook-form `FormProvider`; the days live in
 * the parent form's `itinerary` array, so the values arrive in the parent's
 * `handleSubmit` and the errors come from the parent's schema (see
 * `itinerarySchema`). The card always shows at least one day.
 *
 * @example
 * ```tsx
 * import { FormProvider, useForm } from 'react-hook-form'
 * import Itinerary, { EMPTY_DAY } from '@/components/Itinerary'
 * import { itinerarySchema } from '@/components/Itinerary/ItinerarySchema'
 *
 * export default function TourForm() {
 *   const methods = useForm<TourItinerary>({
 *     resolver: zodResolver(itinerarySchema),
 *     defaultValues: { itinerary: [EMPTY_DAY] },
 *   });
 *   return (
 *     <FormProvider {...methods}>
 *       <form noValidate onSubmit={methods.handleSubmit(saveTour)}>
 *         <Itinerary />
 *         <Button type="submit">Save</Button>
 *       </form>
 *     </FormProvider>
 *   );
 * }
 * ```
 */
'use client';

import { memo, useEffect, useId, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { ITINERARY } from '@/constants/strings';
import type { ItineraryDay, TourItinerary } from '@/constants/types';
import Typography from '../Typography';
import Button from '../Button';
import DynamicForm from '../DynamicForm';
import { FieldConfig } from '../DynamicForm/DynamicForm';
import styles from './Itinerary.module.scss';

export const EMPTY_DAY: ItineraryDay = { title: '', location: '', description: '' };

interface DayProps {
  index: number;
  disabled: boolean;
  /** Hidden on the only day, so the itinerary never ends up empty */
  canRemove: boolean;
  onRemove: (index: number) => void;
}

/**
 * One day's section. Memoised and subscribed to its own title only, so typing
 * in a day re-renders that day's header and nothing else.
 */
const Day = memo(function Day({ index, disabled, canRemove, onRemove }: DayProps) {
  const headingId = useId();
  const title = useWatch<TourItinerary, `itinerary.${number}.title`>({
    name: `itinerary.${index}.title`,
  });

  const fields = useMemo<FieldConfig[]>(
    () => [
      {
        name: `itinerary.${index}.title`,
        label: ITINERARY.DAY_TITLE,
        type: 'input',
        maxLength: 100,
        required: true,
        disabled,
      },
      {
        name: `itinerary.${index}.location`,
        label: ITINERARY.LOCATION,
        type: 'input',
        maxLength: 100,
        required: true,
        disabled,
      },
      {
        name: `itinerary.${index}.description`,
        label: ITINERARY.DESCRIPTION,
        type: 'textarea',
        rows: 4,
        maxLength: 2000,
        required: true,
        disabled,
      },
    ],
    [index, disabled],
  );

  return (
    <section aria-labelledby={headingId} className={styles.day}>
      <div className={styles.dayHeader}>
        <Typography variant="title-sm" tag="h3" id={headingId} className={styles.dayTitle}>
          {ITINERARY.DAY} {index + 1}: {title?.trim() || ITINERARY.UNTITLED}
        </Typography>

        {canRemove && (
          <Button
            variant="secondary"
            startIcon={Trash2}
            iconSize={16}
            className={styles.headerAction}
            disabled={disabled}
            onClick={() => onRemove(index)}
          >
            {ITINERARY.REMOVE_DAY}
          </Button>
        )}
      </div>

      <DynamicForm fields={fields} className={styles.dayBody} />
    </section>
  );
});

/**
 * Define the props available for the Itinerary component.
 */
export interface ItineraryProps {
  /**
   * Disables every field and button, e.g. while the form submits.
   *
   * @default false
   */
  disabled?: boolean;

  className?: string;
}

export default function Itinerary({ disabled = false, className }: ItineraryProps) {
  const titleId = useId();
  const { control } = useFormContext<TourItinerary>();
  const { fields, append, remove, replace } = useFieldArray({ control, name: 'itinerary' });

  // Start with one day even when the form's defaults have none
  useEffect(() => {
    if (fields.length === 0) replace([EMPTY_DAY]);
  }, [fields.length, replace]);

  // Focusing the new day's title also scrolls it into view
  const addDay = () => append(EMPTY_DAY, { focusName: `itinerary.${fields.length}.title` });

  return (
    <section
      data-testid="ItineraryTest"
      aria-labelledby={titleId}
      className={clsx(styles.card, className)}
    >
      <div className={styles.header}>
        <Typography variant="title-md" tag="h2" id={titleId} className={styles.title}>
          {ITINERARY.TITLE}
        </Typography>

        <Button
          variant="secondary"
          startIcon={Plus}
          iconSize={16}
          className={styles.headerAction}
          disabled={disabled}
          onClick={addDay}
        >
          {ITINERARY.ADD_DAY}
        </Button>
      </div>

      <div className={styles.days}>
        {fields.map((field, index) => (
          <Day
            key={field.id}
            index={index}
            disabled={disabled}
            canRemove={fields.length > 1}
            onRemove={remove}
          />
        ))}
      </div>
    </section>
  );
}
