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
import EarningsPage from '../features/earnings/EarningsPage';
import RecyclersPage from '../features/recyclers/RecyclersPage';
import ProfilePage from '../features/profile/ProfilePage';
import AdminPage from '../features/admin/AdminPage';
import NotFoundPage from '../features/NotFoundPage';

const router = createBrowserRouter([
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
    children: [{ path: '/admin', element: <AdminPage /> }],
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
