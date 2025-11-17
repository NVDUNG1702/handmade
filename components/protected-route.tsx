"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  fallback = null, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth is initialized and we're sure user is not authenticated
    if (initialized && !loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, initialized, router, redirectTo]);

  // Show loading state while checking authentication
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show fallback if not authenticated
  if (!isAuthenticated) {
    return fallback;
  }

  // Render children if authenticated
  return <>{children}</>;
}

// Higher-order component version
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    redirectTo?: string;
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
