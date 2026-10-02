import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = true }) => {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-card border border-ink-100
        ${padding ? 'p-4' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
