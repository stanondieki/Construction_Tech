'use client';

import { useState, useEffect } from 'react';
import { offlineStorage } from '@/lib/utils/offlineStorage';

/**
 * Component that shows the sync status of offline operations
 * Displays a badge with the number of pending operations
 * and provides a way to manually trigger sync
 */
export default function SyncStatus() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Function to check online status
  const checkOnlineStatus = async (): Promise<boolean> => {
    if (typeof navigator === 'undefined') return true;
    
    // Check navigator.onLine first
    if (!navigator.onLine) return false;
    
    try {
      // Perform a lightweight HEAD request to verify actual connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await fetch('/api/ping', { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch {
      return false;
    }
  };

  // Function to manually trigger sync
  const triggerSync = async () => {
    if (!isOnline || isSyncing) return;
    
    setIsSyncing(true);
    
    // We'll dispatch a custom event that the API module listens for
    window.dispatchEvent(new CustomEvent('ujenziiq:sync-request'));
    
    // Reset syncing status after some time
    setTimeout(() => {
      setIsSyncing(false);
      updatePendingCount();
    }, 3000);
  };
  
  const updatePendingCount = () => {
    const operations = offlineStorage.getPendingOperations();
    setPendingCount(operations.length);
  };

  useEffect(() => {
    // Update pending count immediately
    updatePendingCount();
    
    // Check online status immediately
    checkOnlineStatus().then(setIsOnline);
    
    // Set up event listeners for online/offline status
    const handleOnline = () => {
      checkOnlineStatus().then(online => {
        setIsOnline(online);
        if (online) {
          // When coming back online, trigger sync automatically
          triggerSync();
        }
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    // Listen for custom events when operations are queued or synced
    const handleOperationQueued = () => {
      updatePendingCount();
    };
    
    const handleOperationSynced = () => {
      updatePendingCount();
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('ujenziiq:operation-queued', handleOperationQueued);
    window.addEventListener('ujenziiq:operation-synced', handleOperationSynced);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('ujenziiq:operation-queued', handleOperationQueued);
      window.removeEventListener('ujenziiq:operation-synced', handleOperationSynced);
    };
  }, []);
  
  // Don't render anything if there are no pending operations
  if (pendingCount === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-14 right-4 z-50">
      <button 
        onClick={triggerSync}
        disabled={!isOnline || isSyncing}
        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
          isSyncing 
            ? 'bg-blue-200 text-blue-800' 
            : isOnline 
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
              : 'bg-gray-200 text-gray-700 cursor-not-allowed'
        }`}
      >
        <span className="relative flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSyncing ? 'bg-blue-500' : 'bg-blue-400'} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${isSyncing ? 'bg-blue-600' : 'bg-blue-500'}`}></span>
        </span>
        {isSyncing ? `Syncing...` : `Sync (${pendingCount})`}
      </button>
    </div>
  );
}
