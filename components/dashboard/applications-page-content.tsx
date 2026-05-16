"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { useApplications } from "@/lib/hooks/use-applications";
import Link from "next/link";
import { ArrowLeft, FileText, Briefcase } from "lucide-react";

const STATUS_CONFIG = {
  pending:  { label: "Pending",  color: "bg-white/10 text-white/50",      dot: "bg-white/30" },
  reviewed: { label: "Reviewed", color: "bg-blue-500/15 text-blue-400",    dot: "bg-blue-400" },
  accepted: { label: "Accepted", color: "bg-[#e8ff47]/15 text-[#e8ff47]", dot: "bg-[#e8ff47]" },
  rejected: { label: "Rejected", color: "bg-red-500/15 text-red-400",      dot: "bg-red-400" },
} as const;

export function ApplicationsPageContent() {
  const { requireAuth } = useAuth();
  const { applications, loading } = useApplications();

  useEffect(() => { requireAuth(); }, [requireAuth]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight font-display">My Applications</h1>
              <p className="text-white/30 text-sm">
                {applications.length} application{applications.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-white/20" />
              </div>
              <p className="text-white font-semibold mb-2">No applications yet</p>
              <p className="text-white/30 text-sm mb-6">Start applying to jobs to track them here</p>
              <Link
                href="/jobs"
                className="px-6 py-3 bg-[#e8ff47] text-[#0a0a0f] font-bold text-sm rounded-xl hover:bg-[#d4eb3a] transition-all"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const config = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
                return (
                  <div
                    key={app.application_id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-white/30" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {(app as unknown as { job_details?: { title?: string } }).job_details?.title
                              ?? `Application #${app.application_id.slice(0, 8)}`}
                          </p>
                          <p className="text-white/30 text-xs mt-0.5">
                            Applied {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                          {app.cover_letter && (
                            <p className="text-white/30 text-xs mt-2 line-clamp-1 max-w-xs">
                              {app.cover_letter}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full shrink-0 ${config.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        {config.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}