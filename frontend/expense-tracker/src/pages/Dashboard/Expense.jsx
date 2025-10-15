import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosinstance';
import { checkAuthAndRedirect } from '../../utils/authUtils';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0] // Today's date
  });
  
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check token expiration and redirect if needed
  const checkTokenAndRefresh = () => {
    return checkAuthAndRedirect();
  };

  const fetchExpenses = async () => {
    if (!checkTokenAndRefresh()) return;
    
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data && response.data.status === 'success') {
        setExpenses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      if (error.response?.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkTokenAndRefresh()) return;
    
    setError('');
    setSuccess('');
    
    if (!expenseData.category || !expenseData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        description: expenseData.description,
        date: expenseData.date
      });

      if (response.data && response.data.status === 'success') {
        setSuccess('Expense added successfully!');
        setExpenseData({
          category: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchExpenses(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      
      if (error.response?.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        setError(error.response?.data?.message || 'Failed to add expense. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const loadExpenses = async () => {
      if (!checkTokenAndRefresh()) return;
      
      try {
        const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
        if (response.data && response.data.status === 'success') {
          setExpenses(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    };

    loadExpenses();
  }, []);

  return (
    <DashboardLayout activeMenu="Expenses">
      <div className="my-5 mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Expense Management</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Expense</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={expenseData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select category</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills & Utilities">Bills & Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={expenseData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={expenseData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={expenseData.description}
                onChange={handleInputChange}
                placeholder="Optional description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Expenses List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Expenses</h3>
          
          {expenses.length > 0 ? (
            <div className="space-y-2">
              {expenses.slice(0, 5).map((expense, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-md">
                  <div>
                    <span className="font-medium text-gray-800">{expense.category}</span>
                    {expense.description && (
                      <span className="text-sm text-gray-600 ml-2">- {expense.description}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-600">${expense.amount}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No expenses recorded yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
