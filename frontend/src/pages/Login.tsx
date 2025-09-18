import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full opacity-30 animate-pulse blur-3xl"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-gradient-to-br from-pink-500 to-yellow-400 rounded-full opacity-20 animate-pulse blur-3xl"></div>

      <div className="relative z-10 max-w-md w-full px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-white mb-2">School Payments</h2>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <div className="bg-gray-800 dark:bg-gray-900 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </div>
              </div>
            </div>

            {error && <div className="text-red-400 text-sm text-center">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo credentials below the Sign In button */}
          <div className="mt-4 text-center text-gray-300 text-sm">
            Demo credentials: <br />
            Email: <span className="font-semibold">test@school.com</span> <br />
            Password: <span className="font-semibold">password123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
