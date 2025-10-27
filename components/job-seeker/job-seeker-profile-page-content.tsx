"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import { JobSeekerProfileForm } from "./job-seeker-profile-form";
import { ResumeManager } from "./resume-manager";
import { SkillsManager } from "./skills-manager";
import type { JobSeeker, Resume, Skill } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft, FileText, Star } from "lucide-react";

export function JobSeekerProfilePageContent() {
  const { requireAuth, user } = useAuth();
  const [profile, setProfile] = useState<JobSeeker | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "resumes" | "skills">(
    "profile"
  );
  const [loading, setLoading] = useState(true);

  const loadProfileData = useCallback(async () => {
    if (!requireAuth() || !user) return;

    try {
      const [profileRes, resumesRes, skillsRes] = await Promise.all([
        JobSeekerService.getProfile(user.user_id),
        JobSeekerService.getResumes(),
        JobSeekerService.getSkills(),
      ]);

      setProfile(profileRes);
      setResumes(resumesRes.results);
      setSkills(skillsRes.results);
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setLoading(false);
    }
  }, [requireAuth, user]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

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
        <div className="container-main max-w-4xl">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold mb-8">Your Profile</h1>

          {/* Tab Navigation */}
          <div className="flex border-b border-border mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("resumes")}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === "resumes"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Resumes ({resumes.length})
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === "skills"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Skills ({skills.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="card">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Personal Information
                </h2>
                <JobSeekerProfileForm
                  profile={profile}
                  onSuccess={loadProfileData}
                />
              </div>
            )}

            {activeTab === "resumes" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Resume Management</h2>
                <ResumeManager resumes={resumes} onSuccess={loadProfileData} />
              </div>
            )}

            {activeTab === "skills" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
                <SkillsManager skills={skills} onSuccess={loadProfileData} />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
