import { Metadata } from "next";
import { NotificationsContent } from "@/components/notifications/notifications-content";

export const metadata: Metadata = {
  title: "Notifications - AnyWork",
  description: "View your notifications",
};

export default function NotificationsPage() {
  return <NotificationsContent />;
}
