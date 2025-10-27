"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { EmployerService } from "@/lib/services/employer";
import type { Job } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft, Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/job-card";

export function EmployerJobsPageContent() {
  const { requireAuth } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    if (!requireAuth()) return;

    try {
      const res = await EmployerService.getJobs();
      setJobs(res);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background">
          <div className="container-main max-w-4xl py-12">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-primary hover:underline mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">My Jobs</h1>
              <Button asChild>
                <Link href="/dashboard/employer/jobs/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Link>
              </Button>
            </div>

            {/* Loading skeleton */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card h-48 bg-muted/50 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container-main max-w-4xl py-12">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">My Jobs</h1>
            <Button asChild>
              <Link href="/dashboard/employer/jobs/new">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Link>
            </Button>
          </div>

          {jobs.length === 0 ? (
            <div className="card text-center py-16">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-2xl font-semibold mb-2">
                No jobs posted yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start by posting your first job to attract talented candidates
              </p>
              <Button asChild size="lg">
                <Link href="/dashboard/employer/jobs/new">
                  Post Your First Job
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground">
                  Showing{" "}
                  <span className="text-foreground font-semibold">
                    {jobs.length}
                  </span>{" "}
                  job{jobs.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job.job_id} job={job} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
