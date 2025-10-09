import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layouts/AuthLayout'
import { validateEmail } from '../../utils/helper'
import { UserContext } from '../../context/userContext'

// Alternative login method using XMLHttpRequest (bypasses some CORS issues)
const alternativeLogin = async (email, password) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false; // Don't send credentials for CORS
        
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                } catch (e) {
                    reject(new Error('Invalid JSON response'));
                }
            } else {
                reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
        });
        
        xhr.addEventListener('error', function() {
            reject(new Error('Network error - cannot connect to server'));
        });
        
        xhr.open('POST', 'http://localhost:8000/api/v1/auth/login');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ email: email.trim(), password }));
    });
};

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { updateUser } = useContext(UserContext);

    // handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('🔍 LOGIN ATTEMPT STARTED');
        console.log('📧 Email:', email);
        console.log('🔑 Password length:', password.length);
        console.log('🌐 Current URL:', window.location.href);
        console.log('🔗 Target backend:', 'http://localhost:8000/api/v1/auth/login');
        
       if(!validateEmail(email)){
        setError("Invalid email format");
        return;
       }

       if(!password){
        setError("Password cannot be empty");
        return;
       }

       setError("");
       
       try {
           console.log('🚀 Trying fetch request first...');
           
           const response = await fetch('http://localhost:8000/api/v1/auth/login', {
               method: 'POST',
               mode: 'cors',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                   email: email.trim(),
                   password: password
               })
           });
           
           const data = await response.json();
           
           if (response.ok && data.status === 'success') {
               // Save token to localStorage
               localStorage.setItem('token', data.token);
               localStorage.setItem('user', JSON.stringify(data.data));
               
               // Update user context
               updateUser(data.data);
               
               console.log('✅ Fetch login successful, navigating to dashboard');
               navigate('/dashboard');
           } else {
               setError(data.message || 'Login failed. Please check your credentials.');
           }
       } catch (fetchError) {
           console.error('❌ Fetch failed, trying alternative method:', fetchError.message);
           
           try {
               console.log('🔄 Trying alternative XMLHttpRequest method...');
               const data = await alternativeLogin(email, password);
               
               if (data.status === 'success') {
                   // Save token to localStorage
                   localStorage.setItem('token', data.token);
                   localStorage.setItem('user', JSON.stringify(data.data));
                   
                   // Update user context
                   updateUser(data.data);
                   
                   console.log('✅ Alternative login successful, navigating to dashboard');
                   navigate('/dashboard');
               } else {
                   setError(data.message || 'Login failed. Please check your credentials.');
               }
           } catch (altError) {
               console.error('❌ Alternative login also failed:', altError.message);
               setError(`❌ Cannot connect to server: ${altError.message}. Please check if backend is running.`);
           }
       }
    }
       
  return (
    <AuthLayout>
     <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
     <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
     
     <p className="text-xs text-slate-700 mt-[5px] mb-6">
        please enter your details to log in
     </p>

     <form onSubmit={handleLogin} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
                value={email}
                onChange={({target}) => setEmail(target.value)}
                placeholder="rpmanuja123@gmail.com"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
            />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
                value={password}
                onChange={({target}) => setPassword(target.value)}
                placeholder="Enter your password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
            />
        </div>

        {error && (
            <div className="text-red-500 text-sm">{error}</div>
        )}

        <button 
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200 font-medium"
        >
            Sign In
        </button>
     </form>

     <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button 
                onClick={() => navigate('/signup')}
                className="text-purple-600 hover:text-purple-700 font-medium underline"
            >
                Sign up
            </button>
        </p>
     </div>
     </div>
    </AuthLayout>
  )
}

export default Login
