"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { EmployerService } from "@/lib/services/employer";
import { formatJobType, getRelativeTime } from "@/lib/utils/job";
import type { Job } from "@/lib/types/api";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Briefcase,
  MapPin,
  BanknoteIcon,
  Clock,
  Trash2,
  Edit,
  ArrowRight,
} from "lucide-react";

export function EmployerJobsPageContent() {
  const { requireAuth } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!requireAuth()) return;

    try {
      const jobsRes = await EmployerService.getJobs();
      setJobs(jobsRes);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (jobId: string) => {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;

    setDeleting(jobId);
    try {
      await EmployerService.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.job_id !== jobId));
    } catch (err) {
      console.error("Failed to delete job:", err);
    } finally {
      setDeleting(null);
    }
  };

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

      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div>
                <h1 className="text-2xl font-black text-white">My Jobs</h1>
                <p className="text-white/30 text-sm">
                  {jobs.length} posting{jobs.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/employer/jobs/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e8ff47] text-[#0a0a0f] font-bold text-sm rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Post New Job
            </Link>
          </div>

          {/* Empty state */}
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-white/20" />
              </div>

              <p className="text-white font-semibold mb-2">
                No jobs posted yet
              </p>

              <p className="text-white/30 text-sm mb-6">
                Post your first job to start attracting candidates
              </p>

              <Link
                href="/dashboard/employer/jobs/new"
                className="px-6 py-3 bg-[#e8ff47] text-[#0a0a0f] font-bold rounded-xl"
              >
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.job_id}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                >
                  <div className="flex items-start justify-between gap-4">

                    {/* LEFT */}
                    <div className="flex-1 min-w-0">

                      {/* Status */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${job.is_active
                              ? "bg-[#e8ff47]/10 text-[#e8ff47]"
                              : "bg-white/5 text-white/30"
                            }`}
                        >
                          {job.is_active ? "Active" : "Closed"}
                        </span>

                        <span className="text-xs text-white/30">
                          {formatJobType(job.job_type)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-bold text-lg mb-3 truncate">
                        {job.title}
                      </h3>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-xs text-white/30">

                        {/* Location (now from backend object) */}
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location.city}, {job.location.state}
                        </span>

                        {/* Category */}
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          {job.category.name}
                        </span>

                        {job.salary_range && (
                          <span className="flex items-center gap-1.5">
                            <BanknoteIcon className="w-3.5 h-3.5" />
                            {job.salary_range}
                          </span>
                        )}

                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Posted {getRelativeTime(job.posted_at)}
                        </span>

                        {job.expires_at && (
                          <span className="text-white/20">
                            Expires{" "}
                            {new Date(job.expires_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-2 shrink-0">

                      <Link
                        href={`/dashboard/employer/jobs/${job.job_id}`}
                        className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4 text-white/40" />
                      </Link>

                      <button
                        onClick={() => handleDelete(job.job_id)}
                        disabled={deleting === job.job_id}
                        className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center"
                      >
                        {deleting === job.job_id ? (
                          <span className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-white/40" />
                        )}
                      </button>

                      <Link
                        href={`/jobs/${job.job_id}`}
                        className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center"
                      >
                        <ArrowRight className="w-4 h-4 text-white/40" />
                      </Link>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}