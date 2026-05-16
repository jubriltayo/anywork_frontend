"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useNotifications } from "@/lib/contexts/notification-context";

export function NotificationBadge() {
  const { unreadCount, loading } = useNotifications();

  return (
    <Link
      href="/notifications"
      className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
    >
      {loading ? (
        <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-white/30 animate-spin" />
      ) : (
        <>
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#e8ff47] text-[#0a0a0f] text-[9px] font-black rounded-full flex items-center justify-center border border-[#0a0a0f]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </>
      )}
    </Link>
  );
}