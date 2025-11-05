import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareExpenseBarChartData, prepareExpenseLineChartData, prepareExpenseByCategoryData } from "../../utils/helper";

const ExpenseOverview = ({transactions, onExpenseIncome}) => {
  const [dateChartData, setDateChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    const dateData = prepareExpenseBarChartData(transactions);
    const categoryData = prepareExpenseByCategoryData(transactions);
    const lineData = prepareExpenseLineChartData(transactions);
    
    setDateChartData(dateData);
    setCategoryChartData(categoryData);
    setLineChartData(lineData);
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Expense Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your spending trends over time and gain insights into where your money goes.
          </p>
        </div>

        <button className="add-btn" onClick={onExpenseIncome}>
          <LuPlus className="text-lg" />
          Add Expense
        </button>
      </div>

      {dateChartData.length > 0 && (
        <div className="mt-10">
          <h6 className="text-sm font-medium text-gray-700 mb-4">Expense by Date</h6>
          <CustomBarChart data={dateChartData} />
        </div>
      )}

      {lineChartData.length > 0 && (
        <div className="mt-10">
          <h6 className="text-sm font-medium text-gray-700 mb-4">Expense Trend Over Time</h6>
          <CustomLineChart data={lineChartData} />
        </div>
      )}

      {categoryChartData.length > 0 && categoryChartData.length > 1 && (
        <div className="mt-10">
          <h6 className="text-sm font-medium text-gray-700 mb-4">Expense by Category</h6>
          <CustomBarChart data={categoryChartData} />
        </div>
      )}

      {transactions.length === 0 && (
        <div className="mt-10 text-center py-12">
          <div className="text-6xl mb-4"></div>
          <p className="text-gray-500 mb-2">No expense data yet</p>
          <p className="text-xs text-gray-400">Add your first expense to see charts</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseOverview;
