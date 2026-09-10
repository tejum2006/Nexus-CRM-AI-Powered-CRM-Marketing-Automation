import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-3 shadow-xl backdrop-blur-md">
        <p className="text-[13px] font-medium text-[var(--text-primary)] mb-2 truncate max-w-[200px]">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-[13px] mb-1">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-bold text-[var(--text-primary)]">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CampaignPerformanceChart = ({ data }) => {
  const isEmpty = !data || data.length === 0;

  // Format data for Recharts
  const formattedData = isEmpty ? [] : data.map(campaign => ({
    name: campaign.name,
    Sent: campaign.metrics?.sent || 0,
    Opened: campaign.metrics?.opened || 0,
    Clicked: campaign.metrics?.clicked || 0,
  })).reverse(); // Oldest first left to right

  return (
    <div className="h-[300px] w-full">
      {isEmpty ? (
        <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg">
          <p className="text-caption mt-2">No campaign performance data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              tickFormatter={(val) => val.length > 12 ? val.substring(0, 12) + '...' : val}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-input)', opacity: 0.4 }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
            <Bar dataKey="Sent" fill="var(--text-secondary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Opened" fill="var(--gold)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Clicked" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CampaignPerformanceChart;
