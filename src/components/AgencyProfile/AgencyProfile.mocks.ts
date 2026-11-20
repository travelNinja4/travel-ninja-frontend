import type { ActionResult, Region } from '@/constants/types';

export const MOCK_STATES: Region[] = [
  { id: 1, name: 'Karnataka' },
  { id: 2, name: 'Kerala' },
];

export const MOCK_DISTRICTS: Record<number, Region[]> = {
  1: [
    { id: 11, name: 'Bengaluru Urban' },
    { id: 12, name: 'Mysuru' },
  ],
  2: [
    { id: 21, name: 'Ernakulam' },
    { id: 22, name: 'Thiruvananthapuram' },
  ],
};

/** Stands in for `getDistrictsAction`, answering from MOCK_DISTRICTS */
export const mockGetDistricts = async (stateId: number): Promise<ActionResult<Region[]>> => ({
  success: true,
  data: MOCK_DISTRICTS[stateId] ?? [],
});
