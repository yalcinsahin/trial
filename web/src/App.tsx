import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';

// ─── Lazy-loaded Pages ────────────────────────────────────────────────────────

const HomePage = lazy(() => import('@/pages/HomePage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const TrackRidePage = lazy(() => import('@/pages/TrackRidePage'));
const DriversPage = lazy(() => import('@/pages/DriversPage'));
const DriverApplicationPage = lazy(() => import('@/pages/DriverApplicationPage'));
const AgencyPage = lazy(() => import('@/pages/AgencyPage'));
const AgencyApplicationPage = lazy(() => import('@/pages/AgencyApplicationPage'));
const CitiesPage = lazy(() => import('@/pages/CitiesPage'));
const CityPage = lazy(() => import('@/pages/CityPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const DriverDashboardPage = lazy(() => import('@/pages/DriverDashboardPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// ─── Protected Route ──────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'passenger' | 'driver' | 'admin';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isInitialized, profile } = useAuth();

  if (!isInitialized) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    return <Navigate to={`${redirectTo}?redirect=${currentPath}`} replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    // Redirect to appropriate dashboard if role doesn't match
    if (profile?.role === 'admin') return <Navigate to="/admin" replace />;
    if (profile?.role === 'driver') return <Navigate to="/driver-portal" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// ─── App Router ───────────────────────────────────────────────────────────────

const AppRoutes: React.FC = () => (
  <Suspense fallback={<FullPageLoader />}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/book" element={<BookingPage />} />
      <Route path="/track" element={<TrackRidePage />} />
      <Route path="/drivers" element={<DriversPage />} />
      <Route path="/drivers/apply" element={<DriverApplicationPage />} />
      <Route path="/agencies" element={<AgencyPage />} />
      <Route path="/agencies/apply" element={<AgencyApplicationPage />} />
      <Route path="/cities" element={<CitiesPage />} />
      <Route path="/cities/:slug" element={<CityPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected — Passenger */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Protected — Driver */}
      <Route
        path="/driver-portal"
        element={
          <ProtectedRoute requiredRole="driver" redirectTo="/login">
            <DriverDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Protected — Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin" redirectTo="/login">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

// ─── App Root ─────────────────────────────────────────────────────────────────

const App: React.FC = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
