import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from './LoadingStates';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <Spinner />;
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to auth page, saving the intended destination
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authentication is not required and user is authenticated
  // (e.g., redirect authenticated users away from auth page)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and can access the protected route
  return <>{children}</>;
};

// Convenience component for public routes that should redirect authenticated users
export const PublicRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);

// Component for admin-only routes (you can extend this based on user roles)
export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  // Check if user is authenticated and has admin role
  // You can customize this logic based on your user roles system
  const isAdmin = user?.user_metadata?.role === 'admin' || 
                  user?.app_metadata?.role === 'admin';

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
