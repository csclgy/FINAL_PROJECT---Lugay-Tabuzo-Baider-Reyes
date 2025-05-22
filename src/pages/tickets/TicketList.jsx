import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for development
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

const TicketList = () => {
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useMockData, setUseMockData] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  
  const statusOptions = ['All', 'New', 'InProgress', 'OnHold', 'Resolved', 'Closed'];
  const severityOptions = ['All', 'Low', 'Medium', 'High', 'Critical'];

  const loadMockData = () => {
    console.log('Loading mock ticket data...');
    setLoading(true);
    
    setTimeout(() => {
      let userTickets = mockTickets;
      if (user?.role !== 'Admin' && user?.role !== 'Support') {
        userTickets = mockTickets.filter(ticket => 
          ticket.createdById === user?.id || ticket.createdByName === user?.fullName
        );
      }
      
      setTickets(userTickets);
      setFilteredTickets(userTickets);
      setLoading(false);
      setError('');
    }, 500);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      // Skip API call if already using mock data
      if (useMockData) {
        loadMockData();
        return;
      }

      try {
        const endpoint = user?.role === 'Admin' || user?.role === 'Support' 
          ? '/api/tickets' 
          : `/api/tickets/user/${user.id}`;
        
        console.log('Fetching from endpoint:', endpoint);
        console.log('Auth token:', authToken ? 'Present' : 'Missing');
        console.log('User:', user);
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          const responseText = await response.text();
          console.error('Response text:', responseText);
          
          if (responseText.includes('<!doctype') || responseText.includes('<html')) {
            console.warn('Server returned HTML instead of JSON, switching to mock data');
            setUseMockData(true);
            loadMockData();
            return;
          }
          
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('Expected JSON but got:', contentType);
          console.error('Response body:', responseText);
          console.warn('Switching to mock data due to invalid response format');
          setUseMockData(true);
          loadMockData();
          return;
        }
        
        const data = await response.json();
        console.log('Fetched tickets:', data);
        setTickets(data);
        setFilteredTickets(data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        
        if (err.message.includes('fetch')) {
          setError('Network error: Unable to connect to server. Using demo data.');
        } else if (err.message.includes('JSON')) {
          setError('Server error: Invalid response format. Using demo data.');
        } else if (err.message.includes('HTTP 404')) {
          setError('API endpoint not found. Using demo data.');
        } else if (err.message.includes('HTTP 401')) {
          setError('Authentication failed. Please log in again.');
        } else if (err.message.includes('HTTP 403')) {
          setError('Access denied. You may not have permission to view tickets.');
        } else {
          setError(`Error loading tickets: ${err.message}. Using demo data.`);
        }
        
        setUseMockData(true);
        loadMockData();
        return;
      } finally {
        setLoading(false);
      }
    };
    
    if (user && authToken) {
      fetchTickets();
    } else {
      console.log('Missing user or auth token:', { user: !!user, authToken: !!authToken });
      setError('Authentication required. Please log in.');
      setLoading(false);
    }
  }, [authToken, user, useMockData]);

  useEffect(() => {
    let result = [...tickets];
    
    if (statusFilter !== 'All') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }
    
    if (severityFilter !== 'All') {
      result = result.filter(ticket => ticket.severityLevel === severityFilter);
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(query) || 
        ticket.description.toLowerCase().includes(query) ||
        (ticket.ticketNumber && ticket.ticketNumber.toString().includes(query))
      );
    }
    
    setFilteredTickets(result);
    setCurrentPage(1);
  }, [statusFilter, severityFilter, searchQuery, tickets]);

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'InProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'OnHold':
        return 'bg-orange-100 text-orange-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Tickets</h2>
          {useMockData && (
            <p className="text-sm text-orange-600 mt-1">
              Using demo data - API connection issues detected
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {error && !useMockData && (
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Retry API
            </button>
          )}
          <button
            onClick={() => setUseMockData(!useMockData)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            {useMockData ? 'Try Live Data' : 'Use Demo Data'}
          </button>
          <button
            onClick={() => navigate('/tickets/create')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Ticket
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                Status: {status}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {severityOptions.map(severity => (
              <option key={severity} value={severity}>
                Severity: {severity}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* TICKET COUNT */}
      <div className="mb-4 text-gray-600">
        Showing {currentTickets.length} of {filteredTickets.length} tickets
      </div>
      
      {/* TABLE TICKETS */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Severity</th>
              <th className="py-3 px-6 text-center">Created</th>
              <th className="py-3 px-6 text-center">Department</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {currentTickets.length > 0 ? (
              currentTickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <td className="py-3 px-6 text-left">
                    {ticket.ticketNumber || ticket.id.substring(0, 8)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-xs text-gray-500">
                      {ticket.createdByName ? `By: ${ticket.createdByName}` : ''}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityBadgeClass(ticket.severityLevel)}`}>
                      {ticket.severityLevel}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {ticket.departmentName || 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center">
                  No tickets found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* PAGES */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav>
            <ul className="flex">
              <li>
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Previous
                </button>
              </li>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              
              <li>
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TicketList;