import '@testing-library/jest-dom/vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('./src/providers/NotificationProvider', () => ({
  useNotification: () => ({
    showNotification: vi.fn(),
  }),
}));
