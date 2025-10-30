"use client";

import type { Notification } from "@/lib/types/api";
import { NotificationItem } from "./notification-item";

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
}

export function NotificationList({
  notifications,
  loading,
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.notification_id}
          notification={notification}
        />
      ))}
    </div>
  );
}
