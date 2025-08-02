/**
 * Development API Test Component
 * Use this to test API connectivity and data flow
 * Remove in production
 */

'use client';

import { useState } from 'react';
import { 
  ProjectsAPI, 
  TasksAPI, 
  SafetyAPI, 
  DashboardAPI,
  UsersAPI,
  apiClient 
} from '@/lib/api/services';

interface TestResult {
  name: string;
  data: unknown;
}

export default function APITestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testEndpoint = async (name: string, testFn: () => Promise<unknown>) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log(`Testing ${name}...`);
      const result = await testFn();
      setResults({ name, data: result });
      console.log(`${name} success:`, result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`${name} failed: ${errorMsg}`);
      console.error(`${name} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const testConnectivity = async () => {
    await testEndpoint('API Connectivity', async () => {
      // Test basic connectivity
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return { status: 'Connected', url: process.env.NEXT_PUBLIC_API_URL };
    });
  };

  const testProjects = async () => {
    await testEndpoint('Projects API', async () => {
      return await ProjectsAPI.getAll({ limit: 5 });
    });
  };

  const testMyProjects = async () => {
    await testEndpoint('My Projects API', async () => {
      return await ProjectsAPI.getMyProjects();
    });
  };

  const testTasks = async () => {
    await testEndpoint('Tasks API', async () => {
      return await TasksAPI.getAll({ limit: 5 });
    });
  };

  const testMyTasks = async () => {
    await testEndpoint('My Tasks API', async () => {
      return await TasksAPI.getMyTasks();
    });
  };

  const testSafety = async () => {
    await testEndpoint('Safety API', async () => {
      return await SafetyAPI.getAll({ limit: 5 });
    });
  };

  const testDashboard = async () => {
    await testEndpoint('Dashboard API', async () => {
      return await DashboardAPI.getDashboardData();
    });
  };

  const testCurrentUser = async () => {
    await testEndpoint('Current User API', async () => {
      return await UsersAPI.getCurrentUser();
    });
  };

  const checkAuth = () => {
    const isAuth = apiClient.isAuthenticated();
    setResults({ 
      name: 'Authentication Check', 
      data: { 
        isAuthenticated: isAuth,
        hasToken: !!localStorage.getItem('auth_token') || !!sessionStorage.getItem('auth_token')
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">API Connectivity Test</h1>
        
        <div className="text-sm text-gray-600 mb-6">
          <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={testConnectivity}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Test Connectivity
          </button>
          
          <button
            onClick={checkAuth}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            Check Auth
          </button>

          <button
            onClick={testProjects}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Test Projects
          </button>

          <button
            onClick={testMyProjects}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            My Projects
          </button>

          <button
            onClick={testTasks}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Test Tasks
          </button>

          <button
            onClick={testMyTasks}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            My Tasks
          </button>

          <button
            onClick={testSafety}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Test Safety
          </button>

          <button
            onClick={testCurrentUser}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Current User
          </button>

          <button
            onClick={testDashboard}
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 col-span-2"
          >
            Test Dashboard
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Testing...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-gray-800 font-medium mb-2">{results.name} Results</h3>
            <pre className="text-sm text-gray-600 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(results.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-yellow-800 font-medium">Notes</h3>
        <ul className="text-yellow-700 text-sm mt-2 list-disc list-inside space-y-1">
          <li>Make sure the Django backend is running on localhost:8000</li>
          <li>Some endpoints require authentication - login first if needed</li>
          <li>Check the browser console for detailed error messages</li>
          <li>This page is for development only - remove in production</li>
        </ul>
      </div>
    </div>
  );
}
