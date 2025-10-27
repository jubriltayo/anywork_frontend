"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/services/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = AuthService.isAuthenticated();

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (!requireAuth && isAuthenticated) {
      router.push("/dashboard");
      return;
    }
  }, [requireAuth, redirectTo, router]);

  // Show loading state or nothing while checking auth
  if (requireAuth && !AuthService.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!requireAuth && AuthService.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
