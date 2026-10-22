import type { MetaOptions } from '@/constants/types';

/** Filter options for stories and tests, shaped like the POST /meta/options response. */
export const MOCK_FILTER_OPTIONS: MetaOptions = {
  tour_status: [
    { id: 1, value: 'draft', label: 'Draft' },
    { id: 2, value: 'published', label: 'Published' },
    { id: 3, value: 'archived', label: 'Archived' },
  ],
  tour_category: [
    { id: 1, value: 'Nature', label: 'Nature' },
    { id: 2, value: 'Relaxation', label: 'Relaxation' },
    { id: 3, value: 'Heritage', label: 'Heritage' },
    { id: 4, value: 'Cultural', label: 'Cultural' },
    { id: 5, value: 'Adventure', label: 'Adventure' },
    { id: 6, value: 'Beach', label: 'Beach' },
  ],
};
