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
  const isAuthenticated = AuthService.isAuthenticated();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }
    if (!requireAuth && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [requireAuth, isAuthenticated, redirectTo, router]);

  // Blocking states
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#e8ff47]/30 border-t-[#e8ff47] animate-spin" />
          <p className="text-white/30 text-sm">Redirecting…</p>
        </div>
      </div>
    );
  }

  if (!requireAuth && isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#e8ff47]/30 border-t-[#e8ff47] animate-spin" />
          <p className="text-white/30 text-sm">Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}