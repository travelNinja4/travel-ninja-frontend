/**
 * The create tour screen's form. Save draft creates the tour as a draft and Publish creates it
 * published, through the `createTourAction` server action; on success the user goes back to the
 * tours list, otherwise the API's errors are shown and the form keeps its values.
 */
'use client';

import { useRouter } from 'next/navigation';
import { createTourAction } from '@/actions/tours';
import TourForm from '@/components/TourForm';
import type { DropdownOption } from '@/components/Dropdown/Dropdown';
import { NOTIFICATION_TYPES, ROUTES, STRINGS, TOUR_FORM } from '@/constants/strings';
import type { MetaOption, TourFormValues, TourStatus } from '@/constants/types';
import { useNotification } from '@/providers/NotificationProvider';
import { toTourPayload } from '@/utils/tourForm';

interface NewTourFormProps {
  categories: MetaOption[];
  guides: DropdownOption<string>[];
}

export default function NewTourForm({ categories, guides }: NewTourFormProps) {
  const router = useRouter();
  const { showNotification } = useNotification();

  // TourForm keeps its fields and buttons disabled until this settles
  const save = async (values: TourFormValues, status: TourStatus) => {
    const result = await createTourAction(toTourPayload(values, status, guides));
    if (!result.success) {
      result.errors.forEach((message) =>
        showNotification(STRINGS.ERROR, message, NOTIFICATION_TYPES.ERROR),
      );
      return;
    }
    showNotification(
      status === 'draft' ? TOUR_FORM.DRAFT_SAVED : TOUR_FORM.PUBLISHED,
      values.title,
      NOTIFICATION_TYPES.SUCCESS,
    );
    router.push(ROUTES.TOURS);
  };

  return <TourForm categories={categories} guides={guides} onSave={save} />;
}
