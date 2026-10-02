import React from 'react';

type Variant = 'primary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-700 hover:bg-brand-900 text-white shadow-sm active:scale-95',
  danger:
    'bg-danger-700 hover:bg-red-800 text-white shadow-sm active:scale-95',
  ghost:
    'bg-transparent hover:bg-ink-100 text-ink-900 active:scale-95',
  outline:
    'border border-brand-700 text-brand-700 hover:bg-brand-100 active:scale-95',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-2 min-h-[44px]',
  md: 'text-base px-5 py-3 min-h-[44px]',
  lg: 'text-lg px-6 py-4 min-h-[52px]',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        rounded-xl transition-all duration-150 focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
