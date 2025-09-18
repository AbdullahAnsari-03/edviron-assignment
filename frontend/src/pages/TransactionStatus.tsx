import React, { useState } from 'react';
import { paymentsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const TransactionStatus: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkStatus = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await paymentsAPI.getTransactionStatus(orderId);
      setTransaction(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transaction not found');
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <div className="p-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Check Transaction Status</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />

            <button
              onClick={checkStatus}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Status'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 rounded">
              {error}
            </div>
          )}

          {transaction && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <h3 className="font-semibold mb-2">Transaction Details:</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Order ID:</strong> {transaction.collect_id}</p>
                <p><strong>Amount:</strong> ₹{transaction.order_amount}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      transaction.status === 'SUCCESS'
                        ? 'text-green-600 dark:text-green-200'
                        : transaction.status === 'PENDING'
                        ? 'text-yellow-600 dark:text-yellow-200'
                        : 'text-red-600 dark:text-red-200'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </p>
                {transaction.payment_time && (
                  <p><strong>Payment Time:</strong> {new Date(transaction.payment_time).toLocaleString()}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
