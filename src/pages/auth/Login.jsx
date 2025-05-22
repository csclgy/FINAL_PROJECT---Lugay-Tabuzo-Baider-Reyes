import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LockClosedIcon } from '@heroicons/react/24/solid';

const Login = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loginMessage, setLoginMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const credentials = {
      email: formData.email,
      password: formData.password
    };
    
    try {
      const result = await login(credentials);
      if (!result?.success) {
        setLoginMessage(result?.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setLoginMessage('An error occurred during login.');
      console.error(error);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'email@gmail.com',
      password: 'password',
      rememberMe: true
    });
  };

  return (
    <div className="card">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input rounded-md ${errors.email ? 'border-red-300' : ''}`}
              placeholder="Email address"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input rounded-md ${errors.password ? 'border-red-300' : ''}`}
              placeholder="Password"
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </div>

        {loginMessage && (
          <div className={`p-3 rounded ${loginMessage.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {loginMessage}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
            </span>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        {/* only shows in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
            <p className="font-medium text-gray-700 mb-2">Development Testing:</p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded mr-2"
            >
              Fill Demo Credentials
            </button>
            <p className="text-xs text-gray-600 mt-2">
              Demo email: email@gmail.com<br />
              Demo password: password
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;