import React from 'react';
import Button from './Button';

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-2xl bg-surface/30 min-h-[300px] ${className}`}>
      {icon && (
        <div className="text-text-secondary mb-4 p-4 bg-surface-light rounded-full border border-border">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
