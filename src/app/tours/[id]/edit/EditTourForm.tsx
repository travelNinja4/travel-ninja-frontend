/**
 * The edit tour screen's form. Update sends only the fields that changed, through the
 * `updateTourAction` server action, and the tour keeps its status; on success the user goes back
 * to the tours list, otherwise the API's errors are shown and the form keeps its values.
 */
'use client';

import { useRouter } from 'next/navigation';
import { updateTourAction } from '@/actions/tours';
import TourForm from '@/components/TourForm';
import type { DropdownOption } from '@/components/Dropdown/Dropdown';
import { NOTIFICATION_TYPES, ROUTES, STRINGS, TOUR_FORM } from '@/constants/strings';
import type { MetaOption, TourDetails, TourFormValues } from '@/constants/types';
import { useNotification } from '@/providers/NotificationProvider';
import { toTourUpdatePayload, withGuide } from '@/utils/tourForm';

interface EditTourFormProps {
  tour: TourDetails;
  categories: MetaOption[];
  guides: DropdownOption<string>[];
}

export default function EditTourForm({ tour, categories, guides }: EditTourFormProps) {
  const router = useRouter();
  const { showNotification } = useNotification();

  // TourForm keeps its fields and buttons disabled until this settles
  const save = async (values: TourFormValues) => {
    // The same guide list TourForm shows, so the tour's own guide is matched
    const payload = toTourUpdatePayload(values, tour, withGuide(guides, tour.guide));

    // Nothing changed: skip the request
    if (!Object.keys(payload).length) {
      showNotification(TOUR_FORM.NO_CHANGES, values.title, NOTIFICATION_TYPES.INFO);
      router.push(ROUTES.TOURS);
      return;
    }

    const result = await updateTourAction(tour.id, payload);
    if (!result.success) {
      result.errors.forEach((message) =>
        showNotification(STRINGS.ERROR, message, NOTIFICATION_TYPES.ERROR),
      );
      return;
    }
    showNotification(TOUR_FORM.UPDATED, values.title, NOTIFICATION_TYPES.SUCCESS);
    router.push(ROUTES.TOURS);
  };

  return <TourForm tour={tour} categories={categories} guides={guides} onSave={save} />;
}
