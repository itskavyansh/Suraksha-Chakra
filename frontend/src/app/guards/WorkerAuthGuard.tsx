import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSessionStore } from '@/store/sessionStore';
import { ROUTES } from '@/app/routes';

export const WorkerAuthGuard: React.FC = () => {
  const user = useSessionStore((state) => state.user);

  if (!user) {
    return <Navigate to={ROUTES.landing} replace />;
  }

  return <Outlet />;
};
