// ✅ FIXED: Added useContext to the React import
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layouts/AuthLayout'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'
// ✅ ADDED: Import UserContext
import { UserContext } from '../../context/userContext'
// ✅ ADDED: Import uploadImage utility
import { uploadImage } from '../../utils/Uploadimage'


const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");
  
  // ✅ FIXED: Removed duplicate navigate declaration, kept both here together
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();




  // handle signup
  const handleSignUp = async (e) => {
    e.preventDefault();


    // Validation with proper closing braces
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


    // Signup API call using fetch
    try {

        // ✅ ADDED: Declare profileImageUrl variable
        let profileImageUrl = "";

        //upload image if present
        console.log("Profile photo state:", profilePhoto);
        if(profilePhoto) {
            try {
                console.log("Uploading image...", profilePhoto);
                console.log("Image file details:", {
                    name: profilePhoto.name,
                    size: profilePhoto.size,
                    type: profilePhoto.type
                });
                const imgUploadRes = await uploadImage(profilePhoto);
                console.log("Upload response:", imgUploadRes);
                profileImageUrl = imgUploadRes.imageUrl;
            } catch (uploadError) {
                console.error("Image upload failed:", uploadError);
                setError("Failed to upload profile image. Please try again or continue without image.");
                return;
            }
        } else {
            console.log("No profile photo selected, continuing without image");
        }



      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password: password,
          // ✅ FIXED: Changed from profilePhoto to profileImageUrl
          profileImageUrl: profileImageUrl
        })
      });


      const data = await response.json();


      if (response.ok && data.status === 'success') {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        // ✅ ADDED: Update user context with the returned user data
        updateUser(data.data);
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please check your connection and try again.');
    }
  };


  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2">Create an Account</h2>
        <p className="text-gray-600 text-center mb-8">
          Please enter your details to create an account
        </p>


        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Profile Photo Selector */}
          <ProfilePhotoSelector
            image={profilePhoto}
            setImage={setProfilePhoto}
          />


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              placeholder="Enter your full name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Enter your email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Create a password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>


          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}


          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            Create Account
          </button>
        </form>


        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-purple-600 hover:text-purple-700 font-medium underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};


export default SignUp;
