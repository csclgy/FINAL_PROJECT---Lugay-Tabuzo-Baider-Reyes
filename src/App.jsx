import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard from './pages/dashboard/Dashboard';
import TicketList from './pages/tickets/TicketList';
import TicketDetails from './pages/tickets/TicketDetails';
import CreateTicketForm from './pages/tickets/CreateTicketForm';
import UserProfile from './pages/profile/UserProfile';

import UsersManagement from './pages/admin/UsersManagement';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const RoleBasedRoute = ({ roles, children }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/tickets/create" element={<CreateTicketForm />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />
            <Route path="/profile" element={<UserProfile />} />
            
            <Route path="/users" element={
              <RoleBasedRoute roles={['Admin']}>
                <UsersManagement />
              </RoleBasedRoute>
            } />
            
            <Route path="/reports" element={
              <RoleBasedRoute roles={['Admin', 'Supervisor']}>
                <Reports />
              </RoleBasedRoute>
            } />
            
            <Route path="/settings" element={
              <RoleBasedRoute roles={['Admin']}>
                <Settings />
              </RoleBasedRoute>
            } />
          </Route>
          
          <Route path="*" element={
            localStorage.getItem('token') 
              ? <Navigate to="/dashboard" /> 
              : <Navigate to="/login" />
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;