import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

import StatsCard from '../../components/dashboard/StatsCard';
import RecentTickets from '../../components/dashboard/RecentTickets';
import TicketsByStatus from '../../components/dashboard/TicketsByStatus';
import TicketsBySeverity from '../../components/dashboard/TicketsBySeverity';

import { 
  TicketIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    highPriority: 0
  });

  const { data: dashboardData, isLoading, error } = useQuery('dashboardData', async () => {
    try {
      const response = await axios.get('/api/tickets/dashboard');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch dashboard data');
    }
  }, {
    //mock lang to for development purposes
    initialData: {
      stats: {
        total: 27,
        open: 12,
        resolved: 15,
        highPriority: 5
      },
      recentTickets: [
        { id: 1, title: 'Email service is down', status: 'Open', severity: 'High', createdAt: '2025-05-18T10:30:00', department: 'IT' },
        { id: 2, title: 'New user onboarding issue', status: 'In Progress', severity: 'Medium', createdAt: '2025-05-17T14:45:00', department: 'HR' },
        { id: 3, title: 'Office printer not responding', status: 'Open', severity: 'Low', createdAt: '2025-05-16T09:15:00', department: 'Operations' },
        { id: 4, title: 'Website contact form broken', status: 'Resolved', severity: 'Medium', createdAt: '2025-05-15T16:20:00', department: 'Marketing' },
        { id: 5, title: 'Payroll processing error', status: 'Resolved', severity: 'High', createdAt: '2025-05-14T11:05:00', department: 'Finance' },
      ],
      ticketsByStatus: [
        { name: 'Open', value: 8 },
        { name: 'In Progress', value: 4 },
        { name: 'On Hold', value: 3 },
        { name: 'Resolved', value: 12 },
      ],
      ticketsBySeverity: [
        { name: 'Low', value: 7 },
        { name: 'Medium', value: 15 },
        { name: 'High', value: 5 },
      ]
    }
  });

  useEffect(() => {
    if (dashboardData) {
      setStats(dashboardData.stats);
    }
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading dashboard data. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 mb-6">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back, {user?.name || 'User'}. Here's an overview of your helpdesk system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Tickets"
          value={stats.total}
          icon={TicketIcon}
          iconColor="bg-blue-500"
        />
        <StatsCard
          title="Open Tickets"
          value={stats.open}
          icon={ClockIcon}
          iconColor="bg-yellow-500"
        />
        <StatsCard
          title="Resolved Tickets"
          value={stats.resolved}
          icon={CheckCircleIcon}
          iconColor="bg-green-500"
        />
        <StatsCard
          title="High Priority"
          value={stats.highPriority}
          icon={ExclamationCircleIcon}
          iconColor="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT TICKETS */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Tickets</h2>
              <Link to="/tickets" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
            <RecentTickets tickets={dashboardData.recentTickets} />
          </div>
        </div>

        {/* CHARTS */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tickets by Status</h2>
            <TicketsByStatus data={dashboardData.ticketsByStatus} />
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tickets by Severity</h2>
            <TicketsBySeverity data={dashboardData.ticketsBySeverity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;