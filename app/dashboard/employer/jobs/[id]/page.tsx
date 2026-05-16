"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { JobForm } from "@/components/employer/job-form";
import { EmployerService } from "@/lib/services/employer";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Job } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const { requireAuth } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const loadJob = useCallback(async () => {
    if (!requireAuth()) return;
    try {
      const res = await EmployerService.getJobById(jobId);
      setJob(res);
    } catch (err) {
      console.error("Failed to load job:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId, requireAuth]);

  useEffect(() => { loadJob(); }, [loadJob]);

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
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
          <p className="text-white/40">Job not found</p>
          <Link href="/dashboard/employer/jobs" className="text-[#e8ff47] text-sm hover:underline">
            Back to jobs
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard/employer/jobs"
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight font-display">Edit Job</h1>
              <p className="text-white/30 text-sm truncate max-w-xs">{job.title}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <JobForm
              job={job}
              onSuccess={() => router.push("/dashboard/employer/jobs")}
            />
          </div>
        </div>
      </main>
    </>
  );
}