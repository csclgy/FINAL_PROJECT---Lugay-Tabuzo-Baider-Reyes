import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#ef4444'
};

const TicketsBySeverity = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No data available
      </div>
    );
  }
  
  const formattedData = data.map(item => ({
    ...item,
    color: COLORS[item.name] || '#3b82f6'
  }));
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip
            formatter={(value) => [`${value} tickets`, 'Count']}
            contentStyle={{ borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="value" nameKey="name">
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketsBySeverity;