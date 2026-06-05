import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatDate } from 'src/utils';
import Card from '../common/Card';

export const ActivityChart = ({ data = [] }) => {
  // Format the dates for X-Axis display
  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: formatDate(d.date).split(',')[0], // just date part
  }));

  return (
    <Card className="flex flex-col gap-4 bg-surface/30 p-6 h-[320px] md:col-span-2">
      <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
        Scanning Activity Over Time
      </h3>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-text-secondary">
          No scanning activity recorded
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                dataKey="formattedDate"
                stroke="var(--color-text-secondary)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-text-secondary)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Scans"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default ActivityChart;
