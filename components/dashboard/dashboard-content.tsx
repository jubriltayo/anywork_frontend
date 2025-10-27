"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import { EmployerService } from "@/lib/services/employer";
import { ApplicationService } from "@/lib/services/application";
import type {
  //   User as UserType,
  JobSeeker,
  Employer,
  Application,
} from "@/lib/types/api";
import Link from "next/link";
import {
  Briefcase,
  Users,
  FileText,
  Building2,
  User as UserIcon,
  BarChart3,
  ArrowRight,
  Plus,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardContent() {
  const { user, requireAuth } = useAuth();
  const [profile, setProfile] = useState<JobSeeker | Employer | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      if (user.role === "job_seeker") {
        const [profileRes, applicationsRes] = await Promise.all([
          JobSeekerService.getProfile(user.user_id),
          ApplicationService.getApplications(),
        ]);
        setProfile(profileRes);
        setApplications(applicationsRes.results);
      } else if (user.role === "employer") {
        const [profileRes, applicationsRes] = await Promise.all([
          EmployerService.getProfile(user.user_id),
          ApplicationService.getApplications(),
        ]);
        setProfile(profileRes);
        setApplications(applicationsRes.results);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!requireAuth()) return;
    loadDashboardData();
  }, [requireAuth, loadDashboardData]);

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

  const isJobSeeker = user?.role === "job_seeker";
  const isEmployer = user?.role === "employer";
  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const recentApplications = applications.slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container-main max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back
              {isJobSeeker && profile
                ? `, ${(profile as JobSeeker).first_name}`
                : ""}
              {isEmployer && profile
                ? `, ${(profile as Employer).company_name}`
                : ""}
              !
            </h1>
            <p className="text-muted-foreground text-lg">
              {isJobSeeker
                ? "Ready to find your next opportunity?"
                : "Manage your job postings and applicants."}
            </p>
          </div>

          {/* Role-specific Dashboard */}
          {isJobSeeker && (
            <JobSeekerDashboard
              profile={profile as JobSeeker}
              applications={applications}
              pendingApplications={pendingApplications}
              recentApplications={recentApplications}
            />
          )}

          {isEmployer && (
            <EmployerDashboard
              profile={profile as Employer}
              applications={applications}
            />
          )}

          {/* Admin dashboard can be added here if needed */}
          {user?.role === "admin" && <AdminDashboard />}
        </div>
      </main>
    </>
  );
}

// Job Seeker Dashboard Component
interface JobSeekerDashboardProps {
  profile: JobSeeker;
  applications: Application[];
  pendingApplications: number;
  recentApplications: Application[];
}

function JobSeekerDashboard({
  profile,
  applications,
  pendingApplications,
  recentApplications,
}: JobSeekerDashboardProps) {
  return (
    <>
      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Total Applications</p>
              <p className="text-4xl font-bold">{applications.length}</p>{" "}
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Pending</p>
              <p className="text-4xl font-bold">{pendingApplications}</p>
            </div>
            <Calendar className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Profile Complete</p>
              <p className="text-4xl font-bold">
                {profile?.first_name ? "Yes" : "No"}
              </p>
            </div>
            <UserIcon className="w-8 h-8 text-secondary" />{" "}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Find Jobs */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Find Jobs</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Browse thousands of job opportunities and apply for positions that
            match your skills.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/jobs">
                <Briefcase className="w-4 h-4 mr-2" />
                Browse All Jobs
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/jobs?job_type=remote">
                <Users className="w-4 h-4 mr-2" />
                Remote Jobs
              </Link>
            </Button>
          </div>
        </div>

        {/* Manage Profile & Applications */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <UserIcon className="w-6 h-6 text-accent" />{" "}
            <h2 className="text-2xl font-bold">Your Career</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Manage your applications, update your profile, and track your job
            search progress.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard/applications">
                <FileText className="w-4 h-4 mr-2" />
                View Applications ({applications.length}){" "}
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/job-seeker/profile">
                <UserIcon className="w-4 h-4 mr-2" /> Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Recent Applications</h3>
          <Link
            href="/dashboard/applications"
            className="text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No applications yet</p>
            <Button asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.application_id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div>
                  <h4 className="font-semibold mb-1">
                    Application #{application.application_id.slice(0, 8)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Applied{" "}
                    {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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

// Employer Dashboard Component
interface EmployerDashboardProps {
  profile: Employer;
  applications: Application[];
}

function EmployerDashboard({ profile, applications }: EmployerDashboardProps) {
  const totalApplications = applications.length;

  return (
    <>
      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Total Applications</p>
              <p className="text-4xl font-bold">{totalApplications}</p>{" "}
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Active Jobs</p>
              <p className="text-4xl font-bold">0</p>{" "}
              {/* This would need actual job data */}
            </div>
            <Briefcase className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Profile Complete</p>
              <p className="text-4xl font-bold">
                {profile?.company_name ? "Yes" : "No"}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-secondary" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
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

        {/* Applications & Analytics */}
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
                Manage Applications ({totalApplications}){" "}
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

// Admin Dashboard Component (placeholder)
function AdminDashboard() {
  return (
    <div className="card text-center py-12">
      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
      <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
      <p className="text-muted-foreground mb-6">
        Administrative features and system analytics will be available here.
      </p>
      <Button asChild>
        <Link href="/admin">Go to Admin Panel</Link>
      </Button>
    </div>
  );
}
