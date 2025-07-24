/**
 * Authentication Test Script
 * 
 * This script tests the login and registration API endpoints using axios directly.
 * Run with: node src/test/auth-test.js
 */

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Test the API connection
async function testAPIConnection() {
  try {
    console.log('Testing API connection...');
    try {
      const response = await axios.get(API_URL);
      console.log('API connection successful:', response.status);
      return true;
    } catch (error) {
      // If we get a 401 error, that means the API is running but requires authentication
      if (error.response && error.response.status === 401) {
        console.log('API connection successful (401 Unauthorized - API requires authentication)');
        return true;
      }
      throw error; // Re-throw for the outer catch
    }
  } catch (error) {
    console.error('API connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Make sure the Django server is running at http://localhost:8000/');
    }
    return false;
  }
}

async function testLogin(email, password) {
  console.log('Testing login...');
  try {
    // For Djoser with USERNAME_FIELD = 'email', we need to use the field name 'email'
    console.log('Trying with email field...');
    const loginPayload = { email: email, password: password };
    console.log('Login payload:', { ...loginPayload, password: '***' });
    
    const response = await axios.post(API_URL + 'auth/jwt/create/', loginPayload);
    
    console.log('Login Success!');
    console.log('Access Token:', response.data.access);
    return response.data.access;  } catch (error) {
    console.error('Login Failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Network Error Details:', error);
    }
    return null;
  }
}

async function testUserDetails(token) {
  console.log('\nTesting user profile retrieval...');
  try {
    const response = await axios.get(API_URL + 'users/me/', {
      headers: {
        'Authorization': `JWT ${token}`
      }
    });
    
    console.log('User Profile Retrieved Successfully:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Failed to get user details:', error.response?.data || error.message);
  }
}

async function testRegistration(userData) {
  console.log('\nTesting registration...');
  try {
    console.log('Registration payload:', { ...userData, password: '***', password2: '***' });
    
    const response = await axios.post(API_URL + 'users/', userData);
    
    console.log('Registration Success!');
    console.log('New User:', response.data);
    return true;  } catch (error) {
    console.error('Registration Failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      console.error('Error data:', JSON.stringify(error.response.data));
      console.error('Error config:', JSON.stringify(error.response.config));
    } else {
      console.error('Network Error Details:', error);
    }
    return false;
  }
}

async function runTests() {
  // First test the API connection
  const isConnected = await testAPIConnection();
  if (!isConnected) {
    console.error('Cannot proceed with tests due to connection issues.');
    return;
  }

  // Test registration with a new user
  const registrationData = {
    username: 'testuser' + Math.floor(Math.random() * 1000),
    email: `testuser${Math.floor(Math.random() * 1000)}@example.com`,
    password: 'TestPass123!',
    password2: 'TestPass123!',
    first_name: 'Test',
    last_name: 'User',
    user_type: 'worker',
    organization: 'Test Org',
    position: 'Tester'
  };
  
  const registered = await testRegistration(registrationData);
  
  // If registration successful, try logging in with the new account
  if (registered) {
    const token = await testLogin(registrationData.email, registrationData.password);
    
    // If login successful, test retrieving user details
    if (token) {
      await testUserDetails(token);
    }
  }
  
  // Alternatively, you can test logging in with an existing account
  console.log('\nTesting login with existing account...');
  // Replace with a known account in your system
  const existingEmail = 'admin@example.com';
  const existingPassword = 'admin1234';
  
  const existingToken = await testLogin(existingEmail, existingPassword);
  if (existingToken) {
    await testUserDetails(existingToken);
  }
}

runTests().catch(console.error);
