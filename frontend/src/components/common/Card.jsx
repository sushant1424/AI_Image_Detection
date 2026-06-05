import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border border-border p-6 transition-all duration-300
        ${glass ? 'glass' : 'bg-surface'}
        ${hoverEffect ? 'hover-lift cursor-pointer hover:border-primary/30' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
