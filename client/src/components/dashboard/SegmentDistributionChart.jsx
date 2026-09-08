import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = [
  'var(--accent-primary)',
  'var(--gold)',
  'var(--text-secondary)',
  '#10b981', // emerald
  '#f43f5e', // rose
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
          <p className="text-[13px] font-medium text-[var(--text-primary)]">
            {payload[0].name}: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const SegmentDistributionChart = ({ data }) => {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="h-[300px] w-full">
      {isEmpty ? (
        <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg">
          <p className="text-caption mt-2">No segment data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
              stroke="var(--bg-card)"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SegmentDistributionChart;
