import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layouts/AuthLayout'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'

const SingUp = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // handle signup
    const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (!fullName.trim()) {
            setError("Full name is required");
            return;
        }
        
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        
        if (!password.trim()) {
            setError("Password is required");
            return;
        }
        
        setError("");
        
        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: fullName.trim(),
                    email: email.trim(),
                    password: password,
                    profileImageUrl: profilePhoto || ""
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.status === 'success') {
                // Save token to localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.data));
                
                // Navigate to dashboard
                navigate('/dashboard');
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('Network error. Please check your connection and try again.');
        }
    }

  return (
    <AuthLayout>
        <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-black mb-2">Create an Account</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">
                Please enter your details to create an account
            </p>

            {/* Profile Photo Selector */}
            <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
            
            <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        value={fullName}
                        onChange={({target}) => setFullName(target.value)}
                        placeholder="Enter your full name"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        value={email}
                        onChange={({target}) => setEmail(target.value)}
                        placeholder="Enter your email"
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
                        placeholder="Create a password"
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
                    Create Account
                </button>
            </form>

            <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-purple-600 hover:text-purple-700 font-medium underline"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    </AuthLayout>
  )
}

export default SingUp
