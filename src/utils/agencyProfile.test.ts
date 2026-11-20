import type { AgencyProfile, Region } from '@/constants/types';
import { toAgencyProfilePayload, toAgencyProfileValues } from './agencyProfile';

const STATES: Region[] = [
  { id: 1, name: 'Karnataka' },
  { id: 2, name: 'Kerala' },
];

const PROFILE: AgencyProfile = {
  id: 3,
  userId: 7,
  agencyName: 'Wander Trails',
  tagline: 'Small-group trips across South India',
  description: 'We run curated weekend escapes',
  destinations: ['Karnataka', 'Kerala', 'Tamil Nadu'],
  email: 'hello@wandertrails.in',
  phoneNumber: '+91-9876543210',
  website: 'https://wandertrails.in',
  address: '12 MG Road',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560001',
  country: 'India',
};

describe('toAgencyProfileValues', () => {
  it('maps the saved profile onto the form fields', () => {
    expect(toAgencyProfileValues(PROFILE, STATES)).toEqual({
      name: 'Wander Trails',
      tagline: 'Small-group trips across South India',
      description: 'We run curated weekend escapes',
      destinations: 'Karnataka, Kerala, Tamil Nadu',
      email: 'hello@wandertrails.in',
      phone: '+91-9876543210',
      website: 'https://wandertrails.in',
      street: '12 MG Road',
      state: '1',
      city: 'Bengaluru',
      pin: '560001',
    });
  });

  it('matches the state by name, ignoring case and spaces', () => {
    expect(toAgencyProfileValues({ ...PROFILE, state: ' kerala ' }, STATES).state).toBe('2');
  });

  it('leaves a state missing from the list unpicked', () => {
    expect(toAgencyProfileValues({ ...PROFILE, state: 'Goa' }, STATES).state).toBe('');
    expect(toAgencyProfileValues({ ...PROFILE, state: 'Karnataka' }, []).state).toBe('');
  });

  it('turns empty optional fields into empty text', () => {
    const values = toAgencyProfileValues(
      {
        ...PROFILE,
        tagline: null,
        description: null,
        destinations: [],
        phoneNumber: null,
        website: null,
        address: null,
        city: null,
        state: null,
        pincode: null,
      },
      STATES,
    );
    expect(values).toMatchObject({
      tagline: '',
      description: '',
      destinations: '',
      phone: '',
      website: '',
      street: '',
      state: '',
      city: '',
      pin: '',
    });
  });
});

describe('toAgencyProfilePayload', () => {
  it('sends every editable field with the state by name, and no read-only ones', () => {
    const payload = toAgencyProfilePayload(toAgencyProfileValues(PROFILE, STATES), STATES);
    expect(payload).toEqual({
      agencyName: 'Wander Trails',
      tagline: 'Small-group trips across South India',
      description: 'We run curated weekend escapes',
      destinations: 'Karnataka, Kerala, Tamil Nadu',
      website: 'https://wandertrails.in',
      address: '12 MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    });
  });
});
