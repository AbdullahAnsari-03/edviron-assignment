import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../services/api';
import Navbar from '../components/Navbar';

interface TransactionDetails {
  collect_id: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  payment_time?: string;
  payment_mode?: string;
  payment_details?: string;
  bank_reference?: string;
  error_message?: string;
}

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get parameters from URL
  const orderId = searchParams.get('EdvironCollectRequestId') || searchParams.get('collect_request_id');
  const urlStatus = searchParams.get('status');
  const amount = searchParams.get('amount');

  const [sentUpdate, setSentUpdate] = useState(false);


  useEffect(() => {
    if (orderId) {
      fetchTransactionDetails(orderId);
    } else {
      setError('No order ID provided in callback');
      setLoading(false);
    }
  }, [orderId]);

  const fetchTransactionDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getTransactionStatus(id);
      setTransaction(response.data);
    } catch (err: any) {
      setError('Failed to fetch transaction details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const doUpdate = async () => {
    if (!orderId || !urlStatus) return;

    // If DB already matches gateway status, skip
    if (transaction?.status && transaction.status.toUpperCase() === urlStatus.toUpperCase()) {
      setSentUpdate(true);
      return;
    }

    try {
      // Build payload to match the shape your handleCallback expects:
      const order_info = {
        order_id: orderId,
        status: urlStatus,
        transaction_amount: transaction?.transaction_amount ?? (transaction?.order_amount ?? (amount ? Number(amount) : 0)),
        payment_mode: transaction?.payment_mode ?? undefined,
        payment_details: transaction?.payment_details ?? undefined,
        bank_reference: transaction?.bank_reference ?? undefined,
        payment_message: '',
        error_message: transaction?.error_message ?? '',
        payment_time: transaction?.payment_time ?? new Date().toISOString(),
      };

      await paymentsAPI.sendWebhookPayload({ order_info });

      // refresh local view from DB after backend processes it
      await fetchTransactionDetails(orderId);
    } catch (err) {
      console.error('Failed to notify backend webhook', err);
    } finally {
      setSentUpdate(true);
    }
  };

  if (!sentUpdate) doUpdate();
}, [orderId, urlStatus, transaction, amount, sentUpdate]);


  // Use URL status as priority, fallback to transaction status
  const currentStatus = urlStatus || transaction?.status || 'UNKNOWN';

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return (
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'FAILED':
      case 'FAIL':
        return (
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'PENDING':
        return (
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully.',
          color: 'text-green-600 dark:text-green-400'
        };
      case 'FAILED':
      case 'FAIL':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          color: 'text-red-600 dark:text-red-400'
        };
      case 'PENDING':
        return {
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please wait for confirmation.',
          color: 'text-yellow-600 dark:text-yellow-400'
        };
      default:
        return {
          title: 'Payment Status Unknown',
          message: 'Unable to determine payment status.',
          color: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const refreshStatus = async () => {
    if (orderId) {
      await fetchTransactionDetails(orderId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusMessage(currentStatus);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {/* Status Icon */}
            {getStatusIcon(currentStatus)}
            
            {/* Status Message */}
            <div className="text-center mb-8">
              <h1 className={`text-2xl font-bold mb-2 ${statusInfo.color}`}>
                {statusInfo.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {statusInfo.message}
              </p>
              {urlStatus && transaction?.status && urlStatus.toUpperCase() !== transaction.status.toUpperCase() && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  Note: Status shown is from payment gateway. Database may take a few moments to update.
                </p>
              )}
            </div>

            {/* Transaction Details */}
            {(transaction || orderId) && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Transaction Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orderId && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">{orderId}</p>
                    </div>
                  )}
                  
                  {(transaction?.order_amount || amount) && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        ₹{transaction?.order_amount || amount}
                      </p>
                    </div>
                  )}
                  
                  {transaction?.transaction_amount && transaction.transaction_amount !== transaction.order_amount && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Amount</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        ₹{transaction.transaction_amount}
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                    <p className={`text-sm font-semibold ${statusInfo.color}`}>
                      {currentStatus.toUpperCase()}
                    </p>
                    {urlStatus && transaction?.status && urlStatus.toUpperCase() !== transaction.status.toUpperCase() && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Database Status: {transaction.status.toUpperCase()}
                      </p>
                    )}
                  </div>
                  
                  {transaction?.payment_time && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Time</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(transaction.payment_time).toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  {transaction?.payment_mode && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Mode</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {transaction.payment_mode}
                      </p>
                    </div>
                  )}
                  
                  {transaction?.bank_reference && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank Reference</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                        {transaction.bank_reference}
                      </p>
                    </div>
                  )}
                </div>
                
                {transaction?.error_message && transaction.error_message !== 'NA' && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Error Details</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{transaction.error_message}</p>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                View All Transactions
              </button>
              
              <button
                onClick={() => navigate('/create-payment')}
                className="flex-1 bg-gray-600 dark:bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Create New Payment
              </button>
              
              {transaction && (
                <button
                  onClick={refreshStatus}
                  className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Refresh Status
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;