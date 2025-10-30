"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useNotifications } from "@/lib/contexts/notification-context";

export function NotificationBadge() {
  const { unreadCount, loading } = useNotifications();

  if (loading) {
    return (
      <div className="w-5 h-5 flex items-center justify-center">
        <div className="w-3 h-3 bg-muted rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <Link
      href="/notifications"
      className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent transition"
    >
      <Bell className="w-5 h-5 text-foreground/80" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium border-2 border-background">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
