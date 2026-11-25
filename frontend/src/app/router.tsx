import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { WorkerLayout } from './layouts/WorkerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { WorkerAuthGuard } from './guards/WorkerAuthGuard';
import { GuestGuard } from './guards/GuestGuard';
import { NotFoundPage } from '@/features/notFound/NotFoundPage';

// Real pages
import { LandingPage } from '@/features/landing/LandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { SignupPage } from '@/features/auth/SignupPage';
import { ForgotPinPage } from '@/features/auth/ForgotPinPage';
import { HomePage } from '@/features/home/HomePage';
import { ScanPage } from '@/features/scan/ScanPage';
import { HurtPage, HurtTypePage, HurtLogPage } from '@/features/hurt/HurtPages';
import { PriceCheckPage } from '@/features/priceCheck/PriceCheckPage';
import { GuidePage, GuideCategoryPage } from '@/features/guide/GuidePages';
import { TrainingPage, TrainingDetailPage } from '@/features/training/TrainingPages';
import { JobsPage, EarningsPage, RecyclersPage, ProfilePage } from '@/features/pages/PlaceholderPages';

// Lazy-loaded routes for admin, verify, and eval
const AdminDashboardPage = lazy(() =>
  import('@/features/admin/AdminPages').then((m) => ({ default: m.AdminDashboardPage }))
);
const VerifyPage = lazy(() =>
  import('@/features/admin/AdminPages').then((m) => ({ default: m.VerifyPage }))
);
const EvalPage = lazy(() =>
  import('@/features/admin/AdminPages').then((m) => ({ default: m.EvalPage }))
);

const SuspenseFallback = (
  <div className="flex-1 flex items-center justify-center p-8 text-sm text-ink-500">
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 rounded-full border-2 border-brand-700 border-t-transparent animate-spin" />
      <span>Loading...</span>
    </div>
  </div>
);

// All raw route patterns defined in the router
export const DEFINED_ROUTE_PATTERNS = [
  '/',
  '/login',
  '/signup',
  '/forgot-pin',
  '/home',
  '/scan',
  '/hurt',
  '/hurt/:type',
  '/hurt/log',
  '/price-check',
  '/guide',
  '/guide/:category',
  '/training',
  '/training/:id',
  '/jobs',
  '/earnings',
  '/recyclers',
  '/profile',
  '/admin',
  '/verify/:workerId',
  '/eval',
] as const;

export const routeConfig: RouteObject[] = [
  // Public pages
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      {
        element: <GuestGuard />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
          { path: '/forgot-pin', element: <ForgotPinPage /> },
        ],
      },
    ],
  },
  // Protected Worker Layout
  {
    element: <WorkerAuthGuard />,
    children: [
      {
        element: <WorkerLayout />,
        children: [
          { path: '/home', element: <HomePage /> },
          { path: '/scan', element: <ScanPage /> },
          { path: '/hurt', element: <HurtPage /> },
          { path: '/hurt/:type', element: <HurtTypePage /> },
          { path: '/hurt/log', element: <HurtLogPage /> },
          { path: '/price-check', element: <PriceCheckPage /> },
          { path: '/guide', element: <GuidePage /> },
          { path: '/guide/:category', element: <GuideCategoryPage /> },
          { path: '/training', element: <TrainingPage /> },
          { path: '/training/:id', element: <TrainingDetailPage /> },
          { path: '/jobs', element: <JobsPage /> },
          { path: '/earnings', element: <EarningsPage /> },
          { path: '/recyclers', element: <RecyclersPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  // Admin Layout (Public demo dashboard)
  {
    element: <AdminLayout />,
    children: [
      {
        path: '/admin',
        element: (
          <Suspense fallback={SuspenseFallback}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
    ],
  },
  // Public verify passport page (Outside worker layout, lazy loaded)
  {
    path: '/verify/:workerId',
    element: (
      <Suspense fallback={SuspenseFallback}>
        <VerifyPage />
      </Suspense>
    ),
  },
  // Public eval page
  {
    path: '/eval',
    element: (
      <Suspense fallback={SuspenseFallback}>
        <EvalPage />
      </Suspense>
    ),
  },
  // 404 Fallback
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = typeof window !== 'undefined' && typeof document !== 'undefined'
  ? createBrowserRouter(routeConfig)
  : (null as unknown as ReturnType<typeof createBrowserRouter>);
