'use client';

import NetworkStatus from '@/components/ui/NetworkStatus';
import { useEffect, useState } from 'react';

export default function NetworkStatusWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <NetworkStatus />;
}
