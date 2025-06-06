// Comprehensive Registration Test
// This script tests the complete registration flow

async function testCompleteRegistrationFlow() {
    console.log('=== Starting Complete Registration Flow Test ===');
    
    // Test 1: Direct API Test
    console.log('\n1. Testing Direct API...');
    const testUserData = {
        username: `testuser_${Date.now()}`,
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
        const response = await fetch('http://localhost:8000/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUserData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Direct API registration failed:', errorText);
            return;
        }
        
        const userData = await response.json();
        console.log('✅ Direct API registration successful:', userData.id);
        
    } catch (error) {
        console.error('❌ Direct API network error:', error);
        return;
    }
    
    // Test 2: Login Test
    console.log('\n2. Testing Login...');
    try {
        const loginResponse = await fetch('http://localhost:8000/api/auth/jwt/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testUserData.email,
                password: testUserData.password
            })
        });
        
        if (!loginResponse.ok) {
            const loginError = await loginResponse.text();
            console.error('❌ Login failed:', loginError);
            return;
        }
        
        const tokens = await loginResponse.json();
        console.log('✅ Login successful, token received');
        
        // Test 3: User Profile Test
        console.log('\n3. Testing User Profile Fetch...');
        const profileResponse = await fetch('http://localhost:8000/api/users/me/', {
            headers: {
                'Authorization': `JWT ${tokens.access}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (!profileResponse.ok) {
            const profileError = await profileResponse.text();
            console.error('❌ Profile fetch failed:', profileError);
            return;
        }
        
        const profile = await profileResponse.json();
        console.log('✅ Profile fetch successful:', profile.username);
        
    } catch (error) {
        console.error('❌ Login/Profile network error:', error);
        return;
    }
    
    // Test 4: Frontend API Test (simulating the frontend code)
    console.log('\n4. Testing Frontend API Layer...');
    const frontendTestData = {
        username: `frontend_${Date.now()}`,
        email: `frontend_${Date.now()}@example.com`,
        password: 'testpass123',
        password2: 'testpass123',
        first_name: 'Frontend',
        last_name: 'Test',
        user_type: 'worker'
    };
    
    try {
        // Simulate the frontend API call exactly as it's done in the code
        const frontendResponse = await fetch('http://localhost:8000/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(frontendTestData)
        });
        
        if (!frontendResponse.ok) {
            const frontendError = await frontendResponse.text();
            console.error('❌ Frontend API simulation failed:', frontendError);
            return;
        }
        
        const frontendUserData = await frontendResponse.json();
        console.log('✅ Frontend API simulation successful:', frontendUserData.id);
        
    } catch (error) {
        console.error('❌ Frontend API simulation network error:', error);
        return;
    }
    
    console.log('\n=== All Tests Passed! Registration should work correctly ===');
}

testCompleteRegistrationFlow();
