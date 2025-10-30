"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import { EmployerService } from "@/lib/services/employer";
import type { JobSeeker, Employer } from "@/lib/types/api";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobSeekerDashboardContent } from "@/components/job-seeker/job-seeker-dashboard-content";
import { EmployerDashboardContent } from "@/components/employer/employer-dashboard-content";

export function DashboardContent() {
  const { user, requireAuth } = useAuth();
  const [profile, setProfile] = useState<JobSeeker | Employer | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      if (user.role === "job_seeker") {
        const profileRes = await JobSeekerService.getProfile(user.user_id);
        setProfile(profileRes);
      } else if (user.role === "employer") {
        const profileRes = await EmployerService.getProfile(user.user_id);
        setProfile(profileRes);
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
          {isJobSeeker && <JobSeekerDashboardContent />}

          {isEmployer && <EmployerDashboardContent />}

          {/* Admin dashboard can be added here if needed */}
          {user?.role === "admin" && <AdminDashboard />}
        </div>
      </main>
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
