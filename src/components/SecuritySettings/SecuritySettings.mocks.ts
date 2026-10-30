import type { ActiveSession } from '@/constants/types';

// Placeholder sessions until the sessions API is wired in
export const MOCK_SESSIONS: ActiveSession[] = [
  {
    id: 'chrome-macos',
    device: 'Chrome on macOS',
    location: 'Bengaluru, IN',
    lastActive: 'Just now',
    current: true,
  },
  {
    id: 'safari-iphone',
    device: 'Safari on iPhone',
    location: 'Bengaluru, IN',
    lastActive: '2 hours ago',
  },
  {
    id: 'chrome-windows',
    device: 'Chrome on Windows',
    location: 'Mumbai, IN',
    lastActive: '3 days ago',
  },
];
