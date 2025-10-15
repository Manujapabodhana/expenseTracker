import React from 'react';
import DashboardLayout from '../../components/Layouts/DashboardLayout';

const Home = () => {
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <p className="text-gray-600">Welcome to your expense tracker dashboard!</p>
      </div>
    </DashboardLayout>
  );
};

export default Home;
