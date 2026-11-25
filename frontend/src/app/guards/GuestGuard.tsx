import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSessionStore } from '@/store/sessionStore';
import { ROUTES } from '@/app/routes';

export const GuestGuard: React.FC = () => {
  const user = useSessionStore((state) => state.user);

  if (user) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <Outlet />;
};
