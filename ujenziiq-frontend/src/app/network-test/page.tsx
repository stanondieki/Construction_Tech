'use client';

import { useState, useEffect } from 'react';

export default function NetworkStatusTest() {
  const [onlineStatus, setOnlineStatus] = useState<boolean | null>(null);
  const [apiReachable, setApiReachable] = useState<boolean | null>(null);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Check navigator.onLine
    setOnlineStatus(navigator.onLine);

    // Test API reachability
    const testAPI = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });
        setApiReachable(response.ok);
      } catch (error) {
        setApiReachable(false);
      }
    };

    testAPI();

    // Listen for online/offline events
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const testRegistrationBypass = async () => {
    setTestResult('Testing registration without offline wrapper...');
    
    const testUserData = {
      username: `bypass_${Date.now()}`,
      email: `bypass_${Date.now()}@example.com`,
      password: 'testpass123',
      password2: 'testpass123',
      first_name: 'Bypass',
      last_name: 'Test',
      user_type: 'worker'
    };

    try {
      // Direct axios call without the offline wrapper
      const { default: axios } = await import('axios');
      
      const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });

      const response = await api.post('users/', testUserData);
      setTestResult(`✅ Direct axios registration successful! User ID: ${response.data.id}`);
      
    } catch (error: any) {
      let errorMessage = 'Unknown error';
      
      if (error.response) {
        errorMessage = `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage = `Network error: ${error.message}`;
      } else {
        errorMessage = error.message;
      }
      
      setTestResult(`❌ Direct axios registration failed: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Network Status Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-semibold">Navigator Online:</h3>
              <p className={`text-lg ${onlineStatus ? 'text-green-600' : 'text-red-600'}`}>
                {onlineStatus === null ? 'Checking...' : onlineStatus ? '✅ Online' : '❌ Offline'}
              </p>
            </div>
            
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-semibold">API Reachable:</h3>
              <p className={`text-lg ${apiReachable ? 'text-green-600' : 'text-red-600'}`}>
                {apiReachable === null ? 'Checking...' : apiReachable ? '✅ Reachable' : '❌ Not Reachable'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={testRegistrationBypass}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Test Registration (Bypass Offline Wrapper)
            </button>
            
            {testResult && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Test Result:</h3>
                <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Environment Info:</h3>
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Connection:</strong> {(navigator as any).connection?.effectiveType || 'Unknown'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
