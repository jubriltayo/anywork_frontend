import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/contexts/auth-context";
import { NotificationProvider } from "@/lib/contexts/notification-context";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AnyWork — Hire Faster. Search Smarter.",
  description: "The job board built for employers who move fast and candidates who mean business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} font-sans antialiased bg-[#0a0a0f] text-white`}>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}