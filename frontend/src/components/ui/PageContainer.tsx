import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  hasBottomNav = true,
}) => {
  return (
    <main
      className={`flex-1 w-full p-4 overflow-y-auto ${
        hasBottomNav ? 'pb-24' : 'pb-8'
      } ${className}`}
    >
      {children}
    </main>
  );
};
