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
} from '@heroicons/react/24/outline';

// Mock tickets data - same as TicketList
const mockTickets = [
  {
    id: '1',
    ticketNumber: 'TK-2025-001',
    title: 'Email service is down',
    description: 'Unable to send or receive emails through Outlook',
    status: 'New',
    severityLevel: 'High',
    createdAt: '2025-05-22T08:30:00Z',
    createdById: 'user1',
    createdByName: 'John Smith',
    departmentId: 'dept1',
    departmentName: 'IT Support'
  },
  {
    id: '2',
    ticketNumber: 'TK-2025-002',
    title: 'New user onboarding issue',
    description: 'New employee needs access to company systems',
    status: 'InProgress',
    severityLevel: 'Medium',
    createdAt: '2025-05-21T14:45:00Z',
    createdById: 'user2',
    createdByName: 'Sarah Johnson',
    departmentId: 'dept2',
    departmentName: 'Human Resources'
  },
  {
    id: '3',
    ticketNumber: 'TK-2025-003',
    title: 'Office printer not responding',
    description: 'Canon printer on 3rd floor is showing error codes',
    status: 'OnHold',
    severityLevel: 'Low',
    createdAt: '2025-05-20T09:15:00Z',
    createdById: 'user3',
    createdByName: 'Mike Davis',
    departmentId: 'dept3',
    departmentName: 'Operations'
  },
  {
    id: '4',
    ticketNumber: 'TK-2025-004',
    title: 'Website contact form broken',
    description: 'Contact form submissions are not being received',
    status: 'Resolved',
    severityLevel: 'Medium',
    createdAt: '2025-05-19T16:20:00Z',
    createdById: 'user4',
    createdByName: 'Lisa Chen',
    departmentId: 'dept4',
    departmentName: 'Marketing'
  },
  {
    id: '5',
    ticketNumber: 'TK-2025-005',
    title: 'Payroll processing error',
    description: 'Error in salary calculations for April payroll',
    status: 'Closed',
    severityLevel: 'Critical',
    createdAt: '2025-05-18T11:05:00Z',
    createdById: 'user5',
    createdByName: 'Robert Wilson',
    departmentId: 'dept5',
    departmentName: 'Finance'
  },
  {
    id: '6',
    ticketNumber: 'TK-2025-006',
    title: 'VPN connection issues',
    description: 'Unable to connect to company VPN from home',
    status: 'New',
    severityLevel: 'High',
    createdAt: '2025-05-17T10:30:00Z',
    createdById: 'user6',
    createdByName: 'Emma Brown',
    departmentId: 'dept1',
    departmentName: 'IT Support'
  },
  {
    id: '7',
    ticketNumber: 'TK-2025-007',
    title: 'Software license renewal',
    description: 'Adobe Creative Suite licenses expiring next month',
    status: 'InProgress',
    severityLevel: 'Medium',
    createdAt: '2025-05-16T13:20:00Z',
    createdById: 'user7',
    createdByName: 'David Garcia',
    departmentId: 'dept4',
    departmentName: 'Marketing'
  },
  {
    id: '8',
    ticketNumber: 'TK-2025-008',
    title: 'Database backup failure',
    description: 'Automated backup process failed last night',
    status: 'New',
    severityLevel: 'Critical',
    createdAt: '2025-05-15T07:45:00Z',
    createdById: 'user8',
    createdByName: 'Jennifer Martinez',
    departmentId: 'dept1',
    departmentName: 'IT Support'
  },
  {
    id: '9',
    ticketNumber: 'TK-2025-009',
    title: 'Conference room booking system',
    description: 'Unable to book conference rooms through the portal',
    status: 'OnHold',
    severityLevel: 'Low',
    createdAt: '2025-05-14T15:10:00Z',
    createdById: 'user9',
    createdByName: 'Chris Anderson',
    departmentId: 'dept3',
    departmentName: 'Operations'
  },
  {
    id: '10',
    ticketNumber: 'TK-2025-010',
    title: 'Employee benefits portal access',
    description: 'Cannot log into benefits portal to update information',
    status: 'Resolved',
    severityLevel: 'Medium',
    createdAt: '2025-05-13T12:00:00Z',
    createdById: 'user10',
    createdByName: 'Amy Taylor',
    departmentId: 'dept2',
    departmentName: 'Human Resources'
  },
  {
    id: '11',
    ticketNumber: 'TK-2025-011',
    title: 'Security badge replacement',
    description: 'Lost security badge, need replacement',
    status: 'New',
    severityLevel: 'Low',
    createdAt: '2025-05-12T09:30:00Z',
    createdById: 'user11',
    createdByName: 'Kevin Thompson',
    departmentId: 'dept6',
    departmentName: 'Security'
  },
  {
    id: '12',
    ticketNumber: 'TK-2025-012',
    title: 'Server performance issues',
    description: 'Application server running slow during peak hours',
    status: 'InProgress',
    severityLevel: 'High',
    createdAt: '2025-05-11T16:45:00Z',
    createdById: 'user12',
    createdByName: 'Nicole White',
    departmentId: 'dept1',
    departmentName: 'IT Support'
  }
];

// Function to generate dashboard data from mock tickets
const generateDashboardData = (tickets) => {
  const statusCounts = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {});

  const severityCounts = tickets.reduce((acc, ticket) => {
    acc[ticket.severityLevel] = (acc[ticket.severityLevel] || 0) + 1;
    return acc;
  }, {});

  const openStatuses = ['New', 'InProgress', 'OnHold'];
  const resolvedStatuses = ['Resolved', 'Closed'];
  
  const openCount = openStatuses.reduce((sum, status) => sum + (statusCounts[status] || 0), 0);
  const resolvedCount = resolvedStatuses.reduce((sum, status) => sum + (statusCounts[status] || 0), 0);
  const highPriorityCount = (severityCounts['High'] || 0) + (severityCounts['Critical'] || 0);

  // Format recent tickets (last 5)
  const recentTickets = tickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status === 'InProgress' ? 'In Progress' : ticket.status,
      severity: ticket.severityLevel,
      createdAt: ticket.createdAt,
      department: ticket.departmentName
    }));

  // Format status data for chart
  const ticketsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    name: status === 'InProgress' ? 'In Progress' : status === 'OnHold' ? 'On Hold' : status,
    value: count
  }));

  // Format severity data for chart
  const ticketsBySeverity = Object.entries(severityCounts).map(([severity, count]) => ({
    name: severity,
    value: count
  }));

  return {
    stats: {
      total: tickets.length,
      open: openCount,
      resolved: resolvedCount,
      highPriority: highPriorityCount
    },
    recentTickets,
    ticketsByStatus,
    ticketsBySeverity
  };
};

const Dashboard = () => {
  const { user } = useAuth();
  const [useMockData, setUseMockData] = useState(true);

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', useMockData],
    queryFn: async () => {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return generateDashboardData(mockTickets);
      }
      
      try {
        const response = await axios.get('/api/tickets/dashboard');
        return response.data;
      } catch (error) {
        console.warn('API failed, switching to mock data:', error.message);
        setUseMockData(true);
        return generateDashboardData(mockTickets);
      }
    },
    initialData: generateDashboardData(mockTickets),
    retry: false
  });

  const safeStats = dashboardData?.stats || {
    total: 0,
    open: 0,
    resolved: 0,
    highPriority: 0
  };
  
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Welcome back, {user?.name || 'User'}. Here's an overview of your helpdesk system.
            </p>
            {useMockData && (
              <p className="text-sm text-orange-600 mt-1">
                Using demo data - Switch to live API if available
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setUseMockData(!useMockData)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              {useMockData ? 'Try Live API' : 'Use Demo Data'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Tickets"
          value={safeStats.total}
          icon={TicketIcon}
          iconColor="bg-blue-500"
        />
        <StatsCard
          title="Open Tickets"
          value={safeStats.open}
          icon={ClockIcon}
          iconColor="bg-yellow-500"
        />
        <StatsCard
          title="Resolved Tickets"
          value={safeStats.resolved}
          icon={CheckCircleIcon}
          iconColor="bg-green-500"
        />
        <StatsCard
          title="High Priority"
          value={safeStats.highPriority}
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
            <RecentTickets tickets={dashboardData?.recentTickets || []} />
          </div>
        </div>

        {/* CHARTS */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tickets by Status</h2>
            <TicketsByStatus data={dashboardData?.ticketsByStatus || []} />
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tickets by Severity</h2>
            <TicketsBySeverity data={dashboardData?.ticketsBySeverity || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;