"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useNotifications } from "@/lib/contexts/notification-context";
import { Bell, Menu, X, LogOut, LayoutDashboard, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/dashboard"
      ? pathname.startsWith("/dashboard")
      : pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#e8ff47] flex items-center justify-center">
            <span className="text-[#0a0a0f] font-black text-sm tracking-tighter">AW</span>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">AnyWork</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/jobs"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              isActive("/jobs")
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <Briefcase className="w-4 h-4" />
            Browse Jobs
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                isActive("/dashboard")
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#e8ff47] text-[#0a0a0f] text-[10px] font-black rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="w-5 h-5 rounded-full bg-[#e8ff47] flex items-center justify-center">
                  <span className="text-[#0a0a0f] text-[10px] font-black">{user?.email?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-white/70 text-sm max-w-32 truncate">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/register" className="px-4 py-2 rounded-lg bg-[#e8ff47] text-[#0a0a0f] text-sm font-bold hover:bg-[#d4eb3a] transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white/70 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0f] px-6 py-4 space-y-1">
          <Link href="/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium" onClick={() => setOpen(false)}>
            <Briefcase className="w-4 h-4" /> Browse Jobs
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium" onClick={() => setOpen(false)}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link href="/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium" onClick={() => setOpen(false)}>
                <Bell className="w-4 h-4" /> Notifications
                {unreadCount > 0 && <span className="ml-auto bg-[#e8ff47] text-[#0a0a0f] text-xs font-black px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
              </Link>
              <button onClick={() => { logout(); setOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium w-full">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="px-4 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium text-center" onClick={() => setOpen(false)}>Log in</Link>
              <Link href="/register" className="px-4 py-2.5 rounded-lg bg-[#e8ff47] text-[#0a0a0f] text-sm font-bold text-center" onClick={() => setOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}