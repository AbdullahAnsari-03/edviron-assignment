import React, { useState } from 'react';
import { paymentsAPI } from '../services/api';
import Navbar from '../components/Navbar';

interface PaymentFormData {
  school_id: string;
  amount: string;
  trustee_id: string;
  student_info: {
    name: string;
    id: string;
    email: string;
  };
  gateway_name: string;
}

const CreatePayment: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    school_id: '65b0e6293e9f76a9694d84b4', // Pre-filled with default
    amount: '',
    trustee_id: '65b0e552dd319550a9b41c5ba', // Pre-filled with default
    student_info: {
      name: '',
      id: '',
      email: ''
    },
    gateway_name: 'Default Gateway'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('student_')) {
      const studentField = name.replace('student_', '') as keyof typeof formData.student_info;
      setFormData(prev => ({
        ...prev,
        student_info: {
          ...prev.student_info,
          [studentField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const response = await paymentsAPI.createPayment(formData);
      setSuccess(response.data);
      
      // Reset form
      setFormData({
        school_id: '65b0e6293e9f76a9694d84b4',
        amount: '',
        trustee_id: '65b0e552dd319550a9b41c5ba',
        student_info: {
          name: '',
          id: '',
          email: ''
        },
        gateway_name: 'Default Gateway'
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentLink = () => {
    if (success?.collect_request_url) {
      window.open(success.collect_request_url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Create New Payment</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* School Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    School ID
                  </label>
                  <input
                    type="text"
                    name="school_id"
                    value={formData.school_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trustee ID
                  </label>
                  <input
                    type="text"
                    name="trustee_id"
                    value={formData.trustee_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (INR)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gateway Name
                  </label>
                  <select
                    name="gateway_name"
                    value={formData.gateway_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="Default Gateway">Default Gateway</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="Razorpay">Razorpay</option>
                  </select>
                </div>
              </div>

              {/* Student Information */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Student Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Student Name
                    </label>
                    <input
                      type="text"
                      name="student_name"
                      value={formData.student_info.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="student_id"
                      value={formData.student_info.id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student Email
                  </label>
                  <input
                    type="email"
                    name="student_email"
                    value={formData.student_info.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {loading ? 'Creating Payment...' : 'Create Payment'}
                </button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-100 rounded">
                <h3 className="font-semibold mb-2">Payment Created Successfully!</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Order ID:</strong> {success.collect_request_id}</p>
                  <p><strong>Payment URL:</strong> 
                    <button
                      onClick={openPaymentLink}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Open Payment Page
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;