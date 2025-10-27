import { apiClient } from "@/lib/api/client";
import type {
  PaginatedResponse,
  Notification,
  NotificationFormData,
} from "@/lib/types/api";

export class NotificationService {
  static async getNotifications(): Promise<PaginatedResponse<Notification>> {
    try {
      return await apiClient.get<PaginatedResponse<Notification>>(
        "/notifications/"
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch notifications"
      );
    }
  }

  static async getNotificationById(
    notificationId: string
  ): Promise<Notification> {
    try {
      const notification = await apiClient.get<Notification>(
        `/notifications/${notificationId}/`
      );

      if (notification) {
        return notification;
      }
      throw new Error("Notification not found");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch notification"
      );
    }
  }

  static async createNotification(
    data: NotificationFormData
  ): Promise<Notification> {
    try {
      const notification = await apiClient.post<Notification>(
        "/notifications/",
        data
      );

      if (notification) {
        return notification;
      }
      throw new Error("Failed to create notification");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create notification"
      );
    }
  }

  static async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const notification = await apiClient.patch<Notification>(
        `/notifications/${notificationId}/`,
        { is_read: true }
      );

      if (notification) {
        return notification;
      }
      throw new Error("Failed to mark notification as read");
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read"
      );
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const unreadNotifications = notifications.results.filter(
        (n) => !n.is_read
      );

      await Promise.all(
        unreadNotifications.map((n) => this.markAsRead(n.notification_id))
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications as read"
      );
    }
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${notificationId}/`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete notification"
      );
    }
  }
}
