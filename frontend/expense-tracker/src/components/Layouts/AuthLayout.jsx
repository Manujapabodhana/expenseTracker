import React from 'react'
// import Card_2 from '../../assest/Card_2.png'; // Commented out until image is available

const AuthLayout = ({children}) => {
  return (
    <div className="flex">
      {/* Left Side - Form Content - Keep Original Layout */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Expense Tracker</h2>
        {children}
      </div>

      {/* Right Side - Only Image/Visual Improvements */}
      <div className="hidden md:block w-[40vw] h-screen bg-violet-50 relative overflow-hidden p-8">
        {/* Better positioned decorative elements */}
        <div className="w-32 h-32 rounded-[40px] bg-purple-600 absolute top-12 left-8"></div>
        <div className="w-28 h-40 rounded-[40px] border-[15px] border-fuchsia-600 absolute top-[25%] right-8"></div>
        <div className="w-32 h-32 rounded-[40px] bg-violet-500 absolute bottom-32 left-8"></div>

        {/* Main Card Image - Centered and Fully Visible */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[300px] h-[180px] bg-white rounded-xl shadow-2xl shadow-purple-500/20 flex items-center justify-center border border-purple-100">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Credit Card</h3>
              <p className="text-xs text-gray-500 mt-1">****  ****  ****  1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
