import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Mock data for development/testing
const mockRemarks = [
  {
    id: 1,
    content: "Customer reported that the login issue occurs specifically when using Chrome browser. They've cleared cache and cookies but the problem persists.",
    createdAt: "2024-05-20T10:30:00Z",
    createdByName: "John Smith",
    isInternal: false
  },
  {
    id: 2,
    content: "Internal note: This appears to be related to the Chrome extension conflict we've seen before. Need to check if customer has any ad blockers or security extensions installed.",
    createdAt: "2024-05-20T11:15:00Z",
    createdByName: "Sarah Johnson",
    isInternal: true
  },
  {
    id: 3,
    content: "Update: Customer confirmed they have AdBlock Plus installed. Provided instructions to whitelist our domain. Waiting for customer to test and confirm.",
    createdAt: "2024-05-20T14:22:00Z",
    createdByName: "Mike Wilson",
    isInternal: false
  },
  {
    id: 4,
    content: "Great news! The issue is resolved after whitelisting the domain. Customer can now log in successfully. Marking this as resolved.",
    createdAt: "2024-05-20T16:45:00Z",
    createdByName: "John Smith",
    isInternal: false
  },
  {
    id: 5,
    content: "Internal follow-up: Added this to our FAQ section under common browser issues. Also updated our troubleshooting guide to include checking for browser extensions.",
    createdAt: "2024-05-20T17:10:00Z",
    createdByName: "Sarah Johnson",
    isInternal: true
  }
];

const RemarksList = ({ ticketId, useMockData = false }) => {
  const { authToken } = useAuth();
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRemarks = async () => {
      if (useMockData || process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          setRemarks(mockRemarks);
          setLoading(false);
        }, 1000);
        return;
      }

      try {
        const response = await fetch(`/api/tickets/${ticketId}/remarks`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch remarks');
        }
        
        const data = await response.json();
        setRemarks(data);
      } catch (err) {
        console.error('Error fetching remarks:', err);
        setError('Could not load remarks. Please try again later.');
        
        console.log('Falling back to mock data due to API error');
        setRemarks(mockRemarks);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRemarks();
  }, [ticketId, authToken, useMockData]);

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

  if (loading) {
    return (
      <div className="my-4 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading remarks...</p>
      </div>
    );
  }

  if (error && remarks.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>{error}</p>
      </div>
    );
  }

  if (remarks.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg my-4 text-center">
        <p className="text-gray-600">No remarks yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>API Error: {error}. Showing mock data for development.</p>
        </div>
      )}
      
      {remarks.map((remark) => (
        <div key={remark.id} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-medium">{remark.createdByName || 'Unknown User'}</span>
              <span className="text-gray-500 text-sm ml-2">{formatDate(remark.createdAt)}</span>
            </div>
            
            {remark.isInternal && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                Internal Note
              </span>
            )}
          </div>
          
          <p className="whitespace-pre-line">{remark.content}</p>
        </div>
      ))}
    </div>
  );
};

export default RemarksList;