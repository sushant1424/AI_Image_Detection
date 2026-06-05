import React from 'react';

export const Spinner = ({ className = 'w-6 h-6', ...props }) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-text-muted border-t-primary ${className}`}
      role="status"
      aria-label="loading"
      {...props}
    />
  );
};

export default Spinner;
