// Quick test script to check login API
const fetch = require('node:http');

async function testLogin() {
    try {
        console.log('🧪 Testing login API...');
        
        const registerData = JSON.stringify({
            fullName: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        });
        
        const loginData = JSON.stringify({
            email: 'testuser@example.com',
            password: 'password123'
        });
        
        // Simple HTTP request to test
        const http = require('http');
        
        const postRequest = (path, data) => {
            return new Promise((resolve, reject) => {
                const options = {
                    hostname: 'localhost',
                    port: 8000,
                    path: path,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(data)
                    }
                };
                
                const req = http.request(options, (res) => {
                    let responseData = '';
                    res.on('data', (chunk) => {
                        responseData += chunk;
                    });
                    res.on('end', () => {
                        resolve({
                            statusCode: res.statusCode,
                            headers: res.headers,
                            data: responseData
                        });
                    });
                });
                
                req.on('error', (err) => {
                    reject(err);
                });
                
                req.write(data);
                req.end();
            });
        };
        
        // Test register first
        console.log('📝 Testing register...');
        const registerResponse = await postRequest('/api/v1/auth/register', registerData);
        console.log('Register Status:', registerResponse.statusCode);
        console.log('Register Response:', registerResponse.data);
        
        // Test login
        console.log('🔐 Testing login...');
        const loginResponse = await postRequest('/api/v1/auth/login', loginData);
        console.log('Login Status:', loginResponse.statusCode);
        console.log('Login Response:', loginResponse.data);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testLogin();