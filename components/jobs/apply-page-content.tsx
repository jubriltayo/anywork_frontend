"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { AuthService } from "@/lib/services/auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import { JobService } from "@/lib/services/job";
import type { Job, Resume } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft, FileText, ArrowRight, Upload, CheckCircle } from "lucide-react";

export function ApplyPageContent() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [jobRes, resumesRes] = await Promise.all([
        JobService.getJobById(jobId),
        JobSeekerService.getResumes(),
      ]);
      setJob(jobRes);
      setResumes(resumesRes.results);
      if (resumesRes.results.length > 0) {
        setSelectedResume(resumesRes.results[0].resume_id);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    const token = AuthService.getAccessToken();
    if (!token) { router.push("/login"); return; }
    loadData();
  }, [router, loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResume) { setError("Please select a resume"); return; }
    setError("");
    setSubmitting(true);
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error("User not found");
      await JobSeekerService.createApplication({
        job_seeker: user.user_id,
        job: jobId,
        resume: selectedResume,
        cover_letter: coverLetter,
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/applications"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#e8ff47]/30 border-t-[#e8ff47] animate-spin" />
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center">
          <p className="text-white/40 mb-4">Job not found</p>
          <Link href="/jobs" className="text-[#e8ff47] text-sm hover:underline">Browse all jobs →</Link>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-2xl bg-[#e8ff47]/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#e8ff47]" />
            </div>
            <h2 className="text-white text-2xl font-black font-display mb-2">Application Sent!</h2>
            <p className="text-white/40 text-sm mb-6">
              Your application for <span className="text-white font-semibold">{job.title}</span> has been submitted.
              We&apos;ll notify you when the employer responds.
            </p>
            <p className="text-white/20 text-xs">Redirecting to your applications…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Back */}
          <Link
            href={`/jobs/${jobId}`}
            className="inline-flex items-center gap-2 text-white/30 hover:text-white text-sm mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Job
          </Link>

          {/* Job context */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 mb-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#e8ff47]/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#e8ff47]" />
            </div>
            <div>
              <p className="text-white/30 text-xs mb-0.5">Applying for</p>
              <p className="text-white font-bold">{job.title}</p>
              <p className="text-white/30 text-xs capitalize">{job.job_type?.replace("-", " ")}</p>
            </div>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight font-display mb-1">
            Complete your application
          </h1>
          <p className="text-white/40 text-sm mb-8">
            Choose a resume and tell the employer why you&apos;re a great fit.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Resume selection */}
            <div>
              <label className="block text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
                Select Resume
              </label>

              {resumes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
                  <Upload className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm mb-4">No resumes uploaded yet</p>
                  <Link
                    href="/dashboard/job-seeker/profile"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white/60 hover:text-white text-sm font-medium rounded-xl transition-all"
                  >
                    Upload a Resume
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {resumes.map((resume) => (
                    <button
                      key={resume.resume_id}
                      type="button"
                      onClick={() => setSelectedResume(resume.resume_id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all ${
                        selectedResume === resume.resume_id
                          ? "border-[#e8ff47]/40 bg-[#e8ff47]/5"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        selectedResume === resume.resume_id ? "bg-[#e8ff47]/15" : "bg-white/5"
                      }`}>
                        <FileText className={`w-4 h-4 ${selectedResume === resume.resume_id ? "text-[#e8ff47]" : "text-white/30"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${selectedResume === resume.resume_id ? "text-white" : "text-white/60"}`}>
                          Resume
                        </p>
                        <p className="text-white/30 text-xs">
                          Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedResume === resume.resume_id && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-[#e8ff47] flex items-center justify-center">
                          <svg className="w-3 h-3 text-[#0a0a0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cover letter */}
            <div>
              <label className="block text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
                Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit for this role. What excites you about this position? What relevant experience do you bring?"
                required
                rows={7}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-all resize-none leading-relaxed"
              />
              <p className="text-white/20 text-xs mt-2">
                {coverLetter.length} characters
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || resumes.length === 0}
              className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#e8ff47] text-[#0a0a0f] font-black rounded-xl hover:bg-[#d4eb3a] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] animate-spin" />
                  Submitting…
                </span>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}