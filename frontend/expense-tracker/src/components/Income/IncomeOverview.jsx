
import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData, prepareIncomeLineChartData } from "../../utils/helper";

const IncomeOverview = ({ transactions, onAddIncome }) => {

  const [barChartData, setBarChartData] = useState([])
  const [lineChartData, setLineChartData] = useState([])

  useEffect(() => {
     const barData = prepareIncomeBarChartData(transactions);
     const lineData = prepareIncomeLineChartData(transactions);
     setBarChartData(barData);
     setLineChartData(lineData);
  
      return () => {};
    }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>

        <button className="add-btn" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Add Income
        </button>
      </div>

      <div className="mt-10">
        <h6 className="text-sm font-medium text-gray-700 mb-4">Income by Source</h6>
        <CustomBarChart data={barChartData} />
      </div>

      {lineChartData.length > 0 && (
        <div className="mt-10">
          <h6 className="text-sm font-medium text-gray-700 mb-4">Income Trend</h6>
          <CustomLineChart data={lineChartData} />
        </div>
      )}
    </div>
  );
};

export default IncomeOverview;