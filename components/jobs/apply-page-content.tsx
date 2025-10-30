"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { ApplyForm } from "./apply-form";
import { AuthService } from "@/lib/services/auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import { JobService } from "@/lib/services/job";
import type { Job, Resume } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ApplyPageContent() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [jobRes, resumesRes] = await Promise.all([
        JobService.getJobById(jobId),
        JobSeekerService.getResumes(),
      ]);

      setJob(jobRes);
      setResumes(resumesRes.results);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    const token = AuthService.getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    loadData();
  }, [router, jobId, loadData]);

  const handleSuccess = () => {
    router.push("/dashboard/applications");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted">Loading...</p>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <div className="container-main text-center">
            <p className="text-muted mb-4">Job not found</p>
            <Link href="/jobs" className="text-primary hover:underline">
              Back to jobs
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container-main max-w-2xl">
          <Link
            href={`/jobs/${jobId}`}
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job
          </Link>

          <h1 className="text-4xl font-bold mb-2">Apply for {job.title}</h1>
          <p className="text-muted-foreground mb-8">
            Complete your application below
          </p>

          <ApplyForm job={job} resumes={resumes} onSubmit={handleSuccess} />
        </div>
      </main>
    </>
  );
}
