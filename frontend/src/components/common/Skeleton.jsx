import React from 'react';

export const Skeleton = ({
  variant = 'text',
  className = '',
  ...props
}) => {
  const baseStyle = 'animate-pulse bg-surface-light border border-border/50';

  const variants = {
    text: 'h-4 w-full rounded-md',
    circle: 'rounded-full aspect-square',
    rect: 'rounded-xl w-full h-32',
  };

  const variantStyle = variants[variant] || variants.text;

  return (
    <div
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
