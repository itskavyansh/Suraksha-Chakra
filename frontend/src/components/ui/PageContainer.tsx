import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <main
      className={`flex-1 px-4 pt-4 pb-6 ${className}`}
      role="main"
    >
      {children}
    </main>
  );
};

export default PageContainer;
