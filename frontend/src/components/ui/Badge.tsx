import React from 'react';

type BadgeVariant = 'brand' | 'danger' | 'warn' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  brand: 'bg-brand-100 text-brand-900',
  danger: 'bg-danger-100 text-danger-700',
  warn: 'bg-orange-100 text-orange-600',
  info: 'bg-info-100 text-info-600',
  neutral: 'bg-ink-100 text-ink-500',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'brand', children, className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
