import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RemarksList = ({ ticketId }) => {
  const { authToken } = useAuth();
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRemarks = async () => {
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchRemarks();
  }, [ticketId, authToken]);

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

  if (error) {
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