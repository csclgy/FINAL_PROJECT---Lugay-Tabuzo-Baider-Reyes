import React, { useState, useEffect } from 'react';
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

//ADDED DEV MODE TOGGLE
const ProtectedRoute = ({ children }) => {
  const devMode = sessionStorage.getItem('devMode') === 'true';
  if (devMode && process.env.NODE_ENV === 'development') {
    return children;
  }
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const RoleBasedRoute = ({ roles, children }) => {
  const devMode = sessionStorage.getItem('devMode') === 'true';
  if (devMode && process.env.NODE_ENV === 'development') {
    return children;
  }
  
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const DevModeToggle = () => {
  const [devMode, setDevMode] = useState(false);
  
  useEffect(() => {
    const savedDevMode = sessionStorage.getItem('devMode') === 'true';
    setDevMode(savedDevMode);
  }, []);
  
  const toggleDevMode = () => {
    const newDevMode = !devMode;
    setDevMode(newDevMode);
    sessionStorage.setItem('devMode', newDevMode);
    
    if (newDevMode) {
      localStorage.setItem('token', 'dev-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'dev-user',
        name: 'Development User',
        email: 'dev@example.com',
        role: 'Admin'
      }));
    }
  };
  
  //TODO: REMOVE IF DONE WITH PROJECT, FOR DEVELOPMENT PURPOSES
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleDevMode}
        className={`px-3 py-1 rounded text-white text-sm font-medium shadow-lg ${
          devMode ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {devMode ? '🛑 Disable Dev Mode' : '🔓 Enable Dev Mode'}
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DevModeToggle />
        
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
            localStorage.getItem('token') || (process.env.NODE_ENV === 'development' && sessionStorage.getItem('devMode') === 'true')
              ? <Navigate to="/dashboard" /> 
              : <Navigate to="/login" />
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;