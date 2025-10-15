import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosinstance';
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from '../../utils/helper';
import DashboardCard from '../../components/cards/DashboardCard';


const Home = () => {

  useUserAuth();

  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

        if (response.data) {
          console.log("Dashboard data received:", response.data);
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Dashboard API Error:", error);
        // Keep default data if API fails
      }
    };

    fetchDashboardData();
  }, []);



  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard
                icon={<IoMdCard />}
                label="Total Balance"
                value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
                color="bg-purple-600"
              />
              <DashboardCard
                icon={<LuWalletMinimal />}
                label="Total Income"
                value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
                color="bg-green-600"
              />
              <DashboardCard
                icon={<LuHandCoins />}
                label="Total Expenses"
                value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
                color="bg-red-600"
              />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
