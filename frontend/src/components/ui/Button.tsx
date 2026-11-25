import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none min-h-[44px] min-w-[44px]';

  const variantStyles = {
    primary: 'bg-brand-700 text-white hover:bg-brand-900 focus:ring-brand-500 disabled:bg-ink-100 disabled:text-ink-500 shadow-sm active:bg-brand-900',
    secondary: 'bg-brand-100 text-brand-900 hover:bg-brand-100/80 focus:ring-brand-500 disabled:bg-ink-100 disabled:text-ink-500 active:bg-brand-100/60',
    danger: 'bg-danger-700 text-white hover:bg-danger-700/90 focus:ring-danger-700 disabled:bg-ink-100 disabled:text-ink-500 shadow-sm active:bg-danger-700/80',
    ghost: 'bg-transparent text-ink-900 hover:bg-ink-100/60 focus:ring-brand-500 disabled:text-ink-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : leftIcon ? (
        <span className="mr-2 inline-flex items-center">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon ? (
        <span className="ml-2 inline-flex items-center">{rightIcon}</span>
      ) : null}
    </button>
  );
};
