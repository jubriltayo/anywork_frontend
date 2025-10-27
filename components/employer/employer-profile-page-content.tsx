"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { EmployerService } from "@/lib/services/employer";
import { EmployerProfileForm } from "@/components/employer/employer-profile-form";
import type { Employer } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function EmployerProfilePageContent() {
  const { requireAuth, user } = useAuth();
  const [profile, setProfile] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!requireAuth() || !user) return;

    try {
      const res = await EmployerService.getProfile(user.user_id);
      setProfile(res);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, [requireAuth, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading || !profile) {
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
        <div className="container-main max-w-2xl">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold mb-8">Company Profile</h1>

          <div className="card">
            <EmployerProfileForm profile={profile} onSuccess={loadProfile} />
          </div>
        </div>
      </main>
    </>
  );
}
