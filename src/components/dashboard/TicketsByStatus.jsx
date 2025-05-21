import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#6366f1', '#10b981'];

const TicketsByStatus = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center mt-4 gap-2">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center text-xs">
            <div 
              className="w-3 h-3 mr-1 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}: {entry.payload.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            label={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value} tickets`, name]}
            contentStyle={{ borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketsByStatus;