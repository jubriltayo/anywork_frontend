"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { AnalyticsService } from "@/lib/services/analytics";
import type { Analytics } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft, Eye, FileText, TrendingUp, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const { requireAuth } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth()) return;
    (async () => {
      try {
        const res = await AnalyticsService.getAnalytics();
        setAnalytics(res.results);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [requireAuth]);

  const totalViews = analytics.reduce((sum, a) => sum + a.views, 0);
  const totalApps = analytics.reduce((sum, a) => sum + a.applications, 0);
  const convRate = totalViews > 0 ? ((totalApps / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight font-display">Analytics</h1>
              <p className="text-white/30 text-sm">Job performance and candidate engagement</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
                ))}
              </div>
              <div className="h-64 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
            </div>
          ) : (
            <>
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye },
                  { label: "Total Applications", value: totalApps, icon: FileText },
                  { label: "Conversion Rate", value: `${convRate}%`, icon: TrendingUp, accent: true },
                ].map(({ label, value, icon: Icon, accent }) => (
                  <div
                    key={label}
                    className={`rounded-2xl border p-6 ${accent ? "bg-[#e8ff47]/5 border-[#e8ff47]/20" : "bg-white/[0.03] border-white/10"}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                      <Icon className={`w-4 h-4 ${accent ? "text-[#e8ff47]" : "text-white/30"}`} />
                    </div>
                    <p className={`text-3xl font-black font-display ${accent ? "text-[#e8ff47]" : "text-white"}`}>{value}</p>
                    <p className="text-white/40 text-sm mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                  <BarChart3 className="w-4 h-4 text-white/40" />
                  <h2 className="text-white font-bold">Daily Breakdown</h2>
                </div>

                {analytics.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <BarChart3 className="w-10 h-10 text-white/10 mb-3" />
                    <p className="text-white/30 text-sm">No analytics data yet</p>
                    <p className="text-white/20 text-xs mt-1">Data appears once your jobs receive views</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          {["Date", "Views", "Applications", "Conversion"].map((h) => (
                            <th key={h} className="text-left px-6 py-3 text-white/25 text-xs font-semibold uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {analytics.map((item) => {
                          const conv = item.views > 0 ? ((item.applications / item.views) * 100).toFixed(1) : "0.0";
                          return (
                            <tr key={item.analytics_id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 text-white/50 text-sm">{new Date(item.date).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-white text-sm font-semibold">{item.views}</td>
                              <td className="px-6 py-4 text-white text-sm font-semibold">{item.applications}</td>
                              <td className="px-6 py-4">
                                <span className={`text-sm font-bold ${parseFloat(conv) > 5 ? "text-[#e8ff47]" : "text-white/30"}`}>
                                  {conv}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}