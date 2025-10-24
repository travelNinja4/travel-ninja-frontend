'use client';

/**
 * Custom React hook to detect the network connectivity status of the user.
 *
 * It returns `true` if the user is online and `false` if offline.
 * The hook listens to the `online` and `offline` events on the window and updates
 * the state accordingly.
 *
 * @example
 * ```tsx
 * import { useNetworkStatus } from '@/hooks/useNetworkStatus';
 *
 * export default function MyComponent() {
 *   const isOnline = useNetworkStatus();
 *
 *   return (
 *     <div>
 *       {isOnline ? 'You are online!' : 'You are offline!'}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {boolean} `true` if online, `false` if offline
 */

import { useEffect, useState } from 'react';

export const useNetworkStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
