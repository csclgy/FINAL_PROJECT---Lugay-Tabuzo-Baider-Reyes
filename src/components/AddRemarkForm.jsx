import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AddRemarkForm = ({ ticketId }) => {
  const { authToken, user } = useAuth();
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isStaff = user?.role === 'Admin' || user?.role === 'Support';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Remark content cannot be empty.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/tickets/${ticketId}/remarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          content,
          isInternal: isStaff ? isInternal : false
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add remark');
      }
      
      // Clear form and show success message
      setContent('');
      setIsInternal(false);
      setSuccess('Remark added successfully!');
      
      // Reload the page to show the new remark (alternatively, you could update the state in the parent component)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Error adding remark:', err);
      setError(err.message || 'An error occurred while adding the remark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium mb-3">Add a Remark</h4>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            placeholder="Enter your comment or update..."
            required
          />
        </div>
        
        {isStaff && (
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isInternal"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isInternal" className="text-sm text-gray-700">
              Mark as internal note (only visible to staff)
            </label>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Submitting...' : 'Submit Remark'}
        </button>
      </form>
    </div>
  );
};

export default AddRemarkForm;