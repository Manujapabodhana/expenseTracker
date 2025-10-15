import React from "react";

const DashboardCard = ({ icon, label, value, color = "bg-gray-500" }) => {
  return (
    <div className="flex gap-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 min-h-[120px]">
      <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <h6 className="text-sm text-gray-500 mb-1">{label || "Label"}</h6>
        <span className="text-[22px] font-semibold text-gray-800">${value || "0"}</span>
      </div>
    </div>
  );
};

export default DashboardCard;