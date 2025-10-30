"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { EmployerService } from "@/lib/services/employer";
import { ApplicationsManager } from "@/components/employer/applications-manager";
import type { Job, Application } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export function EmployerApplicationsPageContent() {
  const { requireAuth } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      const res = await EmployerService.getApplicationsForJob(jobId);
      setApplications(res.results);
    } catch (err) {
      console.error("Failed to load applications:", err);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleStatusChange = async (
    appId: string,
    status: "pending" | "reviewed" | "rejected" | "accepted"
  ) => {
    try {
      await EmployerService.updateApplicationStatus(appId, status);
      if (selectedJob) {
        loadApplications(selectedJob);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container-main max-w-4xl">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold mb-8">Applications</h1>

          {jobs.length === 0 ? (
            <div className="card text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted">No jobs posted yet</p>
            </div>
          ) : (
            <ApplicationsManager
              jobs={jobs}
              applications={applications}
              selectedJob={selectedJob}
              onJobSelect={(jobId) => {
                setSelectedJob(jobId);
                loadApplications(jobId);
              }}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </main>
    </>
  );
}
