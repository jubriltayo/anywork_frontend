"use client";

import type { Notification } from "@/lib/types/api";
import { useNotifications } from "@/lib/contexts/notification-context";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleMarkAsRead = () => {
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }
  };

  const handleDelete = () => {
    deleteNotification(notification.notification_id);
  };

  return (
    <div
      className={`card p-4 cursor-pointer transition ${
        !notification.is_read ? "bg-primary/5 border-primary/20" : ""
      }`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={`text-sm ${
              !notification.is_read ? "font-medium" : "text-muted-foreground"
            }`}
          >
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatRelativeTime(notification.created_at)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="ml-2 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
