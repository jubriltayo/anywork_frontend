"use client";

import { NotificationList } from "@/components/notifications/notification-list";
import { useNotifications } from "@/lib/contexts/notification-context";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationsContent() {
  const { notifications, unreadCount, markAllAsRead, loading } =
    useNotifications();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container-main">
          <div className="flex items-center gap-4 py-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount !== 1 ? "s" : ""
                      }`
                    : "All caught up!"}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="ml-auto"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-main py-8">
        <NotificationList notifications={notifications} loading={loading} />
      </div>
    </div>
  );
}
