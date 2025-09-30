import '@testing-library/jest-dom';

jest.mock('./src/store/auth', () => ({
  useAuthStore: jest.fn((selector) =>
    selector({
      accountData: {
        email: 'test@example.com',
        phoneNumber: {
          country: 'US (+1)',
          number: '1234567890',
        },
      },
    }),
  ),
}));

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

// authService mock
jest.mock('./src/services/authService', () => ({
  authService: {
    sendOtp: jest.fn(),
    verifyOtp: jest.fn(),
  },
}));
