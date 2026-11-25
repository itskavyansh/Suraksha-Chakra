import React from 'react';
import { useTranslation } from 'react-i18next';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'sample' | 'verified' | 'danger' | 'warning' | 'info' | 'success' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const { t } = useTranslation();

  const variantStyles = {
    sample: 'bg-warn-500/15 text-ink-900 border border-warn-500/30 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full',
    verified: 'bg-brand-100 text-brand-900 border border-brand-500/20 text-xs font-medium px-2.5 py-0.5 rounded-full',
    danger: 'bg-danger-100 text-danger-700 border border-danger-700/20 text-xs font-medium px-2.5 py-0.5 rounded-full',
    warning: 'bg-warn-500/20 text-amber-900 border border-warn-500/30 text-xs font-medium px-2.5 py-0.5 rounded-full',
    info: 'bg-info-100 text-info-600 border border-info-600/20 text-xs font-medium px-2.5 py-0.5 rounded-full',
    success: 'bg-brand-100 text-brand-700 border border-brand-500/20 text-xs font-medium px-2.5 py-0.5 rounded-full',
    neutral: 'bg-ink-100 text-ink-900 text-xs font-medium px-2 py-0.5 rounded-full',
  };

  if (variant === 'sample') {
    return (
      <span className={`${variantStyles.sample} ${className}`} aria-label={t('common.sampleData')}>
        {children || t('common.sampleData')}
      </span>
    );
  }

  return (
    <span className={`${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
