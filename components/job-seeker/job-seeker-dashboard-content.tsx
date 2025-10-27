"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import type { JobSeeker, Application, Resume, Skill } from "@/lib/types/api";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  User,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function JobSeekerDashboardContent() {
  const { requireAuth, user } = useAuth();
  const [profile, setProfile] = useState<JobSeeker | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!requireAuth() || !user) return;

    try {
      const [profileRes, applicationsRes, resumesRes, skillsRes] =
        await Promise.all([
          JobSeekerService.getProfile(user.user_id),
          JobSeekerService.getApplications(),
          JobSeekerService.getResumes(),
          JobSeekerService.getSkills(),
        ]);

      setProfile(profileRes);
      setApplications(applicationsRes.results);
      setResumes(resumesRes.results);
      setSkills(skillsRes.results);
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
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted">Loading...</p>
        </div>
      </>
    );
  }

  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const acceptedApplications = applications.filter(
    (app) => app.status === "accepted"
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
              Welcome back{profile?.first_name ? `, ${profile.first_name}` : ""}
              !
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your job applications and manage your profile.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted text-sm mb-2">Total Applications</p>
                  <p className="text-4xl font-bold">{applications.length}</p>
                </div>
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted text-sm mb-2">Pending</p>
                  <p className="text-4xl font-bold">{pendingApplications}</p>
                </div>
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted text-sm mb-2">Accepted</p>
                  <p className="text-4xl font-bold">{acceptedApplications}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted text-sm mb-2">Resumes</p>
                  <p className="text-4xl font-bold">{resumes.length}</p>
                </div>
                <FileText className="w-8 h-8 text-secondary" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Job Search */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Find Jobs</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Browse thousands of job opportunities and find your perfect
                match.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/jobs">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/dashboard/applications">
                    <FileText className="w-4 h-4 mr-2" />
                    View Applications
                  </Link>
                </Button>
              </div>
            </div>

            {/* Profile & Skills */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold">Your Profile</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Manage your resume, skills, and personal information.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/dashboard/job-seeker/profile">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/dashboard/job-seeker/skills">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Manage Skills
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity & Profile */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Recent Applications</h3>
                <Link
                  href="/dashboard/applications"
                  className="text-primary hover:underline text-sm"
                >
                  View all
                </Link>
              </div>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    No applications yet
                  </p>
                  <Button asChild size="sm">
                    <Link href="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentApplications.map((application) => (
                    <div
                      key={application.application_id}
                      className="p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Application</h4>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {application.cover_letter}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Applied{" "}
                        {new Date(application.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills & Resume */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-secondary" />
                <h3 className="text-xl font-bold">Skills & Resume</h3>
              </div>
              <div className="space-y-4">
                {/* Skills */}
                <div>
                  <p className="text-sm font-medium mb-2">Your Skills</p>
                  {skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No skills added yet
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill.skill_id}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {skills.length > 5 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{skills.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Resume */}
                <div>
                  <p className="text-sm font-medium mb-2">Resume</p>
                  {resumes.length === 0 ? (
                    <p className="text-sm text-muted-foreground mb-3">
                      No resume uploaded
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-3">
                      {resumes.length} resume(s) uploaded
                    </p>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/job-seeker/resume">
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Resume
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
