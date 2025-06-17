'use client';

import { useState } from 'react';

export default function TestRegistrationPage() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testDirectAPI = async () => {
    setIsLoading(true);
    setResult('Testing direct API...');
    
    const testUserData = {
      username: `test_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'testpass123',
      password2: 'testpass123',
      first_name: 'Test',
      last_name: 'User',
      user_type: 'worker',
      organization: 'Test Company',
      position: 'Tester',
      phone_number: '+1234567890'
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
        setResult(`❌ Registration failed: ${response.status} - ${errorText}`);
        return;
      }

      const userData = await response.json();
      setResult(`✅ Registration successful! User ID: ${userData.id}, Username: ${userData.username}`);
      
    } catch (error) {
      setResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testWithAuthContext = async () => {
    setIsLoading(true);
    setResult('Testing with AuthContext...');
    
    // Import the useAuth hook dynamically
    try {
      const { useAuth } = await import('@/context/AuthContext');
      // This won't work directly since we need to be inside the AuthProvider
      setResult('❌ Cannot test AuthContext directly outside of provider');
    } catch (error) {
      setResult(`❌ AuthContext import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Registration Testing</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Registration</h2>
            <div className="space-x-4">
              <button
                onClick={testDirectAPI}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Testing...' : 'Test Direct API'}
              </button>
              
              <button
                onClick={testWithAuthContext}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                Test AuthContext
              </button>
            </div>
          </div>
          
          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Environment:</h3>
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
            <p><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
