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

/**
 * Result returned by every server action. Actions never throw to the client, because Next.js hides
 * thrown error messages in production.
 */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; errors: string[] };
