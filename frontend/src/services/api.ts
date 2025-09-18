import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, name: string, school_id: string) =>
    api.post('/auth/register', { email, password, name, school_id }),
};

export const paymentsAPI = {
  getTransactions: (params?: any) =>
    api.get('/payments/transactions', { params }),
    
  getTransactionsBySchool: (schoolId: string) =>
    api.get(`/payments/transactions/school/${schoolId}`),
    
  getTransactionStatus: (orderId: string) =>
    api.get(`/payments/transaction-status/${orderId}`),
    
  createPayment: (paymentData: any) =>
    api.post('/payments/create-payment', paymentData),

    sendWebhookPayload: (payload: any) => api.post('/payments/webhook', payload),

};

export default api;