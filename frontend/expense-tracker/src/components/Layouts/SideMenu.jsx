import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    navigate(route);
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    
    // Clear user-specific data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Clear user context
    clearUser();
    
    console.log('✅ Logout complete, redirecting to login');
    
    // Navigate to login
    navigate("/login", { replace: true });
  };

  // Simple avatar component for displaying user initials
  const SimpleAvatar = ({ fullName }) => {
    const getInitials = (name) => {
      if (!name) return "U";
      const names = name.split(" ");
      const initials = names.map(n => n.charAt(0).toUpperCase());
      return initials.slice(0, 2).join("");
    };

    return (
      <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
        {getInitials(fullName)}
      </div>
    );
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover"
          />
        ) : (
          <SimpleAvatar fullName={user?.fullName} />
        )}

        <h5 className="text-gray-950 font-medium leading-6">
          {user?.fullName || "User"}
        </h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] transition-colors ${
            activeMenu === item.label ? "text-white bg-purple-600" : "text-gray-700 hover:bg-gray-100"
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;