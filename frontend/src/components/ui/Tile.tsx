import React from 'react';

export interface TileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  tone?: 'brand' | 'danger' | 'purple' | 'orange' | 'info' | 'warn';
  isFullWidth?: boolean;
}

export const Tile: React.FC<TileProps> = ({
  title,
  description,
  icon,
  onClick,
  tone = 'brand',
  isFullWidth = false,
}) => {
  const toneBgStyles = {
    brand: 'bg-brand-100/60 hover:bg-brand-100 text-brand-900 border-brand-500/20',
    danger: 'bg-danger-100/80 hover:bg-danger-100 text-danger-700 border-danger-700/30',
    purple: 'bg-purple-100/60 hover:bg-purple-100 text-purple-600 border-purple-600/20',
    orange: 'bg-orange-100/60 hover:bg-orange-100 text-orange-500 border-orange-500/20',
    info: 'bg-info-100/60 hover:bg-info-100 text-info-600 border-info-600/20',
    warn: 'bg-warn-500/15 hover:bg-warn-500/25 text-amber-900 border-warn-500/20',
  };

  const iconBgStyles = {
    brand: 'bg-brand-500 text-white',
    danger: 'bg-danger-700 text-white',
    purple: 'bg-purple-600 text-white',
    orange: 'bg-orange-500 text-white',
    info: 'bg-info-600 text-white',
    warn: 'bg-warn-500 text-white',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center text-left p-4 rounded-2xl border transition-all duration-150 shadow-sm hover:shadow-card active:scale-[0.99] min-h-[72px] ${
        toneBgStyles[tone]
      } ${isFullWidth ? 'w-full' : 'w-full'}`}
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-3.5 shadow-sm ${iconBgStyles[tone]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm leading-tight text-ink-900 group-hover:text-black">
          {title}
        </h3>
        <p className="text-xs text-ink-500 mt-0.5 line-clamp-1">
          {description}
        </p>
      </div>
    </button>
  );
};
