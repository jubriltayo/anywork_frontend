"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import type { Application } from "@/lib/types/api";
import Link from "next/link";
import { Briefcase, FileText, User, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JobSeekerDashboardContent() {
  const { requireAuth, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!requireAuth() || !user) return;

    try {
      const applicationsRes = await JobSeekerService.getApplications();
      setApplications(applicationsRes.results);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [requireAuth, user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const recentApplications = applications.slice(0, 5);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">
                Total Applications
              </p>
              <p className="text-4xl font-bold">{applications.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Pending</p>
              <p className="text-4xl font-bold">{pendingApplications}</p>
            </div>
            <Clock className="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Find Jobs */}
        <div className="card flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Find Jobs</h2>
          </div>
          <p className="text-muted-foreground mb-6 grow">
            Browse thousands of job opportunities and find your perfect match.
          </p>
          <div className="mt-auto">
            <Button asChild className="w-full">
              <Link href="/jobs">
                <Briefcase className="w-4 h-4 mr-2" />
                Browse Jobs
              </Link>
            </Button>
          </div>
        </div>

        {/* Your Profile */}
        <div className="card flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">Your Profile</h2>
          </div>
          <p className="text-muted-foreground mb-6 grow">
            Manage your resume, skills, and personal information.
          </p>
          <div className="mt-auto">
            <Button asChild className="w-full">
              <Link href="/dashboard/job-seeker/profile">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Recent Applications</h3>
          <Link
            href="/dashboard/applications"
            className="text-primary hover:underline text-sm flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4 text-lg">
              No applications yet
            </p>
            <Button asChild size="lg">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.application_id}
                className="flex items-center justify-between p-6 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">
                    Application #{application.application_id.slice(0, 8)}
                  </h4>
                  <p className="text-muted-foreground">
                    Applied{" "}
                    {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                  {application.cover_letter && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {application.cover_letter}
                    </p>
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    application.status === "accepted"
                      ? "bg-success/10 text-success border border-success"
                      : application.status === "rejected"
                      ? "bg-error/10 text-error border border-error"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
