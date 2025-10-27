"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { NotificationBadge } from "@/components/notifications/notification-badge";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container-main flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">AnyWork</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/jobs"
            className="text-foreground hover:text-primary transition"
          >
            Browse Jobs
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary transition"
              >
                Dashboard
              </Link>
              <NotificationBadge />
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
