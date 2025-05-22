import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, Filter } from 'lucide-react';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month'); // week, month, year
  const [reportType, setReportType] = useState('status'); // status, severity, department, agent
  const [ticketData, setTicketData] = useState([]);
  const [useMockData, setUseMockData] = useState(true);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  // Mock tickets data
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

  const getMockData = (type) => {
    const countMap = {};
    
    switch (type) {
      case 'status':
        mockTickets.forEach(ticket => {
          const status = ticket.status;
          countMap[status] = (countMap[status] || 0) + 1;
        });
        break;
        
      case 'severity':
        mockTickets.forEach(ticket => {
          const severity = ticket.severityLevel;
          countMap[severity] = (countMap[severity] || 0) + 1;
        });
        break;
        
      case 'department':
        mockTickets.forEach(ticket => {
          const dept = ticket.departmentName;
          countMap[dept] = (countMap[dept] || 0) + 1;
        });
        break;
        
      case 'agent':
        mockTickets.forEach(ticket => {
          const agent = ticket.createdByName;
          countMap[agent] = (countMap[agent] || 0) + 1;
        });
        break;
        
      default:
        return [];
    }
    
    const result = Object.entries(countMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    return result;
  };
  
  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);
  
  const fetchReportData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        //TODO: ADD REAL API CONNECTION
        const mockData = getMockData(reportType);
        setTicketData(mockData);
        setUseMockData(true);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        const mockData = getMockData(reportType);
        setTicketData(mockData);
        setUseMockData(true);
        setLoading(false);
      }
    }, 500);
  };
  
  const exportCsvReport = () => {
    const headers = ['Category', 'Count', 'Percentage'];
    const total = ticketData.reduce((sum, item) => sum + item.value, 0);
    
    const csvContent = [
      headers.join(','),
      ...ticketData.map(item => {
        const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
        return [item.name, item.value, `${percentage}%`].join(',');
      }),
      ['Total', total, '100%'].join(',')
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ticket-report-${reportType}-${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
  
  const getChartTitle = () => {
    const typeLabels = {
      'status': 'Tickets by Status',
      'severity': 'Tickets by Severity Level',
      'department': 'Tickets by Department',
      'agent': 'Tickets by Support Agent'
    };
    
    const rangeLabels = {
      'week': 'Last 7 Days',
      'month': 'Last 30 Days',
      'year': 'Last 12 Months'
    };
    
    return `${typeLabels[reportType]} - ${rangeLabels[dateRange]}`;
  };
  
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={ticketData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
  
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={ticketData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {ticketData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
  
  // Show message if no data
  if (!loading && (!ticketData || ticketData.length === 0)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No data available for the selected filters.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <button 
          onClick={exportCsvReport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Export CSV
        </button>
      </div>
      
      {useMockData && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p>📊 Displaying demo data - {ticketData.length} categories found</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-gray-500" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <div>
            <label className="mr-2 text-sm font-medium">Report Type:</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="status">By Status</option>
              <option value="severity">By Severity</option>
              <option value="department">By Department</option>
              <option value="agent">By Support Agent</option>
            </select>
          </div>
          
          <div>
            <label className="mr-2 text-sm font-medium">Time Range:</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4 text-center">{getChartTitle()}</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-center">Bar Chart</h3>
              {renderBarChart()}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-center">Pie Chart</h3>
              {renderPieChart()}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Data Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {reportType === 'agent' ? 'Agent Name' : 'Category'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ticketData.map((item, index) => {
                const total = ticketData.reduce((sum, current) => sum + current.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
              {ticketData.length > 0 && (
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {ticketData.reduce((sum, item) => sum + item.value, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    100%
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;