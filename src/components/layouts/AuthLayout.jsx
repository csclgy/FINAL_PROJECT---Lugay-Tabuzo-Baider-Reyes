import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
            <h1 className="text-3xl font-extrabold text-gray-900">Helpdesk Ticketing System</h1>
            <p className="mt-2 text-sm text-gray-600">
              Your support ticket management solution
            </p>
            <p className="mt-2 text-sm text-gray-600">
              A project by Baider, Lugay, Reyes, Tabuzo
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;