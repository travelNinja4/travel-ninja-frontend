/**
 * used to store global types in the project
 *
 */

export type OtpType = 'email' | 'mobile';

export type OtpProps = {
  otpCode: string;
  otpType?: OtpType;
};

export type Country = {
  name: string;
  code: string;
  length: number;
};

/** A state, or a district within one, from GET /api/states and /api/states/{stateId}/districts */
export type Region = {
  id: number;
  name: string;
};

/** Body of POST /auth/register. Only fullName, email, phoneNumber, password and termStatus are required by the API. */
export type RegisterPayload = {
  fullName: string;
  agencyName?: string;
  country?: string;
  email: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  /** Dial code and number, e.g. "+91-9876543210" */
  phoneNumber: string;
  password: string;
  termStatus: boolean;
  role: string;
};

export type Login = {
  email: string;
  password: string;
  role?: string;
  /** Keeps the session for 30 days instead of until the browser closes */
  rememberMe?: boolean;
};

export type forgotPassword = {
  email: string;
};

export type resetPassword = {
  newPassword: string;
  confirmPassword: string;
};

/**
 * Contact details of a user who still has to verify an OTP (after register or login).
 * Kept server-side in an httpOnly cookie, never in client state.
 */
export type PendingVerification = {
  email?: string;
  phoneNumber?: string;
};

export type TourStatus = 'draft' | 'published' | 'archived';

/** A tour as returned by the tours API. */
export type Tour = {
  id: number;
  title: string;
  /** Place and region, e.g. "Coorg, Karnataka" */
  destination: string;
  categoryId: number;
  category: MetaOption;
  durationDays: number;
  /** Price per guest in rupees */
  price: number;
  /** Total seats */
  capacity: number;
  status: TourStatus;
  /** "YYYY-MM-DD" */
  departureDate: string;
  /** "YYYY-MM-DD" */
  returnDate: string;
  coverImageUrl: string | null;
  guide: string;
  /** Seats already booked. Not sent by the API yet; until it is, occupancy shows as "—". */
  bookedSeats?: number;
};

/** One day of a saved tour's itinerary */
export type TourItineraryDay = ItineraryDay & {
  id: number;
  /** 1-based */
  day: number;
};

/** One saved photo of a tour */
export type TourPhoto = {
  id: number;
  kind: 'cover' | 'gallery';
  url: string;
  storageKey: string;
  sortOrder: number;
  createdAt: string;
};

/** A single tour as returned by GET /tours/{id}, with everything the tour form edits */
export type TourDetails = Tour & {
  userId: number;
  description: string;
  inclusions: string[];
  exclusions: string[];
  cancellation: string;
  itinerary: TourItineraryDay[];
  /** Gallery photos only: the cover is `coverImageUrl` */
  gallery: TourPhoto[];
  createdAt: string;
  updatedAt: string;
};

/** Fields of the "Basics" section of the tour form */
export type TourBasics = {
  title: string;
  /** Place and region, e.g. "Coorg, Karnataka" */
  destination: string;
  /** `id` of a `tour_category` meta option as a string, since the dropdown holds strings */
  categoryId: string;
  description: string;
};

/**
 * Fields of the "Schedule & pricing" section of the tour form. Number inputs are
 * read with `valueAsNumber`, so an empty one is `NaN` until the schema rejects it.
 */
export type TourSchedule = {
  durationDays: number;
  /** "YYYY-MM-DD" */
  departureDate: string;
  /** "YYYY-MM-DD" */
  returnDate: string;
  /** Price per guest in rupees */
  price: number;
  capacity: number;
  guide: string;
};

/** One day of a tour's itinerary */
export type ItineraryDay = {
  title: string;
  location: string;
  description: string;
};

/** The itinerary part of the tour form, one entry per day in order */
export type TourItinerary = {
  itinerary: ItineraryDay[];
};

/** Fields of the "Inclusions & policy" section of the tour form */
export type TourPolicies = {
  inclusions: string;
  exclusions: string;
  cancellationPolicy: string;
};

/** An image the tour already has. `id` is set for gallery photos; the cover only has a URL. */
export type SavedImage = {
  id?: number;
  url: string;
};

/** A tour image: picked on this device, or already saved with the tour */
export type TourImage = File | SavedImage;

/** Fields of the "Cover & gallery" section of the tour form */
export type TourMedia = {
  coverImage: TourImage | null;
  /** In the order they were added */
  gallery: TourImage[];
};

/** Every field of the tour form, used to create and edit tours */
export type TourFormValues = TourBasics & TourMedia & TourSchedule & TourItinerary & TourPolicies;

/** Every field of the agency profile screen: its public identity, contact details and address */
export type AgencyProfileValues = {
  logo: TourImage | null;
  banner: TourImage | null;
  name: string;
  tagline: string;
  description: string;
  /** States or places the agency runs trips to, as typed, e.g. `Karnataka, Kerala, Goa` */
  destinations: string;
  email: string;
  phone: string;
  website: string;
  street: string;
  /** Region id of the state, as a string for the dropdown; empty when none is picked */
  state: string;
  /** Region id of a district within `state`; empty when none is picked */
  district: string;
  city: string;
  pin: string;
};

/** The agency's saved profile, as returned by GET and PUT /agency/profile */
export type AgencyProfile = {
  id: number;
  userId: number;
  agencyName: string;
  tagline: string | null;
  description: string | null;
  destinations: string[];
  /** From the agency's registration; read-only on the profile screen */
  email: string;
  /** From the agency's registration; read-only on the profile screen */
  phoneNumber: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  /** The state's name, e.g. `Karnataka` */
  state: string | null;
  pincode: string | null;
  country: string | null;
};

/**
 * Body of PUT /agency/profile. Replaces every editable field: an optional field left empty is
 * cleared. Email, phone, country, logo and banner aren't part of it.
 */
export type UpdateAgencyProfilePayload = {
  agencyName: string;
  tagline: string;
  description: string;
  /** Comma-separated, as typed; the API trims it and drops blanks and duplicates */
  destinations: string;
  website: string;
  address: string;
  city: string;
  /** The state's name, not its id */
  state: string;
  pincode: string;
};

/** Body of POST /tours/create-tour. Optional text fields are left out when empty. */
export type CreateTourPayload = {
  title: string;
  destination: string;
  categoryId: number;
  description?: string;
  durationDays: number;
  /** "YYYY-MM-DD" */
  departureDate: string;
  /** "YYYY-MM-DD" */
  returnDate: string;
  /** Price per guest in rupees */
  price: number;
  capacity: number;
  /** Guide display name */
  guide: string;
  inclusions: string[];
  exclusions: string[];
  cancellation?: string;
  status: TourStatus;
  itinerary: (ItineraryDay & { day: number })[];
};

/** Body of PATCH /tours/{id}: only the fields that change. `itinerary` replaces every day. */
export type UpdateTourPayload = Partial<CreateTourPayload>;

/** Statuses the tours API can filter by */
export type TourStatusFilter = TourStatus;

/** Lookup lists POST /meta/options can return */
export type MetaOptionKey = 'tour_status' | 'tour_category';

/** One active lookup value, e.g. `{ id: 6, value: 'Beach', label: 'Beach' }` */
export type MetaOption<T extends string = string> = {
  /** Sent as `categoryId` when creating or searching tours */
  id: number;
  value: T;
  label: string;
};

/** Response of POST /meta/options. Keys that weren't requested come back empty. */
export type MetaOptions = {
  tour_status: MetaOption<TourStatus>[];
  tour_category: MetaOption[];
};

/** Filters of the tours screen, sent to POST /tours/search */
export type TourSearch = {
  /** Matches title or destination, case-insensitive */
  search?: string;
  status?: TourStatusFilter;
  /** `id` of a `tour_category` meta option */
  categoryId?: number;
};

/** One page of the agency's tours matching a TourSearch. */
export type TourPage = {
  tours: Tour[];
  /** 1-based */
  page: number;
  /** Tours matching the filters across all pages */
  total: number;
  pageCount: number;
};

/** A customer's most recent booking that wasn't cancelled */
export type CustomerTrip = {
  bookingId: number;
  tourId: number;
  tourTitle: string;
  /** "YYYY-MM-DD" */
  tripDate: string;
};

/** A guest who has booked one of the agency's tours, as returned by POST /customers/search. */
export type Customer = {
  id: number;
  fullName: string;
  email: string;
  /** Dial code and number, e.g. "+91-9811122334" */
  phoneNumber: string;
  /** Not every customer has entered one */
  city: string | null;
  /** Bookings that weren't cancelled */
  bookingsCount: number;
  /** Rupees across those bookings */
  totalSpend: number;
  lastTrip: CustomerTrip;
};

/** Filters of the customers screen, sent to POST /customers/search */
export type CustomerSearch = {
  /** Matches name, email or city, case-insensitive */
  search?: string;
  /** Exact city from GET /customers/cities, case-insensitive */
  city?: string;
};

/** One page of the agency's customers matching a CustomerSearch, most recently booked first. */
export type CustomerPage = {
  customers: Customer[];
  /** 1-based */
  page: number;
  /** Customers matching the filters across all pages */
  total: number;
  pageCount: number;
};

/**
 * Result returned by every server action. Actions never throw to the client, because Next.js hides
 * thrown error messages in production.
 */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; errors: string[] };
