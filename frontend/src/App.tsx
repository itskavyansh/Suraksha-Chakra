import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ErrorBoundary>
  );
};
