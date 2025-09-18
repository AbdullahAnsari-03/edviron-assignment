import React, { useState } from 'react';
import { paymentsAPI } from '../services/api';
import Navbar from '../components/Navbar';

interface StudentInfo {
  name: string;
  id: string;
  email: string;
}

interface Transaction {
  _id: string;
  collect_id: string;
  school_id: string;
  gateway?: string;
  order_amount: number;
  transaction_amount?: number;
  status: string;
  student_info: StudentInfo;
  payment_time?: string;
  createdAt?: string;
}

const SchoolTransactions: React.FC = () => {
  const [schoolId, setSchoolId] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const fetchSchoolTransactions = async () => {
    if (!schoolId.trim()) {
      setError('Please enter a school ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await paymentsAPI.getTransactionsBySchool(schoolId);
      setTransactions(response.data);
      if (response.data.length === 0) {
        setError('No transactions found for this school ID');
      }
    } catch (err: any) {
      setError('Failed to fetch transactions for this school');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">School Transactions</h2>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  School ID
                </label>
                <input
                  type="text"
                  placeholder="Enter School ID"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <button
                onClick={fetchSchoolTransactions}
                disabled={loading}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Get Transactions'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 rounded">
              {error}
            </div>
          )}

          {transactions.length > 0 && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wide hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      Gateway
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      Payment Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {transaction.student_info?.name}
                        <br />
                        <span className="text-xs text-gray-400">{transaction.student_info?.email}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {transaction.collect_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {transaction.gateway || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ₹{transaction.order_amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${transaction.status === 'SUCCESS'
                              ? 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100'
                              : transaction.status === 'PENDING'
                                ? 'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100'
                                : 'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100'
                            }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {transaction.payment_time
                          ? new Date(transaction.payment_time).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                          : transaction.createdAt
                            ? new Date(transaction.createdAt).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                            : new Date(parseInt(transaction._id.substring(0, 8), 16) * 1000).toLocaleString(
                              'en-IN',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolTransactions;
