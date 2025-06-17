'use client';

import dynamic from "next/dynamic";

// Dynamically import the NetworkStatus component with no SSR to avoid hydration issues
const NetworkStatusClient = dynamic(() => import('@/app/network-status'), {
  ssr: false
});

// Dynamically import the SyncStatus component
const SyncStatusClient = dynamic(() => import('@/components/ui/SyncStatus'), {
  ssr: false
});

export default function NetworkStatusClientWrapper() {
  return (
    <>
      <NetworkStatusClient />
      <SyncStatusClient />
    </>
  );
}
