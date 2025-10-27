"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { NotificationList } from "./notification-list";
import { useAuth } from "@/lib/hooks/use-auth";
import { NotificationService } from "@/lib/services/notification";
import type { Notification } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationsPageContent() {
  const { requireAuth } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!requireAuth()) return;

    setLoading(true);
    try {
      const res = await NotificationService.getNotifications();
      setNotifications(
        res.results.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAllAsRead = async () => {
    setProcessing(true);
    try {
      await NotificationService.markAllAsRead();
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setProcessing(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container-main max-w-2xl">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={processing}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          <NotificationList
            notifications={notifications}
            loading={loading}
            onNotificationsUpdate={loadNotifications}
          />
        </div>
      </main>
    </>
  );
}
