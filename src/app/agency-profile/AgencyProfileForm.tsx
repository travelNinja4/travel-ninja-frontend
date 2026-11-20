/**
 * The agency profile screen's form. Save changes sends every editable field through the
 * `updateAgencyProfileAction` server action, skipping the request when nothing changed since the
 * last save; the API's errors are shown and the form keeps its values.
 */
'use client';

import { useRef } from 'react';
import { getDistrictsAction } from '@/actions/common';
import { updateAgencyProfileAction } from '@/actions/agency';
import AgencyProfile from '@/components/AgencyProfile';
import { AGENCY_PROFILE, NOTIFICATION_TYPES, STRINGS } from '@/constants/strings';
import type { AgencyProfileValues, Region, UpdateAgencyProfilePayload } from '@/constants/types';
import { useNotification } from '@/providers/NotificationProvider';
import { SavedAgencyProfileValues, toAgencyProfilePayload } from '@/utils/agencyProfile';

interface AgencyProfileFormProps {
  /** The saved profile as form values; missing when the agency has none yet */
  profile?: SavedAgencyProfileValues;
  states: Region[];
}

/** Compares payloads by value; their keys are always built in the same order */
const sameAs = (a: object, b: object) => JSON.stringify(a) === JSON.stringify(b);

export default function AgencyProfileForm({ profile, states }: AgencyProfileFormProps) {
  const { showNotification } = useNotification();
  // What the API holds now, to skip saving the same values again; null when there's no profile yet
  const saved = useRef<UpdateAgencyProfilePayload | null>(
    profile ? toAgencyProfilePayload(profile, states) : null,
  );

  // AgencyProfile keeps its fields and button disabled until this settles
  const save = async (values: AgencyProfileValues) => {
    const payload = toAgencyProfilePayload(values, states);

    if (saved.current && sameAs(payload, saved.current)) {
      showNotification(AGENCY_PROFILE.NO_CHANGES, values.name, NOTIFICATION_TYPES.INFO);
      return;
    }

    const result = await updateAgencyProfileAction(payload);
    if (!result.success) {
      result.errors.forEach((message) =>
        showNotification(STRINGS.ERROR, message, NOTIFICATION_TYPES.ERROR),
      );
      return;
    }
    saved.current = payload;
    showNotification(AGENCY_PROFILE.SAVED, result.data.agencyName, NOTIFICATION_TYPES.SUCCESS);
  };

  return (
    <AgencyProfile
      profile={profile}
      states={states}
      getDistricts={getDistrictsAction}
      onSave={save}
    />
  );
}
