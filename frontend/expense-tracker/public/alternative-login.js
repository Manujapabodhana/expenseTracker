// Simple alternative login method that bypasses CORS issues
window.alternativeLogin = async function(email, password) {
    try {
        console.log('🔄 Alternative login method starting...');
        
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        return new Promise((resolve, reject) => {
            xhr.addEventListener('readystatechange', function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        const data = JSON.parse(this.responseText);
                        console.log('✅ Alternative login success:', data);
                        
                        // Save to localStorage
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.data));
                        
                        resolve(data);
                    } else {
                        console.log('❌ Alternative login failed:', this.status, this.statusText);
                        reject(new Error(`HTTP ${this.status}: ${this.statusText}`));
                    }
                }
            });
            
            xhr.addEventListener('error', function() {
                console.log('❌ Alternative login network error');
                reject(new Error('Network error'));
            });
            
            xhr.open('POST', 'http://localhost:8000/api/v1/auth/login');
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            const requestBody = JSON.stringify({
                email: email.trim(),
                password: password
            });
            
            console.log('📤 Sending request:', { email: email.trim(), password: '***' });
            xhr.send(requestBody);
        });
        
    } catch (error) {
        console.error('❌ Alternative login error:', error);
        throw error;
    }
};

// Test function
window.testAlternativeLogin = function() {
    alternativeLogin('alexfresh@test.com', 'test123')
        .then(data => {
            console.log('🎉 Test login successful:', data);
            alert('Login successful! Check console for details.');
        })
        .catch(error => {
            console.error('❌ Test login failed:', error);
            alert('Login failed: ' + error.message);
        });
};

console.log('✅ Alternative login methods loaded. Use testAlternativeLogin() to test.');