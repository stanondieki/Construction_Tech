// Test registration directly in browser console
// Copy and paste this into the browser console on localhost:3000

async function testRegistrationInBrowser() {
    console.log('Testing registration directly in browser...');
    
    const testUserData = {
        username: `browser_${Date.now()}`,
        email: `browser_${Date.now()}@example.com`,
        password: 'testpass123',
        password2: 'testpass123',
        first_name: 'Browser',
        last_name: 'Test',
        user_type: 'worker'
    };
    
    try {
        const response = await fetch('http://localhost:8000/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUserData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Registration failed:', errorText);
            return;
        }
        
        const userData = await response.json();
        console.log('Registration successful:', userData);
        
    } catch (error) {
        console.error('Network error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
}

// Also test the axios-based approach
async function testWithAxios() {
    console.log('Testing with axios (if available)...');
    
    if (typeof axios === 'undefined') {
        console.log('Axios not available in browser console');
        return;
    }
    
    const testUserData = {
        username: `axios_${Date.now()}`,
        email: `axios_${Date.now()}@example.com`,
        password: 'testpass123',
        password2: 'testpass123',
        first_name: 'Axios',
        last_name: 'Test',
        user_type: 'worker'
    };
    
    try {
        const response = await axios.post('http://localhost:8000/api/users/', testUserData, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 15000
        });
        
        console.log('Axios registration successful:', response.data);
        
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

console.log('Copy and paste these functions into the browser console:');
console.log('testRegistrationInBrowser()');
console.log('testWithAxios()');
