import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import TicketList from './components/TicketList';
import TicketDetails from './components/TicketDetails';
import CreateTicketForm from './components/CreateTicketForm';
import UserProfile from './components/UserProfile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin/Support Only Route wrapper component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user || (user.role !== 'Admin' && user.role !== 'Support')) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to="/login" />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          
          {/* Dashboard Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tickets" element={<TicketList />} />
            <Route path="tickets/create" element={<CreateTicketForm />} />
            <Route path="tickets/:ticketId" element={<TicketDetails />} />
            <Route path="profile" element={<UserProfile />} />
            
            {/* Admin Only Routes */}
            <Route path="admin/*" element={
              <AdminRoute>
                <Navigate to="/dashboard" />
              </AdminRoute>
            } />
          </Route>
          
          <Route path="*" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;