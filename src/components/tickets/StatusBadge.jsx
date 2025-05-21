import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyles = () => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getBadgeStyles()}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;