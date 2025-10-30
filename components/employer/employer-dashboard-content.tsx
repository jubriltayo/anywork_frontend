"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { EmployerService } from "@/lib/services/employer";
import { AnalyticsService } from "@/lib/services/analytics";
import type { Employer, Job, Analytics } from "@/lib/types/api";
import Link from "next/link";
import {
  Briefcase,
  Users,
  BarChart3,
  Plus,
  FileText,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmployerDashboardContent() {
  const { requireAuth, user } = useAuth();
  const [profile, setProfile] = useState<Employer | null>(null);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!requireAuth() || !user) return;

    try {
      const [profileRes, analyticsRes, jobsRes] = await Promise.all([
        EmployerService.getProfile(user.user_id),
        AnalyticsService.getAnalytics(),
        EmployerService.getJobs(),
      ]);

      setProfile(profileRes);
      setAnalytics(analyticsRes.results);
      setJobs(jobsRes);
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

  const totalViews = analytics.reduce((sum, a) => sum + a.views, 0);
  const totalApplications = analytics.reduce(
    (sum, a) => sum + a.applications,
    0
  );
  const activeJobs = jobs.filter((job) => job.is_active).length;

  return (
    <>
      {/* Stats Grid - 3 cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Active Jobs</p>
              <p className="text-4xl font-bold">{activeJobs}</p>
            </div>
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Total Views</p>
              <p className="text-4xl font-bold">{totalViews}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Applications</p>
              <p className="text-4xl font-bold">{totalApplications}</p>
            </div>
            <Users className="w-8 h-8 text-secondary" />
          </div>
        </div>
      </div>

      {/* 2-Section Layout - Manage Jobs, Insights */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Manage Jobs */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Manage Jobs</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Create new job postings and manage your existing listings.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard/employer/jobs/new">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/employer/jobs">
                <Briefcase className="w-4 h-4 mr-2" />
                View All Jobs
              </Link>
            </Button>
          </div>
        </div>

        {/* Insights */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">Insights</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Track your job performance and review applications.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard/employer/applications">
                <Users className="w-4 h-4 mr-2" />
                Manage Applications
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Company Profile */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-secondary" />
          <h3 className="text-2xl font-bold">Company Profile</h3>
        </div>

        {profile ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Company Name
                </p>
                <p className="font-semibold text-lg">{profile.company_name}</p>
              </div>
              {profile.website && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Website</p>
                  <a
                    href={profile.website}
                    className="font-semibold text-lg text-primary hover:underline"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>

            {profile.company_description && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-foreground">{profile.company_description}</p>
              </div>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/employer/profile">
                <FileText className="w-4 h-4 mr-2" />
                Edit Company Profile
              </Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              Complete your company profile to attract more candidates
            </p>
            <Button asChild>
              <Link href="/dashboard/employer/profile">
                Setup Company Profile
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
