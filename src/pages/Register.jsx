import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserAddIcon } from '@heroicons/react/solid';

const Register = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });
  const [errors, setErrors] = useState({});

  const departments = [
    { id: 'it', name: 'IT' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'finance', name: 'Finance' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'operations', name: 'Operations' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      department: formData.department
    };
    
    await register(userData);
  };

  return (
    <div className="card">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'border-red-300' : ''}`}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'border-red-300' : ''}`}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'border-red-300' : ''}`}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'border-red-300' : ''}`}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="department" className="form-label">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`form-input ${errors.department ? 'border-red-300' : ''}`}
              aria-invalid={errors.department ? 'true' : 'false'}
            >
              <option value="">Select a department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department && <p className="form-error">{errors.department}</p>}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <UserAddIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
            </span>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;