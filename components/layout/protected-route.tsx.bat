"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/lib/contexts/auth-context";
import { LoadingState } from "@/components/shared/loading-state";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, requireAuth } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      requireAuth();
    }
  }, [isAuthenticated, isLoading, requireAuth]);

  if (isLoading) {
    return fallback || <LoadingState isLoading={true} />;
  }

  if (!isAuthenticated) {
    return fallback || <div>Redirecting...</div>;
  }

  return <>{children}</>;
}
