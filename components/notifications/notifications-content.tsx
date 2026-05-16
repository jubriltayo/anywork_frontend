"use client";

import { Navbar } from "@/components/layout/navbar";
import { useNotifications } from "@/lib/contexts/notification-context";
import { ArrowLeft, Bell, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";

function relativeTime(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationsContent() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight font-display">Notifications</h1>
                <p className="text-white/30 text-sm">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm font-medium transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Bell className="w-7 h-7 text-white/20" />
              </div>
              <p className="text-white/40 text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.notification_id}
                  onClick={() => !n.is_read && markAsRead(n.notification_id)}
                  className={`group flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all cursor-pointer ${
                    !n.is_read
                      ? "border-[#e8ff47]/20 bg-[#e8ff47]/[0.03] hover:bg-[#e8ff47]/[0.05]"
                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Dot */}
                  <div className="mt-1.5 shrink-0">
                    {!n.is_read ? (
                      <div className="w-2 h-2 rounded-full bg-[#e8ff47]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${!n.is_read ? "text-white" : "text-white/50"}`}>
                      {n.message}
                    </p>
                    <p className="text-white/25 text-xs mt-1">{relativeTime(n.created_at)}</p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.notification_id); }}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/20 hover:text-red-400 hover:border-red-400/30 transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}