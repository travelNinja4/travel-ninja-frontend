export const STRINGS = {
  APP_NAME: 'TravelNinja',
  CREATE_ACCOUNT_APP_TAG_LINE: 'Transform your tour business with our powerful platform',
  LOGIN_APP_TAG_LINE: 'Empowering tour agencies to create unforgettable travel experiences',
  EMAIL: 'email',
  MOBILE: 'mobile',
  EMAIL_VERIFICATION: 'Email Verification',
  MOBILE_NUMBER_VERIFICATION: 'Mobile Number Verification',
  EMAIL_SENT: `We've sent a verification code to your email`,
  MOBILE_SENT: `We've sent a verification code to your mobile number`,
  EMAIL_CODE_HINT: 'Enter the 6-digit code sent to your email',
  MOBILE_CODE_HINT: 'Enter the 6-digit code sent to your mobile number',
  VERIFY_EMAIL: 'Verify Email',
  VERIFY_MOBILE_NUMBER: 'Verify Mobile Number',
  ENTER_VERIFICATION_CODE: 'Enter Verification Code',
  RESEND_CODE_IN: 'Resend code in',
  SECONDS: 'seconds',
  RESEND_CODE: 'Resend Code',
  NO_OPTIONS_FOUND: 'No options found',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CREATE_ACCOUNT: '/createAccount',
  VERIFY: '/verify',
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
