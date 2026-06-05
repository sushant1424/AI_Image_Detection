import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';

export const VerdictPieChart = ({ aiCount = 0, realCount = 0 }) => {
  const data = [
    { name: 'Likely Real', value: realCount, color: '#06b6d4' }, // Primary
    { name: 'AI Generated', value: aiCount, color: '#ef4444' }, // Danger
  ].filter((d) => d.value > 0);

  const total = aiCount + realCount;

  return (
    <Card className="flex flex-col gap-4 bg-surface/30 p-6 h-[320px]">
      <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
        Detection Verdict Distribution
      </h3>

      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-text-secondary">
          No data available
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default VerdictPieChart;
