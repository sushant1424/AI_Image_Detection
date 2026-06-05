import React from 'react';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-primary hover:bg-primary-hover text-background font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]',
  secondary: 'bg-surface-light hover:bg-surface border border-border hover:border-text-secondary text-text font-medium hover:scale-[1.02] active:scale-[0.98]',
  danger: 'bg-danger hover:bg-danger/90 text-text font-medium hover:scale-[1.02] active:scale-[0.98]',
  ghost: 'bg-transparent hover:bg-surface-light text-text-secondary hover:text-text font-medium',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-xl',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center gap-2 transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:pointer-events-none';
  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      {...props}
    >
      {isLoading && <Spinner className="w-4 h-4 text-current" />}
      {!isLoading && icon && <span className="inline-flex">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
