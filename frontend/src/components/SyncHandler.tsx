'use client';

import { useSyncCartWishlist } from '../hooks/useSyncCartWishlist';

export default function SyncHandler({ children }: { children: React.ReactNode }) {
  useSyncCartWishlist();
  return <>{children}</>;
}
