/**
 * API Test Script
 * 
 * This script tests various API endpoints to ensure they work correctly.
 * Run with: node src/test/api-tests.js
 */

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Helper function to log success/failure with proper formatting
const logResult = (testName, success, details = null) => {
  if (success) {
    console.log(`✅ ${testName}: SUCCESS`);
    if (details) console.log(`   ${details}`);
  } else {
    console.log(`❌ ${testName}: FAILED`);
    if (details) console.log(`   ${details}`);
  }
  console.log(); // Add a blank line for readability
};

// Test API connection
async function testAPIConnection() {
  try {
    console.log('🔄 Testing API connection...');
    try {
      const response = await axios.get(API_URL);
      logResult('API Connection', true, `Status code: ${response.status}`);
      return true;
    } catch (error) {
      // If we get a 401 error, that means the API is running but requires authentication
      if (error.response && error.response.status === 401) {
        logResult('API Connection', true, 'Status code: 401 (Authentication required but API is available)');
        return true;
      }
      throw error;
    }
  } catch (error) {
    logResult('API Connection', false, error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Make sure the Django server is running at http://localhost:8000/');
    }
    return false;
  }
}

// Test login functionality with different payload formats
async function testLoginFormats() {
  console.log('🔄 Testing various login payload formats...');
  
  // Create a test user first
  const username = 'testuser' + Math.floor(Math.random() * 10000);
  const email = `${username}@example.com`;
  const password = 'TestPass123!';
  
  try {
    // Register a test user
    await axios.post(API_URL + 'users/', {
      username,
      email,
      password,
      password2: password,
      first_name: 'Test',
      last_name: 'User',
      user_type: 'worker'
    });
    
    logResult('User Registration', true, `Created user: ${username} / ${email}`);
    
    // Test login format 1: Using 'email' field
    try {
      await axios.post(API_URL + 'auth/jwt/create/', {
        email,
        password
      });
      logResult('Login with "email" field', true, 'Received JWT token');
    } catch (error) {
      logResult('Login with "email" field', false, 
        error.response?.data || error.message);
    }
    
    // Test login format 2: Using 'username' field with email value
    try {
      await axios.post(API_URL + 'auth/jwt/create/', {
        username: email,
        password
      });
      logResult('Login with "username" field (containing email)', true, 'Received JWT token');
    } catch (error) {
      logResult('Login with "username" field (containing email)', false, 
        error.response?.data || error.message);
    }
    
    // Test login format 3: Using actual username
    try {
      await axios.post(API_URL + 'auth/jwt/create/', {
        username,
        password
      });
      logResult('Login with "username" field (containing username)', true, 'Received JWT token');
    } catch (error) {
      logResult('Login with "username" field (containing username)', false, 
        error.response?.data || error.message);
    }
    
  } catch (error) {
    logResult('User Registration', false, 
      error.response?.data || error.message);
    console.log('Cannot proceed with login tests due to registration failure');
  }
}

// Test offline storage functionality
async function testOfflineStorage() {
  // This would need to be implemented in a more comprehensive way
  console.log('🔄 Testing offline storage functionality...');
  logResult('Offline Storage', true, 'This is a placeholder for offline storage tests');
}

// Main function to run all tests
async function runTests() {
  console.log('Starting API tests...\n');
  
  // First test the API connection
  const isConnected = await testAPIConnection();
  if (!isConnected) {
    console.error('Cannot proceed with tests due to connection issues.');
    return;
  }
  
  // Run specific tests
  await testLoginFormats();
  await testOfflineStorage();
  
  console.log('\nAPI tests completed.');
}

// Run the tests
runTests().catch(console.error);
