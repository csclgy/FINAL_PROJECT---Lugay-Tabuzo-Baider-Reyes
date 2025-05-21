import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import StatusBadge from '../tickets/StatusBadge';
import SeverityBadge from '../tickets/SeverityBadge';

const RecentTickets = ({ tickets }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">
        No tickets found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link to={`/tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-900">
                  {ticket.title}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <SeverityBadge severity={ticket.severity} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {ticket.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTickets;