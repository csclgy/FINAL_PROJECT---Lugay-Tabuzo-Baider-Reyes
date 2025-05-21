import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  TicketIcon, 
  UserIcon, 
  PlusCircleIcon, 
  LogOutIcon,
  SettingsIcon,
  Users,
  BarChart3Icon
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isAdmin = user?.role === 'Admin';
  const isSupervisor = user?.role === 'Supervisor';

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      roles: ['Admin', 'Support', 'Supervisor', 'User']
    },
    {
      name: 'All Tickets',
      path: '/tickets',
      icon: <TicketIcon className="w-5 h-5" />,
      roles: ['Admin', 'Support', 'Supervisor', 'User']
    },
    {
      name: 'Create Ticket',
      path: '/tickets/create',
      icon: <PlusCircleIcon className="w-5 h-5" />,
      roles: ['Admin', 'Support', 'Supervisor', 'User']
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: <UserIcon className="w-5 h-5" />,
      roles: ['Admin', 'Support', 'Supervisor', 'User']
    },
    {
      name: 'Users',
      path: '/users',
      icon: <UserGroupIcon className="w-5 h-5" />,
      roles: ['Admin']
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: <BarChart3Icon className="w-5 h-5" />,
      roles: ['Admin', 'Supervisor']
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <SettingsIcon className="w-5 h-5" />,
      roles: ['Admin']
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="h-full bg-white border-r border-gray-200 w-64 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Helpdesk System</h1>
      </div>
      
      <div className="flex flex-col justify-between flex-1 p-4">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={`mr-3 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm text-red-600 rounded-md hover:bg-red-50"
          >
            <LogOutIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;