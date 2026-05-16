"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/lib/services/auth";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Briefcase, User, Building2 } from "lucide-react";

export function RegisterPageContent() {
  const router = useRouter();
  const [role, setRole] = useState<"job_seeker" | "employer">("employer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (AuthService.isAuthenticated()) router.push("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.register({ email, password, role });
      if (response.success) {
        router.push("/login");
      } else {
        setError(response.error || "Registration failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col justify-center px-6 py-16">
      <div className="max-w-lg mx-auto w-full">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
          <div className="w-8 h-8 rounded-lg bg-[#e8ff47] flex items-center justify-center">
            <span className="text-[#0a0a0f] font-black text-sm">AW</span>
          </div>
          <span className="text-white font-bold text-lg">AnyWork</span>
        </Link>

        <h1 className="text-3xl font-black text-white tracking-tight font-display mb-2">
          Create your account
        </h1>
        <p className="text-white/40 mb-10">
          Join AnyWork and start in minutes
        </p>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            type="button"
            onClick={() => setRole("job_seeker")}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border transition-all text-left ${
              role === "job_seeker"
                ? "border-[#e8ff47]/50 bg-[#e8ff47]/5"
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              role === "job_seeker" ? "bg-[#e8ff47]/15" : "bg-white/5"
            }`}>
              <User className={`w-4 h-4 ${role === "job_seeker" ? "text-[#e8ff47]" : "text-white/30"}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${role === "job_seeker" ? "text-white" : "text-white/50"}`}>
                Job Seeker
              </p>
              <p className="text-white/30 text-xs">Find your next role</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("employer")}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border transition-all text-left ${
              role === "employer"
                ? "border-[#e8ff47]/50 bg-[#e8ff47]/5"
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              role === "employer" ? "bg-[#e8ff47]/15" : "bg-white/5"
            }`}>
              <Building2 className={`w-4 h-4 ${role === "employer" ? "text-[#e8ff47]" : "text-white/30"}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${role === "employer" ? "text-white" : "text-white/50"}`}>
                Employer
              </p>
              <p className="text-white/30 text-xs">Hire top talent</p>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#e8ff47]/50 focus:bg-white/[0.07] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#e8ff47]/50 focus:bg-white/[0.07] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#e8ff47]/50 focus:bg-white/[0.07] transition-all"
              />
            </div>
          </div>

          {/* Role context hint */}
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            {role === "employer" ? (
              <Briefcase className="w-4 h-4 text-[#e8ff47] mt-0.5 shrink-0" />
            ) : (
              <User className="w-4 h-4 text-[#e8ff47] mt-0.5 shrink-0" />
            )}
            <p className="text-white/40 text-xs leading-relaxed">
              {role === "employer"
                ? "You'll be able to post jobs, review applications, and manage your company profile from the employer dashboard."
                : "You'll be able to browse jobs, upload your resume, and track all your applications in one place."}
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
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#e8ff47] text-[#0a0a0f] font-black rounded-xl hover:bg-[#d4eb3a] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] animate-spin" />
                Creating account…
              </span>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-white/30 text-sm mt-8 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#e8ff47] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}