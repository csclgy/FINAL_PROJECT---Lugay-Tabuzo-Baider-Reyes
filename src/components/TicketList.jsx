import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TicketList = () => {
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  
  const statusOptions = ['All', 'New', 'InProgress', 'OnHold', 'Resolved', 'Closed'];
  const severityOptions = ['All', 'Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const endpoint = user?.role === 'Admin' || user?.role === 'Support' 
          ? '/api/tickets' 
          : `/api/tickets/user/${user.id}`;
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }
        
        const data = await response.json();
        setTickets(data);
        setFilteredTickets(data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Could not load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [authToken, user]);

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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tickets</h2>
        <button
          onClick={() => navigate('/tickets/create')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Ticket
        </button>
      </div>
      
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