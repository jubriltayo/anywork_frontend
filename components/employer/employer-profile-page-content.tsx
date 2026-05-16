"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { EmployerService } from "@/lib/services/employer";
import type { Employer } from "@/lib/types/api";
import Link from "next/link";
import { ArrowLeft, Save, Check, Building2 } from "lucide-react";

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-all";
const labelClass = "block text-white/40 text-xs font-semibold uppercase tracking-widest mb-2";

export function EmployerProfilePageContent() {
  const { requireAuth, user } = useAuth();
  const [profile, setProfile] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;
    setError(""); setSaving(true);
    try {
      await EmployerService.updateProfile(user.user_id, {
        company_name: profile.company_name,
        company_description: profile.company_description ?? null,
        website: profile.website ?? null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight font-display">Company Profile</h1>
              <p className="text-white/30 text-sm">Update your company information</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-[#e8ff47]/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#e8ff47]" />
              </div>
              <div>
                <p className="text-white font-bold">{profile.company_name}</p>
                <p className="text-white/30 text-sm">Employer Account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  value={profile.company_name}
                  onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                  placeholder="Your Company Inc."
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Company Description</label>
                <textarea
                  value={profile.company_description ?? ""}
                  onChange={(e) => setProfile({ ...profile, company_description: e.target.value })}
                  placeholder="Tell candidates what makes your company a great place to work…"
                  rows={5}
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </div>

              <div>
                <label className={labelClass}>Website</label>
                <input
                  type="url"
                  value={profile.website ?? ""}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yourcompany.com"
                  className={inputClass}
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-7 py-3.5 bg-[#e8ff47] text-[#0a0a0f] font-black text-sm rounded-xl hover:bg-[#d4eb3a] disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <span className="w-4 h-4 rounded-full border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] animate-spin" />
                ) : saved ? (
                  <><Check className="w-4 h-4" /> Saved!</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}