"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/lib/services/auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import type { Job, Resume } from "@/lib/types/api";
import Link from "next/link";

interface ApplyFormProps {
  job: Job;
  resumes: Resume[];
  onSubmit: () => void;
}

export function ApplyForm({ job, resumes, onSubmit }: ApplyFormProps) {
  const [selectedResume, setSelectedResume] = useState(
    resumes.length > 0 ? resumes[0].resume_id : ""
  );
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedResume) {
      setError("Please select a resume");
      return;
    }

    setSubmitting(true);

    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        throw new Error("User not found");
      }

      await JobSeekerService.createApplication({
        job_seeker: user.user_id,
        job: job.job_id,
        resume: selectedResume,
        cover_letter: coverLetter,
      });

      setSuccess("Application submitted successfully!");
      setTimeout(() => {
        onSubmit();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resume Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Resume
          </label>
          {resumes.length === 0 ? (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground text-sm mb-3">
                No resumes uploaded yet
              </p>
              <Button variant="outline" asChild size="sm">
                <Link href="/dashboard/profile">Upload Resume</Link>
              </Button>
            </div>
          ) : (
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Choose a resume</option>
              {resumes.map((resume) => (
                <option key={resume.resume_id} value={resume.resume_id}>
                  Resume - {new Date(resume.uploaded_at).toLocaleDateString()}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-sm font-medium mb-2">Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell the employer why you're a great fit for this role..."
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows={6}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-error/10 border border-error text-error rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-success/10 border border-success text-success rounded-lg text-sm">
            {success}
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting || resumes.length === 0}
          size="lg"
          className="w-full"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
}
