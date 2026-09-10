import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-3 shadow-xl backdrop-blur-md">
        <p className="text-[13px] font-medium text-[var(--text-muted)] mb-1">{label}</p>
        <p className="text-[14px] font-bold text-[var(--brand-primary)]">
          {payload[0].value} Customers
        </p>
      </div>
    );
  }
  return null;
};

const CustomerGrowthChart = ({ data }) => {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="h-[300px] w-full">
      {isEmpty ? (
        <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg">
          <p className="text-caption mt-2">No growth data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="customers" 
              stroke="var(--brand-primary)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCustomers)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CustomerGrowthChart;
