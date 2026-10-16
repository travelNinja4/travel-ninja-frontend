import '@testing-library/jest-dom';

// next/navigation mock
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// NotificationProvider mock
jest.mock('./src/providers/NotificationProvider', () => ({
  useNotification: () => ({
    showNotification: jest.fn(),
  }),
}));

// server actions mock: the real module imports server-only code that can't run in jsdom
jest.mock('./src/actions/auth', () => ({
  registerAction: jest.fn(),
  sendOtpAction: jest.fn(),
  verifyOtpAction: jest.fn(),
  loginAction: jest.fn(),
  verifyLoginAction: jest.fn(),
  forgotPasswordAction: jest.fn(),
  resetPasswordAction: jest.fn(),
  logoutAction: jest.fn(),
}));
