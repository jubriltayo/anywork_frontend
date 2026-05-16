"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { EmployerService } from "@/lib/services/employer";
import type { Job, Application } from "@/lib/types/api";
import Link from "next/link";
import {
  ArrowLeft, FileText, Download, Mail, Phone,
  User, Calendar, ChevronDown, Search, Filter,
  CheckCircle, XCircle, Clock, Eye, ExternalLink,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const STATUS_CONFIG = {
  pending:  { label: "Pending",  color: "bg-white/10 text-white/50",           dot: "bg-white/30" },
  reviewed: { label: "Reviewed", color: "bg-blue-500/15 text-blue-400",         dot: "bg-blue-400" },
  accepted: { label: "Accepted", color: "bg-[#e8ff47]/15 text-[#e8ff47]",      dot: "bg-[#e8ff47]" },
  rejected: { label: "Rejected", color: "bg-red-500/15 text-red-400",           dot: "bg-red-400" },
} as const;

export function EmployerApplicationsPageContent() {
  const { requireAuth } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    if (!requireAuth()) return;
    try {
      const jobsData = await EmployerService.getJobs();
      setJobs(jobsData);
      if (jobsData.length > 0) {
        setSelectedJob(jobsData[0].job_id);
        loadApplications(jobsData[0].job_id);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  const loadApplications = async (jobId: string) => {
    setAppsLoading(true);
    try {
      const res = await EmployerService.getApplicationsForJob(jobId);
      setApplications(res.results);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId);
    setExpandedApp(null);
    setSearch("");
    setStatusFilter("all");
    loadApplications(jobId);
  };

  const handleStatusChange = async (appId: string, status: Application["status"]) => {
    setUpdating(appId);
    try {
      await EmployerService.updateApplicationStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => a.application_id === appId ? { ...a, status } : a)
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = applications.filter((app) => {
    const name = app.job_seeker_details?.full_name?.toLowerCase() ?? "";
    const email = app.job_seeker_details?.email?.toLowerCase() ?? "";
    const matchesSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewed: applications.filter((a) => a.status === "reviewed").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const selectedJobData = jobs.find((j) => j.job_id === selectedJob);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#e8ff47]/30 border-t-[#e8ff47] animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight font-display">Applications</h1>
              <p className="text-white/30 text-sm">Review and manage candidate applications</p>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-white/20" />
              </div>
              <p className="text-white font-semibold mb-2">No jobs posted yet</p>
              <p className="text-white/30 text-sm mb-6">Post a job to start receiving applications</p>
              <Link href="/dashboard/employer/jobs/new" className="px-5 py-2.5 bg-[#e8ff47] text-[#0a0a0f] font-bold text-sm rounded-xl">
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[280px_1fr] gap-6">

              {/* Job sidebar */}
              <div className="space-y-2">
                <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-1 mb-3">Your Jobs</p>
                {jobs.map((job) => {
                  const jobApps = applications.filter((a) => a.job === job.job_id);
                  return (
                    <button
                      key={job.job_id}
                      onClick={() => handleJobSelect(job.job_id)}
                      className={`w-full text-left px-4 py-4 rounded-xl border transition-all ${
                        selectedJob === job.job_id
                          ? "border-[#e8ff47]/30 bg-[#e8ff47]/5"
                          : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm font-semibold leading-snug ${selectedJob === job.job_id ? "text-white" : "text-white/60"}`}>
                          {job.title}
                        </p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          selectedJob === job.job_id ? "bg-[#e8ff47]/20 text-[#e8ff47]" : "bg-white/5 text-white/30"
                        }`}>
                          {selectedJob === job.job_id ? counts.total : "—"}
                        </span>
                      </div>
                      <p className={`text-xs capitalize ${selectedJob === job.job_id ? "text-white/40" : "text-white/20"}`}>
                        {job.job_type?.replace("-", " ")} · {job.is_active ? "Active" : "Closed"}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Main panel */}
              <div>
                {/* Job title + stats */}
                {selectedJobData && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-5">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <h2 className="text-white font-bold text-lg">{selectedJobData.title}</h2>
                        <p className="text-white/30 text-sm capitalize">{selectedJobData.job_type?.replace("-", " ")}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        selectedJobData.is_active ? "bg-[#e8ff47]/10 text-[#e8ff47]" : "bg-white/5 text-white/30"
                      }`}>
                        {selectedJobData.is_active ? "Active" : "Closed"}
                      </span>
                    </div>

                    {/* Status counts */}
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        { key: "all", label: "All", value: counts.total },
                        { key: "pending", label: "Pending", value: counts.pending },
                        { key: "reviewed", label: "Reviewed", value: counts.reviewed },
                        { key: "accepted", label: "Accepted", value: counts.accepted },
                        { key: "rejected", label: "Rejected", value: counts.rejected },
                      ].map(({ key, label, value }) => (
                        <button
                          key={key}
                          onClick={() => setStatusFilter(key)}
                          className={`rounded-xl px-3 py-3 text-center transition-all ${
                            statusFilter === key
                              ? "bg-white/10 border border-white/20"
                              : "bg-white/[0.03] border border-white/5 hover:bg-white/[0.05]"
                          }`}
                        >
                          <p className={`text-xl font-black font-display ${statusFilter === key ? "text-white" : "text-white/40"}`}>{value}</p>
                          <p className={`text-xs mt-0.5 ${statusFilter === key ? "text-white/60" : "text-white/20"}`}>{label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search candidates by name or email…"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>

                {/* Applications list */}
                {appsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-6 h-6 rounded-full border-2 border-[#e8ff47]/30 border-t-[#e8ff47] animate-spin" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
                    <FileText className="w-10 h-10 text-white/10 mb-3" />
                    <p className="text-white/40 text-sm">
                      {applications.length === 0 ? "No applications yet" : "No results match your filters"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((app) => {
                      const details = app.job_seeker_details;
                      const resume = app.resume_details;
                      const config = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
                      const isExpanded = expandedApp === app.application_id;
                      const isUpdating = updating === app.application_id;

                      return (
                        <div
                          key={app.application_id}
                          className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all"
                        >
                          {/* Card header */}
                          <button
                            className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
                            onClick={() => setExpandedApp(isExpanded ? null : app.application_id)}
                          >
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                              <span className="text-white/50 text-sm font-bold">
                                {details?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                              </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-white font-semibold text-sm truncate">
                                  {details?.full_name ?? "Unknown Applicant"}
                                </p>
                              </div>
                              <p className="text-white/30 text-xs truncate">{details?.email}</p>
                            </div>

                            {/* Right */}
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-white/20 text-xs hidden sm:block">
                                {formatRelativeTime(app.applied_at)}
                              </span>
                              <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${config.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                                {config.label}
                              </span>
                              <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                            </div>
                          </button>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="border-t border-white/5 px-6 py-5 space-y-5">
                              {/* Contact row */}
                              <div className="flex flex-wrap gap-4 text-sm">
                                {details?.email && (
                                  <a href={`mailto:${details.email}`} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                                    <Mail className="w-3.5 h-3.5" />
                                    {details.email}
                                  </a>
                                )}
                                {details?.phone_number && (
                                  <a href={`tel:${details.phone_number}`} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                                    <Phone className="w-3.5 h-3.5" />
                                    {details.phone_number}
                                  </a>
                                )}
                                <span className="flex items-center gap-2 text-white/30">
                                  <Calendar className="w-3.5 h-3.5" />
                                  Applied {new Date(app.applied_at).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Cover letter */}
                              {app.cover_letter && (
                                <div>
                                  <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-2">Cover Letter</p>
                                  <p className="text-white/60 text-sm leading-relaxed bg-white/[0.03] rounded-xl px-4 py-4 border border-white/5">
                                    {app.cover_letter}
                                  </p>
                                </div>
                              )}

                              {/* Resume */}
                              {resume?.file_url ? (
                                <div className="flex items-center gap-3">
                                  <a
                                    href={resume.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Preview Resume
                                  </a>
                                  <a
                                    href={resume.file_url}
                                    download={resume.file_name}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </a>
                                  {resume.file_name && (
                                    <span className="text-white/20 text-xs">{resume.file_name}</span>
                                  )}
                                </div>
                              ) : (
                                <p className="text-white/20 text-sm flex items-center gap-2">
                                  <FileText className="w-4 h-4" /> No resume uploaded
                                </p>
                              )}

                              {/* Action buttons */}
                              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                                {app.status !== "accepted" && (
                                  <button
                                    disabled={isUpdating}
                                    onClick={() => handleStatusChange(app.application_id, "accepted")}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#e8ff47] text-[#0a0a0f] font-bold text-sm rounded-xl hover:bg-[#d4eb3a] disabled:opacity-50 transition-all"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {isUpdating ? "Updating…" : "Accept"}
                                  </button>
                                )}
                                {app.status !== "reviewed" && (
                                  <button
                                    disabled={isUpdating}
                                    onClick={() => handleStatusChange(app.application_id, "reviewed")}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/15 text-blue-400 font-semibold text-sm rounded-xl hover:bg-blue-500/25 disabled:opacity-50 transition-all border border-blue-500/20"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Mark Reviewed
                                  </button>
                                )}
                                {app.status !== "pending" && (
                                  <button
                                    disabled={isUpdating}
                                    onClick={() => handleStatusChange(app.application_id, "pending")}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-white/50 font-semibold text-sm rounded-xl hover:bg-white/10 disabled:opacity-50 transition-all border border-white/10"
                                  >
                                    <Clock className="w-4 h-4" />
                                    Reset to Pending
                                  </button>
                                )}
                                {app.status !== "rejected" && (
                                  <button
                                    disabled={isUpdating}
                                    onClick={() => handleStatusChange(app.application_id, "rejected")}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 font-semibold text-sm rounded-xl hover:bg-red-500/20 disabled:opacity-50 transition-all border border-red-500/20"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}