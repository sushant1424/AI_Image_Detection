import React from 'react';

const variants = {
  success: 'bg-success/10 text-success border-success/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  neutral: 'bg-surface-light text-text-secondary border-border',
};

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const badgeStyle = 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border';
  const variantStyle = variants[variant] || variants.neutral;

  return (
    <span className={`${badgeStyle} ${variantStyle} ${className}`}>
      {variant !== 'neutral' && (
        <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-success' : 'bg-danger'}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
