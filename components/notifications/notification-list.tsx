"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/lib/types/api";
import { NotificationService } from "@/lib/services/notification";
import { CheckCircle2, Trash2 } from "lucide-react";

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onNotificationsUpdate: () => void;
}

export function NotificationList({
  notifications,
  loading,
  onNotificationsUpdate,
}: NotificationListProps) {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleMarkAsRead = async (notificationId: string) => {
    setProcessing(notificationId);
    try {
      await NotificationService.markAsRead(notificationId);
      onNotificationsUpdate();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    setProcessing(notificationId);
    try {
      await NotificationService.deleteNotification(notificationId);
      onNotificationsUpdate();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card h-20 bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 text-muted-foreground flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <p className="text-muted">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.notification_id}
          className={`card flex items-start justify-between ${
            !notification.is_read ? "bg-primary/5 border-primary/20" : ""
          }`}
        >
          <div className="flex-1">
            <p className={`${!notification.is_read ? "font-semibold" : ""}`}>
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {!notification.is_read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(notification.notification_id)}
                disabled={processing === notification.notification_id}
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleDeleteNotification(notification.notification_id)
              }
              disabled={processing === notification.notification_id}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
