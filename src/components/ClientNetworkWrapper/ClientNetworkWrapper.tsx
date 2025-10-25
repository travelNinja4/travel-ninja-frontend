/**
 * A client-side wrapper that conditionally renders children or the offline screen based on the user’s network connectivity.
 *
 * @example
 * ```tsx
 * import ClientNetworkWrapper from '@src/components/ClientNetworkWrapper'
 *
 * export default function ClientNetworkWrapper() {
 *   return <ClientNetworkWrapper label="Hello" />;
 * }
 * ```
 */
'use client';

import { useEffect, useState } from 'react';
import OfflinePage from '../OfflinePage';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * Define the props available for the ClientNetworkWrapper component.
 */
interface ClientNetworkWrapperProps {
  children: React.ReactNode;
}

export default function ClientNetworkWrapper({ children }: ClientNetworkWrapperProps) {
  const isOnline = useNetworkStatus();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return isOnline ? <>{children}</> : <OfflinePage />;
}
