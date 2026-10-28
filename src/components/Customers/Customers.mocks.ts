import type { Customer } from '@/constants/types';

/** Customers for stories and tests, shaped like the POST /customers/search response. */
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 12,
    fullName: 'Sneha Krishnan',
    email: 'sneha.k@example.com',
    phoneNumber: '+91-9811122334',
    city: 'Chennai',
    bookingsCount: 2,
    totalSpend: 69000,
    lastTrip: {
      bookingId: 31,
      tourId: 4,
      tourTitle: 'Coorg Weekend Escape',
      tripDate: '2026-08-15',
    },
  },
  {
    id: 15,
    fullName: 'Vikram Shah',
    email: 'vikram.shah@example.com',
    phoneNumber: '+91-9822233445',
    city: 'Mumbai',
    bookingsCount: 1,
    totalSpend: 25000,
    lastTrip: {
      bookingId: 36,
      tourId: 4,
      tourTitle: 'Coorg Weekend Escape',
      tripDate: '2026-11-14',
    },
  },
  {
    id: 18,
    fullName: 'Meera Patel',
    email: 'meera.patel@example.com',
    phoneNumber: '+91-9833344556',
    city: 'Ahmedabad',
    bookingsCount: 2,
    totalSpend: 121000,
    lastTrip: {
      bookingId: 29,
      tourId: 2,
      tourTitle: 'Kerala Backwaters Experience',
      tripDate: '2026-08-12',
    },
  },
  {
    id: 21,
    fullName: 'Aditya Rao',
    email: 'aditya.rao@example.com',
    phoneNumber: '+91-9844455667',
    city: 'Hyderabad',
    bookingsCount: 1,
    totalSpend: 14900,
    lastTrip: {
      bookingId: 41,
      tourId: 7,
      tourTitle: 'Hampi Heritage Trail',
      tripDate: '2026-12-05',
    },
  },
  {
    id: 24,
    fullName: 'Fatima Sheikh',
    email: 'fatima.s@example.com',
    phoneNumber: '+91-9855566778',
    city: null,
    bookingsCount: 1,
    totalSpend: 55000,
    lastTrip: { bookingId: 44, tourId: 9, tourTitle: 'Meghalaya Explorer', tripDate: '2027-01-10' },
  },
];

/** Cities for the city filter, shaped like the GET /customers/cities response. */
export const MOCK_CITIES = ['Ahmedabad', 'Chennai', 'Delhi', 'Hyderabad', 'Mumbai'];
