
import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData, prepareIncomeLineChartData, prepareIncomeBySourceData } from "../../utils/helper";

const IncomeOverview = ({ transactions, onAddIncome }) => {

  const [dateChartData, setDateChartData] = useState([])
  const [sourceChartData, setSourceChartData] = useState([])
  const [lineChartData, setLineChartData] = useState([])

  useEffect(() => {
     // Income by date (for main bar chart)
     const dateData = prepareIncomeBarChartData(transactions);
     // Income by source (for secondary view)
     const sourceData = prepareIncomeBySourceData(transactions);
     // Income trend line chart (by date)
     const lineData = prepareIncomeLineChartData(transactions);
     
     setDateChartData(dateData);
     setSourceChartData(sourceData);
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

      {/* Main Chart - Income by Date */}
      {dateChartData.length > 0 && (
        <div className="mt-10">
          <h6 className="text-sm font-medium text-gray-700 mb-4">Income by Date</h6>
          <CustomBarChart data={dateChartData} />
        </div>
      )}

      {/* Line Chart - Income Trend */}
      {lineChartData.length > 0 && (
        <div className="mt-10">
          <h6 className="text-sm font-medium text-gray-700 mb-4">Income Trend Over Time</h6>
          <CustomLineChart data={lineChartData} />
        </div>
      )}

      {/* Secondary Chart - Income by Source */}
      {sourceChartData.length > 0 && sourceChartData.length > 1 && (
        <div className="mt-10">
          <h6 className="text-sm font-medium text-gray-700 mb-4">Income by Source</h6>
          <CustomBarChart data={sourceChartData} />
        </div>
      )}

      {/* Empty State */}
      {transactions.length === 0 && (
        <div className="mt-10 text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500 mb-2">No income data yet</p>
          <p className="text-xs text-gray-400">Add your first income to see charts</p>
        </div>
      )}
    </div>
  );
};

export default IncomeOverview;