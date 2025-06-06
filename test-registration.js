// Test registration functionality
const testRegistration = async () => {
    console.log('Testing registration API...');
    
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
            const errorData = await response.text();
            console.error('Registration failed:', response.status, errorData);
            return;
        }
        
        const userData = await response.json();
        console.log('Registration successful:', userData);
        
        // Test login with the same user
        console.log('Testing login...');
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
            console.error('Login failed:', loginResponse.status, loginError);
            return;
        }
        
        const tokens = await loginResponse.json();
        console.log('Login successful:', tokens);
        
    } catch (error) {
        console.error('Network error:', error);
    }
};

testRegistration();
