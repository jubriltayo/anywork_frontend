"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview";
import { AnalyticsService } from "@/lib/services/analytics";
import type { Analytics } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AnalyticsPage() {
  const { requireAuth } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth()) return;
    loadAnalytics();
  }, [requireAuth]);

  const loadAnalytics = async () => {
    try {
      const res = await AnalyticsService.getAnalytics();
      setAnalytics(res.results);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container-main max-w-4xl">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold mb-8">Job Analytics</h1>

          <AnalyticsOverview analytics={analytics} loading={loading} />
        </div>
      </main>
    </>
  );
}
