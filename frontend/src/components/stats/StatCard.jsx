import React from 'react';
import Card from '../common/Card';

export const StatCard = ({ title, value, icon, description, className = '' }) => {
  return (
    <Card hoverEffect className={`flex items-center justify-between p-6 ${className}`}>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          {title}
        </span>
        <span className="text-3xl font-extrabold text-text tracking-tight">
          {value}
        </span>
        {description && (
          <span className="text-xs text-text-secondary font-medium">
            {description}
          </span>
        )}
      </div>
      <div className="p-3 bg-surface-light rounded-2xl border border-border text-primary">
        {icon}
      </div>
    </Card>
  );
};

export default StatCard;
