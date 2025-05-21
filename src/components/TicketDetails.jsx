import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RemarksList from './RemarksList';
import AddRemarkForm from './AddRemarkForm';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    severityLevel: '',
    departmentId: ''
  });
  
  const statusOptions = ['New', 'InProgress', 'OnHold', 'Resolved', 'Closed'];
  const severityOptions = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await fetch(`/api/tickets/${ticketId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch ticket details');
        }
        
        const data = await response.json();
        setTicket(data);
        setFormData({
          title: data.title,
          description: data.description,
          status: data.status,
          severityLevel: data.severityLevel,
          departmentId: data.departmentId
        });
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        setError('Could not load ticket details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicketDetails();
  }, [ticketId, authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update ticket');
      }
      
      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setEditing(false);
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError(err.message || 'An error occurred while updating the ticket');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !ticket) {
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
        <button 
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!ticket) return null;

  const canEdit = user?.role === 'Admin' || user?.role === 'Support' || user?.id === ticket.createdById;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      {editing ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Edit Ticket</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="severityLevel">
                Severity Level
              </label>
              <select
                id="severityLevel"
                name="severityLevel"
                value={formData.severityLevel}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                {severityOptions.map(severity => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Updating...' : 'Update Ticket'}
              </button>
              
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{ticket.title}</h2>
              <div className="flex space-x-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(ticket.status)}`}>
                  {ticket.status}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityBadgeClass(ticket.severityLevel)}`}>
                  {ticket.severityLevel}
                </span>
              </div>
            </div>
            
            {canEdit && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
              >
                Edit
              </button>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="whitespace-pre-line">{ticket.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Ticket ID</p>
              <p className="font-medium">{ticket.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-medium">{ticket.departmentName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created By</p>
              <p className="font-medium">{ticket.createdByName || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Assigned To</p>
              <p className="font-medium">{ticket.assignedToName || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created Date</p>
              <p className="font-medium">{formatDate(ticket.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium">{formatDate(ticket.updatedAt)}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Remarks & Updates</h3>
            <RemarksList ticketId={ticketId} />
            <AddRemarkForm ticketId={ticketId} />
          </div>
        </>
      )}
    </div>
  );
};

export default TicketDetails;