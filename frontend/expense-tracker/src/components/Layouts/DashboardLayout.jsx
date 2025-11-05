import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const DashboardLayout = ({ activeMenu, children }) => {

    const { user } = useContext(UserContext);
return (
    <div className="">
      <Navbar activeMenu={activeMenu} />

      {user ? (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">{children}</div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access this page.</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

