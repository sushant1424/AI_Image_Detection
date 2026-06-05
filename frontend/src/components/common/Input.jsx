import React from 'react';

export const Input = ({
  label,
  error,
  icon,
  type = 'text',
  placeholder = '',
  className = '',
  id,
  required = false,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-text-secondary select-none">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-text-secondary pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          className={`
            input-base
            ${icon ? 'pl-11' : 'pl-4'}
            ${error ? 'border-danger/50 focus:border-danger focus:ring-danger/20' : 'border-border focus:border-primary'}
          `}
          required={required}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-danger font-medium animate-slide-down">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
