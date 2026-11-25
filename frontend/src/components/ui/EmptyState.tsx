import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-ink-100 shadow-sm my-4">
      {icon ? (
        <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 mb-3.5">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-ink-900">
        {title}
      </h3>
      <p className="text-sm text-ink-500 mt-1 max-w-xs">
        {description}
      </p>
      {actionLabel && onAction ? (
        <div className="mt-4">
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
