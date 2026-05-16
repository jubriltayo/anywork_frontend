"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { EmployerService } from "@/lib/services/employer";
import { AnalyticsService } from "@/lib/services/analytics";
import type { Employer, Job, Analytics } from "@/lib/types/api";
import Link from "next/link";
import {
  Briefcase, Users, BarChart3, Plus, ArrowRight,
  TrendingUp, Eye, FileText, Building2, ExternalLink,
  ChevronRight,
} from "lucide-react";

export function EmployerDashboardContent() {
  const { requireAuth, user } = useAuth();
  const [profile, setProfile] = useState<Employer | null>(null);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!requireAuth() || !user) return;
    try {
      const [profileRes, analyticsRes, jobsRes] = await Promise.all([
        EmployerService.getProfile(user.user_id),
        AnalyticsService.getAnalytics(),
        EmployerService.getJobs(),
      ]);
      setProfile(profileRes);
      setAnalytics(analyticsRes.results);
      setJobs(jobsRes);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [requireAuth, user]);

  useEffect(() => { loadDashboardData(); }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#e8ff47]/30 border-t-[#e8ff47] animate-spin" />
          <p className="text-white/30 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const totalViews = analytics.reduce((sum, a) => sum + a.views, 0);
  const totalApplications = analytics.reduce((sum, a) => sum + a.applications, 0);
  const activeJobs = jobs.filter((j) => j.is_active).length;
  const conversionRate = totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8">
      {/* Welcome bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Welcome back</p>
          <h1 className="text-2xl font-black text-white tracking-tight font-display">
            {profile?.company_name ?? user?.email ?? "Employer"}
          </h1>
        </div>
        <Link
          href="/dashboard/employer/jobs/new"
          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-[#e8ff47] text-[#0a0a0f] font-bold text-sm rounded-xl hover:bg-[#d4eb3a] transition-all"
        >
          <Plus className="w-4 h-4" />
          Post a Job
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Jobs", value: activeJobs, icon: Briefcase, accent: false },
          { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, accent: false },
          { label: "Applications", value: totalApplications, icon: Users, accent: false },
          { label: "Conversion", value: `${conversionRate}%`, icon: TrendingUp, accent: true },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className={`rounded-2xl border p-6 ${
              accent
                ? "bg-[#e8ff47]/5 border-[#e8ff47]/20"
                : "bg-white/[0.03] border-white/10"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                accent ? "bg-[#e8ff47]/15" : "bg-white/5"
              }`}>
                <Icon className={`w-4 h-4 ${accent ? "text-[#e8ff47]" : "text-white/50"}`} />
              </div>
            </div>
            <p className={`text-3xl font-black font-display ${accent ? "text-[#e8ff47]" : "text-white"}`}>
              {value}
            </p>
            <p className="text-white/40 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent jobs — spans 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-white/40" />
              <h2 className="text-white font-bold">Your Job Postings</h2>
            </div>
            <Link
              href="/dashboard/employer/jobs"
              className="flex items-center gap-1 text-[#e8ff47] text-xs font-semibold hover:underline"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-white/40 text-sm mb-4">No jobs posted yet</p>
              <Link
                href="/dashboard/employer/jobs/new"
                className="px-5 py-2.5 bg-[#e8ff47] text-[#0a0a0f] font-bold text-sm rounded-xl hover:bg-[#d4eb3a] transition-all"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.job_id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-white/30" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{job.title}</p>
                      <p className="text-white/30 text-xs capitalize">{job.job_type?.replace("-", " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      job.is_active
                        ? "bg-[#e8ff47]/10 text-[#e8ff47]"
                        : "bg-white/5 text-white/30"
                    }`}>
                      {job.is_active ? "Active" : "Closed"}
                    </span>
                    <Link
                      href={`/dashboard/employer/jobs/${job.job_id}`}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center transition-all"
                    >
                      <ExternalLink className="w-3 h-3 text-white/60" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Quick actions */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10">
              <h2 className="text-white font-bold">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: "Manage Applications", href: "/dashboard/employer/applications", icon: Users },
                { label: "View Analytics", href: "/dashboard/analytics", icon: BarChart3 },
                { label: "Edit Company Profile", href: "/dashboard/employer/profile", icon: Building2 },
                { label: "Post New Job", href: "/dashboard/employer/jobs/new", icon: Plus },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group text-sm font-medium"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Company card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#e8ff47]/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#e8ff47]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{profile?.company_name ?? "Your Company"}</p>
                <p className="text-white/30 text-xs">Company Profile</p>
              </div>
            </div>

            {profile?.company_description && (
              <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-3">
                {profile.company_description}
              </p>
            )}

            {profile?.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#e8ff47] text-xs font-semibold hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            )}

            {!profile?.company_description && !profile?.website && (
              <Link
                href="/dashboard/employer/profile"
                className="text-[#e8ff47] text-xs font-semibold hover:underline"
              >
                Complete your profile →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Analytics strip */}
      {analytics.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-white/40" />
              <h2 className="text-white font-bold">Recent Analytics</h2>
            </div>
            <Link href="/dashboard/analytics" className="text-[#e8ff47] text-xs font-semibold hover:underline flex items-center gap-1">
              Full report <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Date", "Views", "Applications", "Conversion"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-white/30 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {analytics.slice(0, 5).map((item) => {
                  const conv = item.views > 0 ? ((item.applications / item.views) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={item.analytics_id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-white/60 text-sm">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-white text-sm font-semibold">{item.views}</td>
                      <td className="px-6 py-4 text-white text-sm font-semibold">{item.applications}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${parseFloat(conv) > 5 ? "text-[#e8ff47]" : "text-white/40"}`}>
                          {conv}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}