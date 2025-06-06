/**
const API_URL = 'http://localhost:8000/api';* Authentication Flow Test
 * Tests the complete registration -> login -> dashboard redirect flow
 */

const API_URL = 'http://192.168.56.1:8000/api/';

async function testCompleteAuthFlow() {
    console.log('🚀 Testing Complete Authentication Flow...\n');
    
    // Generate unique test data
    const randomId = Math.floor(Math.random() * 100000);
    const testUser = {
        username: `testuser${randomId}`,
        email: `test${randomId}@example.com`,
        password: 'TestPass123!',
        password2: 'TestPass123!',
        first_name: 'Test',
        last_name: 'User',
        user_type: 'worker',
        phone_number: '+1234567890'
    };
    
    try {
        // Step 1: Test Registration
        console.log('📝 Step 1: Testing Registration...');
        const registrationResponse = await fetch(API_URL + 'users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser)
        });
        
        if (!registrationResponse.ok) {
            const errorText = await registrationResponse.text();
            console.error('❌ Registration Failed:', registrationResponse.status, errorText);
            return false;
        }
        
        const newUser = await registrationResponse.json();
        console.log('✅ Registration Success:', {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        });
        
        // Step 2: Test Login
        console.log('\n🔐 Step 2: Testing Login...');
        const loginResponse = await fetch(API_URL + 'auth/jwt/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        
        if (!loginResponse.ok) {
            const errorText = await loginResponse.text();
            console.error('❌ Login Failed:', loginResponse.status, errorText);
            return false;
        }
        
        const tokens = await loginResponse.json();
        console.log('✅ Login Success:', {
            access_token_length: tokens.access ? tokens.access.length : 0,
            refresh_token_length: tokens.refresh ? tokens.refresh.length : 0
        });
        
        // Step 3: Test User Data Retrieval
        console.log('\n👤 Step 3: Testing User Data Retrieval...');
        const userResponse = await fetch(API_URL + 'users/me/', {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${tokens.access}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (!userResponse.ok) {
            const errorText = await userResponse.text();
            console.error('❌ User Data Retrieval Failed:', userResponse.status, errorText);
            return false;
        }
        
        const userData = await userResponse.json();
        console.log('✅ User Data Retrieved:', {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_type: userData.user_type
        });
        
        console.log('\n🎉 Complete Authentication Flow Test PASSED!');
        console.log('\n📋 Summary:');
        console.log('   ✅ Registration: SUCCESS');
        console.log('   ✅ Login: SUCCESS');
        console.log('   ✅ User Data Retrieval: SUCCESS');
        console.log('\n💡 The backend authentication is working correctly.');
        console.log('   If login/registration still redirects issues occur,');
        console.log('   the problem is likely in the frontend AuthContext or routing.');
        
        return true;
        
    } catch (error) {
        console.error('❌ Network Error:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Check if Django server is running on port 8000');
        console.log('   2. Check if Next.js server is running on port 3002');
        console.log('   3. Verify network connectivity between servers');
        return false;
    }
}

// Run the test
testCompleteAuthFlow().then(success => {
    if (success) {
        console.log('\n🚀 Next Steps:');
        console.log('   1. Test registration form at: http://192.168.56.1:3002/register');
        console.log('   2. Test login form at: http://192.168.56.1:3002/login');
        console.log('   3. Verify dashboard redirect after authentication');
    }
    process.exit(success ? 0 : 1);
}).catch(console.error);
