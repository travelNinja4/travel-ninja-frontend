/**
 * The "Schedule & pricing" card of the tour form: duration, departure and
 * return dates, price per person, capacity and the guide label.
 *
 * The fields are a DynamicForm config. Render the card inside a
 * react-hook-form `FormProvider`; DynamicForm then registers the fields on
 * that form, so the values arrive in the parent's `handleSubmit` and the
 * errors come from the parent's schema. Duration and the two dates stay in
 * sync — changing the duration or departure moves the return date, and
 * picking a return date updates the duration (a 3-day tour leaving on the
 * 20th returns on the 22nd).
 *
 * @example
 * ```tsx
 * import { FormProvider, useForm } from 'react-hook-form'
 * import SchedulePricing from '@/components/SchedulePricing'
 *
 * export default function TourForm() {
 *   const methods = useForm<TourSchedule>({ resolver: zodResolver(tourSchema) });
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={methods.handleSubmit(saveTour)}>
 *         <SchedulePricing guides={[{ value: 'arjun', label: 'Arjun Mehta' }]} />
 *         <Button type="submit">Save</Button>
 *       </form>
 *     </FormProvider>
 *   );
 * }
 * ```
 */
'use client';

import { useId, useMemo } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import { SCHEDULE_PRICING } from '@/constants/strings';
import type { TourSchedule } from '@/constants/types';
import { addDays, daysBetween } from '@/utils/date';
import Typography from '../Typography';
import DynamicForm from '../DynamicForm';
import { FieldConfig } from '../DynamicForm/DynamicForm';
import { DropdownOption } from '../Dropdown/Dropdown';
import styles from './SchedulePricing.module.scss';

type ScheduleForm = UseFormReturn<TourSchedule>;

// Re-validates a synced field only when it already shows an error, so it clears as soon as it's fixed
const syncOptions = (form: ScheduleForm, name: keyof TourSchedule) => ({
  shouldDirty: true,
  shouldValidate: form.getFieldState(name).invalid,
});

// A tour of N days returns N - 1 days after it departs
const syncReturnDate = (form: ScheduleForm) => {
  const [days, departure] = form.getValues(['durationDays', 'departureDate']);
  if (departure && Number.isInteger(days) && days >= 1) {
    form.setValue('returnDate', addDays(departure, days - 1), syncOptions(form, 'returnDate'));
  }
};

const syncDuration = (form: ScheduleForm) => {
  const [departure, returnDate] = form.getValues(['departureDate', 'returnDate']);
  const diff = daysBetween(departure, returnDate);
  if (diff !== null && diff >= 0) {
    form.setValue('durationDays', diff + 1, syncOptions(form, 'durationDays'));
  }
};

/**
 * Define the props available for the SchedulePricing component.
 */
export interface SchedulePricingProps {
  /**
   * Guides the agency can pick from.
   */
  guides: DropdownOption<string>[];

  /**
   * Disables every field, e.g. while the form submits.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Shows a loading row in the guide list.
   */
  isGuidesLoading?: boolean;

  className?: string;
}

export default function SchedulePricing({
  guides,
  disabled = false,
  isGuidesLoading,
  className,
}: SchedulePricingProps) {
  const titleId = useId();
  // The return date can't be earlier than this
  const departureDate = useWatch<TourSchedule, 'departureDate'>({ name: 'departureDate' });

  const fields = useMemo<FieldConfig[]>(
    () => [
      {
        name: 'durationDays',
        label: SCHEDULE_PRICING.DURATION,
        type: 'number',
        min: 1,
        disabled,
        onValueChange: syncReturnDate,
      },
      {
        name: 'departureDate',
        label: SCHEDULE_PRICING.DEPARTURE_DATE,
        type: 'date',
        disabled,
        onValueChange: syncReturnDate,
      },
      {
        name: 'returnDate',
        label: SCHEDULE_PRICING.RETURN_DATE,
        type: 'date',
        min: departureDate || undefined,
        disabled,
        onValueChange: syncDuration,
      },
      { name: 'price', label: SCHEDULE_PRICING.PRICE, type: 'number', min: 0, disabled },
      { name: 'capacity', label: SCHEDULE_PRICING.CAPACITY, type: 'number', min: 1, disabled },
      {
        name: 'guide',
        label: SCHEDULE_PRICING.GUIDE,
        type: 'select',
        placeholder: SCHEDULE_PRICING.SELECT_GUIDE,
        options: guides,
        isLoading: isGuidesLoading,
        disabled,
      },
    ],
    [departureDate, disabled, guides, isGuidesLoading],
  );

  return (
    <section
      data-testid="SchedulePricingTest"
      aria-labelledby={titleId}
      className={clsx(styles.card, className)}
    >
      <Typography variant="title-md" tag="h2" id={titleId} className={styles.header}>
        {SCHEDULE_PRICING.TITLE}
      </Typography>

      <DynamicForm fields={fields} className={styles.body} />
    </section>
  );
}
