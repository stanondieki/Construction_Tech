'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SystemStatusPage() {
  const { user, isLoading: authLoading, register } = useAuth();
  const [systemStatus, setSystemStatus] = useState({
    frontend: '❓ Checking...',
    backend: '❓ Checking...',
    database: '❓ Checking...',
    cors: '❓ Checking...',
    online: '❓ Checking...'
  });
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const addTestResult = (result: string) => {
    setTestResults(prev => [`[${new Date().toLocaleTimeString()}] ${result}`, ...prev]);
  };

  const checkSystemStatus = async () => {
    // Check frontend
    setSystemStatus(prev => ({ ...prev, frontend: '✅ Frontend running' }));

    // Check online status
    setSystemStatus(prev => ({ 
      ...prev, 
      online: navigator.onLine ? '✅ Browser reports online' : '❌ Browser reports offline'
    }));

    // Check backend
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/`, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      setSystemStatus(prev => ({ 
        ...prev, 
        backend: response.ok ? '✅ Backend reachable' : `❌ Backend error: ${response.status}`
      }));
    } catch (error) {
      setSystemStatus(prev => ({ 
        ...prev, 
        backend: `❌ Backend unreachable: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }

    // Test CORS
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/`, {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(5000)
      });
      setSystemStatus(prev => ({ 
        ...prev, 
        cors: response.ok ? '✅ CORS configured' : `❌ CORS error: ${response.status}`
      }));
    } catch (error) {
      setSystemStatus(prev => ({ 
        ...prev, 
        cors: `❌ CORS test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }

    // Test database (by trying to get user count)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        const users = await response.json();
        setSystemStatus(prev => ({ 
          ...prev, 
          database: `✅ Database accessible (${Array.isArray(users) ? users.length : 'unknown count'} users)`
        }));
      } else {
        setSystemStatus(prev => ({ 
          ...prev, 
          database: `❌ Database error: ${response.status}`
        }));
      }
    } catch (error) {
      setSystemStatus(prev => ({ 
        ...prev, 
        database: `❌ Database unreachable: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  const testDirectRegistration = async () => {
    addTestResult('Starting direct API registration test...');
    
    const testUserData = {
      username: `direct_${Date.now()}`,
      email: `direct_${Date.now()}@example.com`,
      password: 'testpass123',
      password2: 'testpass123',
      first_name: 'Direct',
      last_name: 'Test',
      user_type: 'worker'
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUserData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        addTestResult(`❌ Direct registration failed: ${response.status} - ${errorText}`);
        return;
      }

      const userData = await response.json();
      addTestResult(`✅ Direct registration successful! User ID: ${userData.id}`);
      
    } catch (error) {
      addTestResult(`❌ Direct registration network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testAuthContextRegistration = async () => {
    if (!register) {
      addTestResult('❌ AuthContext register function not available');
      return;
    }

    setIsRegistering(true);
    addTestResult('Starting AuthContext registration test...');
    
    const testUserData = {
      username: `auth_${Date.now()}`,
      email: `auth_${Date.now()}@example.com`,
      password: 'testpass123',
      password2: 'testpass123',
      first_name: 'Auth',
      last_name: 'Test',
      user_type: 'worker',
      organization: 'Test Org',
      position: 'Tester',
      phone_number: '+1234567890'
    };

    try {
      await register(testUserData);
      addTestResult('✅ AuthContext registration successful!');
    } catch (error: any) {
      let errorMessage = 'Unknown error';
      
      if (error?.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      addTestResult(`❌ AuthContext registration failed: ${errorMessage}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">UjenziIQ System Status Dashboard</h1>
        
        {/* System Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(systemStatus).map(([key, value]) => (
              <div key={key} className="p-3 bg-gray-100 rounded">
                <h3 className="font-semibold capitalize">{key}:</h3>
                <p className="text-sm">{value}</p>
              </div>
            ))}
          </div>
          <button
            onClick={checkSystemStatus}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Status
          </button>
        </div>

        {/* Auth Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Auth Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
            <p><strong>Current User:</strong> {user ? `${user.username} (${user.email})` : 'Not logged in'}</p>
            <p><strong>Register Function:</strong> {register ? 'Available' : 'Not available'}</p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Registration Tests</h2>
          <div className="space-x-4 mb-4">
            <button
              onClick={testDirectRegistration}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Direct API
            </button>
            
            <button
              onClick={testAuthContextRegistration}
              disabled={isRegistering || !register}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {isRegistering ? 'Testing...' : 'Test AuthContext'}
            </button>
            
            <button
              onClick={clearResults}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No test results yet. Run a test to see results.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded text-sm font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
          <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
            <p><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
