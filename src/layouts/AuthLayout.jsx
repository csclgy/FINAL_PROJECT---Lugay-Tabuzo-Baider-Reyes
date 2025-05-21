import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated()) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900">Helpdesk App</h1>
            <p className="mt-2 text-sm text-gray-600">
              Your support ticket management solution
            </p>
          </div>
          <Outlet />
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-700">
          <div className="flex h-full items-center justify-center p-10">
            <div className="max-w-2xl text-white">
              <h2 className="text-4xl font-bold mb-6">Streamline your support operations</h2>
              <p className="text-xl">
                Effortlessly manage support tickets, collaborate with your team, and deliver
                exceptional customer service with our comprehensive helpdesk platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;