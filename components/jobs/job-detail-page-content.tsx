"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JobService } from "@/lib/services/job";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  formatJobType,
  getRelativeTime,
} from "@/lib/utils/job";
import type { Job } from "@/lib/types/api";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  BanknoteIcon,
  Clock,
  Calendar,
  Briefcase,
  ArrowRight,
  Building2,
  Tag,
} from "lucide-react";

interface Props {
  jobId: string;
}

export function JobDetailPageContent({ jobId }: Props) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useAuth();

  const loadData = useCallback(async () => {
    try {
      const jobRes = await JobService.getJobById(jobId);
      setJob(jobRes);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center">
          <p className="text-white/40 mb-4">Job not found</p>
          <Link href="/jobs" className="text-[#e8ff47] text-sm hover:underline">
            Browse all jobs →
          </Link>
        </div>
      </>
    );
  }

  const location = `${job.location.city}, ${job.location.state}`;
  const category = job.category.name;
  const jobType = formatJobType(job.job_type);
  const posted = getRelativeTime(job.posted_at);

  const canApply = isAuthenticated && user?.role === "job_seeker";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white text-sm mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>

          {/* HEADER */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 mb-5">

            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white/30" />
              </div>

              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${job.is_active
                  ? "bg-[#e8ff47]/10 text-[#e8ff47]"
                  : "bg-white/5 text-white/30"
                  }`}
              >
                {job.is_active ? "Actively Hiring" : "Closed"}
              </span>
            </div>

            <h1 className="text-3xl font-black text-white mb-6">
              {job.title}
            </h1>

            {/* META */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-white/30" />
                  <p className="text-white/30 text-xs">Type</p>
                </div>
                <p className="text-white text-sm font-semibold">{jobType}</p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-white/30" />
                  <p className="text-white/30 text-xs">Location</p>
                </div>
                <p className="text-white text-sm font-semibold">
                  {location}
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <BanknoteIcon className="w-3.5 h-3.5 text-white/30" />
                  <p className="text-white/30 text-xs">Salary</p>
                </div>
                <p className="text-white text-sm font-semibold">
                  {job.salary_range || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-3.5 h-3.5 text-white/30" />
                  <p className="text-white/30 text-xs">Category</p>
                </div>
                <p className="text-white text-sm font-semibold">
                  {category}
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-white/30" />
                  <p className="text-white/30 text-xs">Posted</p>
                </div>
                <p className="text-white text-sm font-semibold">
                  {posted}
                </p>
              </div>

            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 mb-5">
            <h2 className="text-white font-bold text-lg mb-4">
              About this role
            </h2>
            <p className="text-white/60 text-sm whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* APPLY */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h2 className="text-white font-bold text-lg mb-2">
              Ready to apply?
            </h2>

            <p className="text-white/40 text-sm mb-6">
              {canApply
                ? "Submit your application."
                : isAuthenticated
                  ? "Only job seekers can apply."
                  : "Create an account to apply."}
            </p>

            {canApply ? (
              <Link
                href={`/jobs/${jobId}/apply`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#e8ff47] text-[#0a0a0f] font-black rounded-xl"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="px-6 py-3 border border-white/20 text-white rounded-xl"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 bg-[#e8ff47] text-[#0a0a0f] font-bold rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}