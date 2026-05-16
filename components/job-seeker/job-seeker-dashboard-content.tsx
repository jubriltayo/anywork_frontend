"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import type { Application } from "@/lib/types/api";
import Link from "next/link";
import {
  Briefcase, FileText, Clock, CheckCircle,
  XCircle, ChevronRight, ArrowRight, Search,
} from "lucide-react";

const STATUS_CONFIG = {
  pending:  { label: "Pending",  color: "bg-white/10 text-white/50",      dot: "bg-white/30" },
  reviewed: { label: "Reviewed", color: "bg-blue-500/15 text-blue-400",    dot: "bg-blue-400" },
  accepted: { label: "Accepted", color: "bg-[#e8ff47]/15 text-[#e8ff47]", dot: "bg-[#e8ff47]" },
  rejected: { label: "Rejected", color: "bg-red-500/15 text-red-400",      dot: "bg-red-400" },
} as const;

export function JobSeekerDashboardContent() {
  const { requireAuth, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!requireAuth() || !user) return;
    try {
      const res = await JobSeekerService.getApplications();
      setApplications(res.results);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [requireAuth, user]);

  useEffect(() => { loadData(); }, [loadData]);

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

  const counts = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const recent = applications.slice(0, 6);

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-white/40 text-sm mb-1">Welcome back</p>
          <h1 className="text-2xl font-black text-white tracking-tight font-display">
            {user?.email}
          </h1>
        </div>
        <Link
          href="/jobs"
          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-[#e8ff47] text-[#0a0a0f] font-bold text-sm rounded-xl hover:bg-[#d4eb3a] transition-all"
        >
          <Search className="w-4 h-4" />
          Browse Jobs
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Applied", value: counts.total, icon: FileText, accent: false },
          { label: "Pending", value: counts.pending, icon: Clock, accent: false },
          { label: "Accepted", value: counts.accepted, icon: CheckCircle, accent: counts.accepted > 0 },
          { label: "Rejected", value: counts.rejected, icon: XCircle, accent: false },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className={`rounded-2xl border p-6 ${
              accent
                ? "bg-[#e8ff47]/5 border-[#e8ff47]/20"
                : "bg-white/[0.03] border-white/10"
            }`}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 bg-white/5">
              <Icon className={`w-4 h-4 ${accent ? "text-[#e8ff47]" : "text-white/30"}`} />
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

        {/* Recent applications — 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-white/40" />
              <h2 className="text-white font-bold">Recent Applications</h2>
            </div>
            <Link
              href="/dashboard/applications"
              className="flex items-center gap-1 text-[#e8ff47] text-xs font-semibold hover:underline"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-white/40 text-sm mb-4">No applications yet</p>
              <Link
                href="/jobs"
                className="px-5 py-2.5 bg-[#e8ff47] text-[#0a0a0f] font-bold text-sm rounded-xl hover:bg-[#d4eb3a] transition-all"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recent.map((app) => {
                const config = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
                return (
                  <div key={app.application_id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">
                        {(app as unknown as { job_details?: { title?: string } }).job_details?.title
                          ?? `Application #${app.application_id.slice(0, 8)}`}
                      </p>
                      <p className="text-white/30 text-xs mt-0.5">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${config.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right col */}
        <div className="space-y-6">

          {/* Quick links */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10">
              <h2 className="text-white font-bold">Quick Links</h2>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: "Browse Jobs", href: "/jobs", icon: Briefcase },
                { label: "My Applications", href: "/dashboard/applications", icon: FileText },
                { label: "Edit Profile", href: "/dashboard/job-seeker/profile", icon: FileText },
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

          {/* Tips card */}
          <div className="rounded-2xl border border-[#e8ff47]/15 bg-[#e8ff47]/5 p-6">
            <p className="text-[#e8ff47] text-xs font-bold uppercase tracking-widest mb-3">Pro Tip</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Upload multiple resumes tailored to different roles. Our system will detect duplicates so you only keep what&apos;s relevant.
            </p>
            <Link
              href="/dashboard/job-seeker/profile"
              className="inline-flex items-center gap-1.5 text-[#e8ff47] text-xs font-semibold mt-4 hover:underline"
            >
              Manage resumes <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}