"use client";

import type React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { JobSeekerService } from "@/lib/services/job-seeker";
import type { JobSeeker, Resume, Skill } from "@/lib/types/api";
import Link from "next/link";
import {
  ArrowLeft, User, FileText, Star, Upload, Trash2,
  Plus, X, Check, Save,
} from "lucide-react";

export function JobSeekerProfilePageContent() {
  const { requireAuth, user } = useAuth();
  const [profile, setProfile] = useState<JobSeeker | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "resumes" | "skills">("profile");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
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

  useEffect(() => { loadData(); }, [loadData]);

  if (loading || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#e8ff47]/30 border-t-[#e8ff47] animate-spin" />
        </div>
      </>
    );
  }

  const tabs = [
    { key: "profile", label: "Personal Info", icon: User },
    { key: "resumes", label: `Resumes (${resumes.length})`, icon: FileText },
    { key: "skills", label: `Skills (${skills.length})`, icon: Star },
  ] as const;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight font-display">Your Profile</h1>
              <p className="text-white/30 text-sm">Manage your info, resumes, and skills</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl mb-6">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === key
                    ? "bg-white/10 text-white"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab panels */}
          {activeTab === "profile" && (
            <ProfileForm profile={profile} onSuccess={loadData} />
          )}
          {activeTab === "resumes" && (
            <ResumePanel resumes={resumes} onSuccess={loadData} />
          )}
          {activeTab === "skills" && (
            <SkillsPanel skills={skills} onSuccess={loadData} />
          )}
        </div>
      </main>
    </>
  );
}

/* ── Profile Form ── */
function ProfileForm({ profile, onSuccess }: { profile: JobSeeker; onSuccess: () => void }) {
  const [form, setForm] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await JobSeekerService.updateProfile(profile.user, form);
      setSaved(true);
      onSuccess();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
      <h2 className="text-white font-bold text-lg mb-6">Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">First Name</label>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              placeholder="John"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-all"
            />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Last Name</label>
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              placeholder="Doe"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Phone Number</label>
          <input
            type="tel"
            value={form.phone_number ?? ""}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            placeholder="+234 800 000 0000"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-all"
          />
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-[#e8ff47] text-[#0a0a0f] font-black text-sm rounded-xl hover:bg-[#d4eb3a] disabled:opacity-50 transition-all"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] animate-spin" />
          ) : saved ? (
            <><Check className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </form>
    </div>
  );
}

/* ── Resume Panel ── */
function ResumePanel({ resumes, onSuccess }: { resumes: Resume[]; onSuccess: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Only PDF files are allowed"); return; }
    if (file.size > 10 * 1024 * 1024) { setError("File must be under 10MB"); return; }
    setError(""); setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file_path", file);
      await JobSeekerService.uploadResume(fd);
      onSuccess();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await JobSeekerService.deleteResume(id);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full rounded-2xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/25 transition-all p-10 flex flex-col items-center gap-3 text-center group"
      >
        <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-[#e8ff47]/10 flex items-center justify-center transition-colors">
          <Upload className={`w-5 h-5 ${uploading ? "text-[#e8ff47] animate-bounce" : "text-white/30 group-hover:text-[#e8ff47]"} transition-colors`} />
        </div>
        <div>
          <p className="text-white/60 text-sm font-semibold">
            {uploading ? "Uploading…" : "Click to upload resume"}
          </p>
          <p className="text-white/25 text-xs mt-1">PDF only · Max 10MB</p>
        </div>
      </button>
      <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Resume list */}
      {resumes.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">Uploaded Resumes</p>
          </div>
          <div className="divide-y divide-white/5">
            {resumes.map((r) => (
              <div key={r.resume_id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-lg bg-[#e8ff47]/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#e8ff47]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">Resume</p>
                  <p className="text-white/30 text-xs">Uploaded {new Date(r.uploaded_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(r.resume_id)}
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/20 hover:text-red-400 hover:border-red-400/30 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Skills Panel ── */
function SkillsPanel({ skills, onSuccess }: { skills: Skill[]; onSuccess: () => void }) {
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setLoading(true); setError("");
    try {
      await JobSeekerService.addSkill(newSkill.trim());
      setNewSkill("");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await JobSeekerService.deleteSkill(id);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill");
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
      <h2 className="text-white font-bold text-lg">Skills & Expertise</h2>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-3">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="e.g. React, Python, Figma…"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !newSkill.trim()}
          className="w-12 h-12 rounded-xl bg-[#e8ff47] text-[#0a0a0f] flex items-center justify-center disabled:opacity-40 hover:bg-[#d4eb3a] transition-all"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
      </form>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Skills grid */}
      {skills.length === 0 ? (
        <p className="text-white/20 text-sm text-center py-8">No skills added yet. Add your first skill above.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.skill_id}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/20 transition-all"
            >
              <span className="text-white/70 text-sm font-medium">{skill.name}</span>
              <button
                onClick={() => handleDelete(skill.skill_id)}
                className="text-white/20 hover:text-red-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}