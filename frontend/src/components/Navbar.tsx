import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              to="/dashboard"
              className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Dashboard
            </Link>
            <Link
              to="/school-transactions"
              className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              School Transactions
            </Link>
            <Link
              to="/transaction-status"
              className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Check Status
            </Link>
            <Link
              to="/create-payment"
              className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Create Payment
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;