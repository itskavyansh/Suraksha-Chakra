import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import WorkerLayout from './layouts/WorkerLayout';
import AdminLayout from './layouts/AdminLayout';
import ErrorBoundary from '../components/ui/ErrorBoundary';

// Pages
import LandingPage from '../features/auth/LandingPage';
import HomePage from '../features/home/HomePage';
import ScanPage from '../features/scan/ScanPage';
import JobsPage from '../features/jobs/JobsPage';
import TrainingPage from '../features/training/TrainingPage';
import TrainingDetailPage from '../features/training/TrainingDetailPage';
import EarningsPage from '../features/earnings/EarningsPage';
import RecyclersPage from '../features/recyclers/RecyclersPage';
import ProfilePage from '../features/profile/ProfilePage';
import EvalPage from '../features/eval/EvalPage';
import NotFoundPage from '../features/NotFoundPage';

const AdminPage = React.lazy(() => import('../features/admin/AdminPage'));

const router = createBrowserRouter([
  {
    path: '/eval',
    element: (
      <ErrorBoundary>
        <EvalPage />
      </ErrorBoundary>
    ),
  },
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <LandingPage />
      </ErrorBoundary>
    ),
  },
  {
    element: (
      <ErrorBoundary>
        <WorkerLayout />
      </ErrorBoundary>
    ),
    children: [
      { path: '/home', element: <HomePage /> },
      { path: '/scan', element: <ScanPage /> },
      { path: '/jobs', element: <JobsPage /> },
      { path: '/training', element: <TrainingPage /> },
      { path: '/training/:id', element: <TrainingDetailPage /> },
      { path: '/earnings', element: <EarningsPage /> },
      { path: '/recyclers', element: <RecyclersPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  {
    element: (
      <ErrorBoundary>
        <AdminLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: '/admin',
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <span className="w-8 h-8 border-3 border-brand-700 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <AdminPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <ErrorBoundary>
        <NotFoundPage />
      </ErrorBoundary>
    ),
  },
]);

export default router;
