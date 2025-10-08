import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layouts/AuthLayout'
import { validateEmail } from '../../utils/helper'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        // Add your login logic here
       if(!validateEmail(email)){
        setError("Invalid email format");
        return;
       }

       if(!password){
        setError("Password cannot be empty");
        return;
       }

       setError("");
       //login api call

       
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
