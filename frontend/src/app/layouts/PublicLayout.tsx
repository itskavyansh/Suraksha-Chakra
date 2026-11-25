import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100/70 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-surface shadow-phone flex flex-col relative">
        <Outlet />
      </div>
    </div>
  );
};
