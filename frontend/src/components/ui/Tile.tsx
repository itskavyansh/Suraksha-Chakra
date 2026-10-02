import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface TileProps {
  icon: LucideIcon;
  label: string;
  to: string;
  bgColor?: string;
  iconColor?: string;
  prominent?: boolean;
}

const Tile: React.FC<TileProps> = ({
  icon: Icon,
  label,
  to,
  bgColor = 'bg-brand-100',
  iconColor = 'text-brand-700',
  prominent = false,
}) => {
  return (
    <Link
      to={to}
      className={`
        flex flex-col items-center justify-center gap-3 p-4 rounded-2xl
        transition-all duration-150 active:scale-95 focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[100px]
        ${bgColor}
        ${prominent
          ? 'border-2 border-brand-700 shadow-md col-span-2 min-h-[120px]'
          : 'shadow-card'
        }
      `}
      aria-label={label}
    >
      <div
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${prominent ? 'w-14 h-14 bg-brand-700 bg-opacity-10' : 'bg-white bg-opacity-60'}
        `}
      >
        <Icon
          className={`${iconColor} ${prominent ? 'w-7 h-7' : 'w-6 h-6'}`}
          aria-hidden="true"
        />
      </div>
      <span
        className={`
          font-semibold text-center leading-tight
          ${prominent ? 'text-brand-900 text-base' : 'text-ink-900 text-sm'}
        `}
      >
        {label}
      </span>
    </Link>
  );
};

export default Tile;
