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
import axios from 'axios';
import { DownloadIcon, FilterIcon } from 'lucide-react';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month'); // week, month, year
  const [reportType, setReportType] = useState('status'); // status, severity, department, agent
  const [ticketData, setTicketData] = useState([]);
  const [useMockData, setUseMockData] = useState(false);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Mock data for different report types
  const getMockData = (type) => {
    const mockDataMap = {
      status: [
        { name: 'Open', value: 45 },
        { name: 'In Progress', value: 32 },
        { name: 'Resolved', value: 78 },
        { name: 'Closed', value: 156 }
      ],
      severity: [
        { name: 'Low', value: 89 },
        { name: 'Medium', value: 67 },
        { name: 'High', value: 34 },
        { name: 'Critical', value: 12 }
      ],
      department: [
        { name: 'IT Support', value: 78 },
        { name: 'Human Resources', value: 23 },
        { name: 'Finance', value: 45 },
        { name: 'Facilities', value: 34 },
        { name: 'Marketing', value: 19 }
      ],
      agent: [
        { name: 'John Smith', value: 67 },
        { name: 'Sarah Johnson', value: 54 },
        { name: 'Mike Wilson', value: 43 },
        { name: 'Emma Davis', value: 38 },
        { name: 'David Brown', value: 29 }
      ]
    };
    
    return mockDataMap[type] || [];
  };
  
  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);
  
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/reports?type=${reportType}&range=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ensure response data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setTicketData(data);
      setUseMockData(false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      // Use mock data when API fails
      const mockData = getMockData(reportType);
      setTicketData(mockData);
      setUseMockData(true);
      setLoading(false);
    }
  };
  
  const exportCsvReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/reports/export?type=${reportType}&range=${dateRange}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-report-${reportType}-${dateRange}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Using demo data for display.');
    }
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
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
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
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {Array.isArray(ticketData) && ticketData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <button 
          onClick={exportCsvReport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Export CSV
        </button>
      </div>
      
      {useMockData && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
          <p>Using demo data - API connection issues detected</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center">
            <FilterIcon className="w-5 h-5 mr-2 text-gray-500" />
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
              {Array.isArray(ticketData) && ticketData.map((item, index) => {
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
              {Array.isArray(ticketData) && ticketData.length > 0 && (
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