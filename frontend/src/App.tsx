import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionStatus from './pages/TransactionStatus';
import SchoolTransactions from './pages/SchoolTransactions';
import CreatePayment from './pages/CreatePayment';
import PaymentCallback from './pages/PaymentCallback';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/transaction-status"
              element={
                <PrivateRoute>
                  <TransactionStatus />
                </PrivateRoute>
              }
            />
            <Route
              path="/school-transactions"
              element={
                <PrivateRoute>
                  <SchoolTransactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-payment"
              element={
                <PrivateRoute>
                  <CreatePayment />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/payment-callback" element={<PaymentCallback />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;