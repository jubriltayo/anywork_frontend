"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import { EmployerService } from "@/lib/services/employer";
import type { JobSeeker, Employer } from "@/lib/types/api";
import { EmployerDashboardContent } from "@/components/employer/employer-dashboard-content";
import { JobSeekerDashboardContent } from "@/components/job-seeker/job-seeker-dashboard-content";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-[#e8ff47]/30 border-t-[#e8ff47] animate-spin" />
            <p className="text-white/30 text-sm">Loading…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {user?.role === "job_seeker" && <JobSeekerDashboardContent />}
          {user?.role === "employer" && <EmployerDashboardContent />}
          {user?.role === "admin" && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-white/20" />
              </div>
              <h2 className="text-white text-2xl font-black font-display mb-2">Admin Dashboard</h2>
              <p className="text-white/40 mb-6">Administrative features coming soon.</p>
              <Button asChild>
                <Link href="/admin">Go to Admin Panel</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}