import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import TopBar from '../../components/ui/TopBar';
import BottomNav from '../../components/ui/BottomNav';

const WorkerLayout: React.FC = () => {
  const { user } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    /* Outer: full viewport, neutral bg, centers the "phone" on wide screens */
    <div className="min-h-screen bg-ink-100 flex justify-center items-start">
      {/* Inner: max 430px, looks like a phone on wide screens */}
      <div className="relative w-full max-w-[430px] min-h-screen bg-surface flex flex-col shadow-2xl">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default WorkerLayout;
