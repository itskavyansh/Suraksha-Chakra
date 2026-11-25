import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from '@/components/ui/TopBar';
import { BottomNav } from '@/components/ui/BottomNav';
import { ROUTES } from '@/app/routes';

export const WorkerLayout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === ROUTES.home;

  return (
    <div className="min-h-screen bg-slate-100/70 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-surface shadow-phone flex flex-col relative">
        <TopBar showBack={!isHome} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};
