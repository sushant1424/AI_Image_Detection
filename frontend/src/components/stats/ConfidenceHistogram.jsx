import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import Card from '../common/Card';

export const ConfidenceHistogram = ({ data = [] }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="flex flex-col gap-4 bg-surface/30 p-6 h-[320px] md:col-span-3">
      <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
        Model Confidence Distribution
      </h3>

      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-text-secondary">
          No distribution data available
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                dataKey="range"
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
                cursor={{ fill: 'var(--color-surface-light)', opacity: 0.15 }}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" name="Images Count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="#06b6d4"
                    fillOpacity={0.4 + (index * 0.12)} // Progressive visual opacity representing confidence strength
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default ConfidenceHistogram;
