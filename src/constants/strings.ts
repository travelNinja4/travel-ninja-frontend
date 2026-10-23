import type { NotificationType } from '@/providers/NotificationProvider';
import type { TourStatus } from './types';

export const STRINGS = {
  APP_NAME: 'TravelNinja',
  LOGIN_BANNER_HEADER: 'Run tours with clarity',
  LOGIN_BANNER_SUB_TEXT:
    'TravelNinja helps Indian tour operators publish departures, fill seats, and track net earnings after platform commission.',
  CREATE_ACCOUNT_BANNER_HEADER: 'Built for tour operators',
  CREATE_ACCOUNT_BANNER_SUB_TEXT:
    'Publish departures, assign guides as labels, chat with guests, and see net earnings after commission — without spreadsheet chaos.',
  AGENCY_ONBOARDING: 'Agency onboarding',
  CREATE_ACCOUNT_HEADING: 'Create your agency account',
  CREATE_ACCOUNT_DESCRIPTION:
    'Start publishing tours in a few minutes. You’ll verify email and mobile next.',
  AGENCY_NAME: 'Agency name',
  AGENCY_NAME_PLACEHOLDER: 'Wanderly Travels',
  CONTACT_PERSON_NAME: 'Contact person’s name',
  FULL_NAME_PLACEHOLDER: 'Full name',
  COUNTRY: 'Country',
  SELECT_COUNTRY: 'Select country',
  BUSINESS_EMAIL: 'Business email',
  MOBILE_NUMBER: 'Mobile number',
  ENTER_EMAIL: 'Enter email',
  PASSWORD_HINT: 'At least 8 characters with mixed case, a number and a symbol.',
  I_AGREE_TO_THE: 'I agree to the',
  TERMS_OF_SERVICE: 'Terms of Service',
  AND: 'and',
  PRIVACY_POLICY: 'Privacy Policy',
  CREATE_ACCOUNT: 'Create account',
  ALREADY_REGISTERED: 'Already registered?',
  RESET_PASSWORD_BANNER_HEADER: 'Back to your bookings in a minute',
  RESET_PASSWORD_BANNER_SUB_TEXT:
    'Reset your password to regain access to your tours, bookings, and payouts.',
  VERIFICATION_BANNER_HEADER: 'Secure onboarding',
  VERIFICATION_BANNER_SUB_TEXT:
    'We verify business email and mobile so guests can trust who they’re booking with.',
  EMAIL: 'email',
  MOBILE: 'mobile',
  VERIFICATION: 'Verification',
  VERIFICATION_CODE: 'Verification code',
  VERIFY_YOUR_EMAIL: 'Verify your email',
  VERIFY_YOUR_MOBILE_NUMBER: 'Verify your mobile number',
  ENTER_CODE_SENT_TO: 'Enter the 6-digit code sent to',
  ENTER_COMPLETE_CODE: 'Enter all 6 digits of the code.',
  CHANGE_EMAIL: 'Change email',
  CHANGE_MOBILE_NUMBER: 'Change mobile number',
  VERIFY_AND_CONTINUE: 'Verify and continue',
  DIDNT_RECEIVE_CODE: 'Didn’t receive a code?',
  RESEND_CODE: 'Resend code',
  RESEND_CODE_IN: 'Resend code in',
  CODE_RESENT: 'A new code is on its way.',
  NO_OPTIONS_FOUND: 'No options found',
  LOADING: 'Loading...',
  COUNTRY_CODE: 'Country code',
  ENTER_MOBILE_NUMBER: 'Enter mobile number',
  PASSWORD_RECOVERY: 'Password recovery',
  ACCOUNT_RECOVERY_BANNER_HEADER: 'Account recovery',
  ACCOUNT_RECOVERY_BANNER_SUB_TEXT:
    'Links expire after a short window. Contact support if you no longer have access to the business email.',
  RESET_YOUR_PASSWORD: 'Reset your password',
  RESET_YOUR_PASSWORD_DESCRIPTION:
    'We’ll email a secure link to reset access to your agency account.',
  AGENCY_EMAIL_PLACEHOLDER: 'ops@youragency.com',
  SEND_RESET_LINK: 'Send reset link',
  BACK_TO_SIGN_IN: 'Back to sign in',
  CHANGE_YOUR_PASSWORD: 'Change your password',
  CHANGE_YOUR_PASSWORD_INSTRUCTION: 'Enter a new password below to change your password.',
  NEW_PASSWORD: 'New password',
  CONFIRM_PASSWORD: 'Confirm password',
  ENTER_NEW_PASSWORD: 'Enter your new password',
  RE_ENTER_NEW_PASSWORD: 'Re-enter your new password',
  RESET_PASSWORD: 'Reset password',
  RESET_LINK_INSTRUCTIONS: 'Reset link sent! Check your email for instructions.',
  SUCCESS: 'Success!',
  ERROR: 'Error!',
  INVALID_TOKEN_INSTRUCTION:
    'To reset password, return to the login page and select Forgot Password to send a new email',
  BACK_TO_LOG_IN: 'Back to log in',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  LINK_EXPIRED: 'Link Expired',
  YOUR_OFFLINE: 'You’re offline!',
  WAITING_FOR_CONNECTION: 'Waiting for connection...',
  PLEASE_CONNECT_TO_INTERNET: 'Please reconnect to the internet to continue.',
  AGENCY_OWNER: 'Agency Owner',
  AGENCY_DASHBOARD: 'Agency Dashboard',
  SIGN_IN_HEADING: 'Sign in to your agency',
  SIGN_IN_DESCRIPTION: 'Manage tours, bookings, and payouts in one place.',
  WORK_EMAIL: 'Work email',
  PASSWORD: 'Password',
  ENTER_YOUR_PASSWORD: 'Enter your password',
  REMEMBER_ME: 'Remember me',
  FORGOT_PASSWORD_LINK: 'Forgot password?',
  SIGN_IN: 'Sign in',
  NEW_AGENCY: 'New agency?',
  CREATE_AN_ACCOUNT: 'Create an account',
  LOGGED_IN_SUCCESSFUL: `You’ve logged in successfully!`,
  ACCOUNT_CREATED_SUCCESSFUL: 'Account created successfully',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  CANCEL: 'Cancel',
  VERIFICATION_SESSION_EXPIRED: 'Your verification session has expired. Please start again.',
};

// Session cookies set by the backend on login (AUTH_COOKIE_NAME / REFRESH_COOKIE_NAME in its config)
export const AUTH_COOKIES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/login/forgot-password',
  CREATE_ACCOUNT: '/create-account',
  VERIFY: '/create-account/verify',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  DASHBOARD: '/dashboard',
  TOURS: '/tours',
  NEW_TOUR: '/tours/new',
  BOOKINGS: '/bookings',
  CUSTOMERS: '/customers',
  CALENDAR: '/calendar',
  AVAILABILITY: '/availability',
  MESSAGES: '/messages',
  REVIEWS: '/reviews',
  TOUR_PERFORMANCE: '/insights/tours',
  REVENUE: '/insights/revenue',
  SETTINGS: '/settings',
  BILLING: '/billing',
} as const;

export const NOTIFICATION_TYPES: Record<string, NotificationType> = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const NAV_SECTION = {
  OPERATIONS: 'Operations',
  ENGAGE: 'Engage',
  INSIGHTS: 'Insights',
  ACCOUNT: 'Account',
};

export const NAV_ITEM = {
  DASHBOARD: 'Dashboard',
  TOURS: 'Tours',
  BOOKINGS: 'Bookings',
  CUSTOMERS: 'Customers',
  CALENDAR: 'Calendar',
  AVAILABILITY: 'Availability',
  MESSAGES: 'Messages',
  REVIEWS: 'Reviews',
  TOUR_PERFORMANCE: 'Tour performance',
  REVENUE: 'Revenue',
  SETTINGS: 'Settings',
  BILLING: 'Billing & payouts',
};

export const SIDEBAR = {
  MAIN_NAVIGATION: 'Main navigation',
  COLLAPSE: 'Collapse sidebar',
  EXPAND: 'Expand sidebar',
  OPEN_NAVIGATION: 'Open navigation',
  CLOSE_NAVIGATION: 'Close navigation',
  SIGN_OUT: 'Sign out',
  // Placeholder agency until the session's agency is wired in
  AGENCY_NAME: 'Wanderly Travels',
  AGENCY_PLAN: 'Professional plan',
};

export const APP_HEADER = {
  BREADCRUMB: 'Breadcrumb',
  TOGGLE_THEME: 'Toggle dark mode',
  NOTIFICATIONS: 'Notifications',
};

export const SEARCH_INPUT = {
  PLACEHOLDER: 'Search tours or destinations...',
  CLEAR: 'Clear search',
  LOADING: 'Searching',
};

export const TOURS = {
  PAGE_TITLE: 'Tours',
  PAGE_DESCRIPTION: 'Publish, draft, and archive departures for',
  NEW_TOUR: 'New tour',
  ALL_STATUSES: 'All statuses',
  ALL_CATEGORIES: 'All categories',
  STATUS_FILTER: 'Filter by status',
  CATEGORY_FILTER: 'Filter by category',
  NO_MATCHES_TITLE: 'No tours match your filters',
  NO_MATCHES_DESCRIPTION: 'Try a different search term, status or category.',
  LOAD_ERROR_TITLE: 'We couldn’t load your tours',
  LOAD_ERROR_DESCRIPTION: 'Check your connection and try again.',
  TRY_AGAIN: 'Try again',
  LOADING: 'Loading tours',
  PAGE_EMPTY_TITLE: 'No tours on this page',
  PAGE_EMPTY_DESCRIPTION: 'Go back to an earlier page to see your tours.',
  LIST_LABEL: 'Tours',
  EMPTY_TITLE: 'No tours yet',
  EMPTY_DESCRIPTION: 'Tours you create will show up here.',
  SHOWING: 'Showing',
  OF: 'of',
  DEPARTURE: 'Departure',
  PRICE: 'Price',
  CAPACITY: 'Capacity',
  OCCUPANCY: 'Occupancy',
  EDIT: 'Edit',
  VIEW: 'View',
  DUPLICATE: 'Duplicate',
  DELETE: 'Delete',
  DELETE_TITLE: 'Delete this tour?',
  DELETE_DESCRIPTION: 'will be removed with its itinerary and photos. This can’t be undone.',
  DELETE_CONFIRM: 'Delete tour',
  DELETED: 'Tour deleted',
  DELETE_FAILED: 'We couldn’t delete this tour',
  // Shown for a value the API hasn't sent
  NOT_AVAILABLE: '—',
};

export const TOUR_FORM = {
  CREATE_TITLE: 'Create tour',
  CREATE_DESCRIPTION: 'Build a departure guests can discover and book.',
  EDIT_TITLE: 'Edit tour',
  SAVE_DRAFT: 'Save draft',
  PUBLISH: 'Publish',
  UPDATE: 'Update',
  DRAFT_SAVED: 'Draft saved',
  PUBLISHED: 'Tour published',
};

// Placeholder guides until the guides API is wired in
export const TOUR_GUIDES = [
  { value: 'arjun', label: 'Arjun Mehta' },
  { value: 'priya', label: 'Priya Nair' },
  { value: 'rahul', label: 'Rahul Sharma' },
];

export const TOUR_BASICS = {
  TITLE: 'Basics',
  TOUR_TITLE: 'Tour title',
  DESTINATION: 'Destination',
  CATEGORY: 'Category',
  SELECT_CATEGORY: 'Select category',
  DESCRIPTION: 'Description',
};

export const COVER_GALLERY = {
  TITLE: 'Cover & gallery',
  COVER: 'Cover image',
  COVER_PROMPT: 'Upload a cover image',
  DROP_HINT: 'Drag and drop, or click to browse',
  COVER_HINT:
    'JPG, PNG or WebP up to 5 MB. Wide images work best; keep the subject centred, as tour cards crop to a wide banner.',
  COVER_PREVIEW: 'Cover image preview',
  REPLACE: 'Replace',
  REMOVE: 'Remove',
  GALLERY: 'Gallery',
  GALLERY_HINT: 'Add photos of the stays, food and highlights. Pick several at once.',
  ADD_PHOTO: 'Add photo',
  PHOTO: 'Gallery photo',
  REMOVE_PHOTO: 'Remove photo',
  INVALID_TYPE: 'Use a JPG, PNG or WebP image',
  TOO_LARGE: 'Images must be 5 MB or smaller',
  GALLERY_FULL: 'The gallery holds up to 10 photos',
};

export const TOUR_POLICIES = {
  TITLE: 'Inclusions & policy',
  INCLUSIONS: 'Inclusions',
  EXCLUSIONS: 'Exclusions',
  CANCELLATION_POLICY: 'Cancellation policy',
};

export const SCHEDULE_PRICING = {
  TITLE: 'Schedule & pricing',
  DURATION: 'Duration (days)',
  DEPARTURE_DATE: 'Departure date',
  RETURN_DATE: 'Return date',
  PRICE: 'Price per person (INR)',
  CAPACITY: 'Capacity',
  GUIDE: 'Guide label',
  SELECT_GUIDE: 'Select guide',
};

export const ITINERARY = {
  TITLE: 'Itinerary',
  ADD_DAY: 'Add day',
  REMOVE_DAY: 'Remove',
  DAY: 'Day',
  UNTITLED: 'Untitled',
  DAY_TITLE: 'Title',
  LOCATION: 'Location',
  DESCRIPTION: 'Description',
};

// Categories the tours API accepts
export const PAGINATION = {
  LABEL: 'Pagination',
  PAGE: 'Page',
  MORE_PAGES: 'More pages',
};

export const TABLE = {
  SHOWING: 'Showing',
  OF: 'of',
  LOADING: 'Loading',
  EMPTY_TITLE: 'Nothing to show',
  EMPTY_DESCRIPTION: 'Records will show up here once there are some.',
};

export const TOUR_STATUS_LABEL: Record<TourStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

/**
 * The saved theme. With nothing saved, the app follows the OS preference.
 * The key is also read by the inline script in app/layout.tsx.
 */
export const THEME = {
  STORAGE_KEY: 'theme',
  LIGHT: 'light',
  DARK: 'dark',
} as const;

/**
 * Viewport ranges shared with the SCSS breakpoints in src/styles/_mixins.scss.
 */
export const MEDIA_QUERIES = {
  // < 768px: the sidebar is a slide-in drawer here
  PHONE: '(max-width: 767.98px)',
  // 768–1023px: the sidebar starts collapsed to an icon rail here
  TABLET_ONLY: '(min-width: 768px) and (max-width: 1023.98px)',
  PREFERS_DARK: '(prefers-color-scheme: dark)',
} as const;
