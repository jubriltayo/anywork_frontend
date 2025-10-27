"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { JobService } from "@/lib/services/job";
import { useAuth } from "@/lib/hooks/use-auth";
import { JobDetails } from "@/components/jobs/job-details";
import type { Job } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface JobDetailPageContentProps {
  jobId: string;
}

export function JobDetailPageContent({ jobId }: JobDetailPageContentProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadJob = useCallback(async () => {
    try {
      const res = await JobService.getJobById(jobId);
      setJob(res);
    } catch (err) {
      console.error("Failed to load job:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
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
            <p className="text-gray-500 mb-4">Job not found</p>
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
        <div className="container-main max-w-3xl">
          <Link
            href="/jobs"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>

          <JobDetails job={job} />

          {/* Apply Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Ready to Apply?</h2>
            {!isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Sign in to your account to apply for this job.
                </p>
                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/register">Create Account</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <Button asChild size="lg">
                <Link href={`/jobs/${jobId}/apply`}>Apply Now</Link>
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
