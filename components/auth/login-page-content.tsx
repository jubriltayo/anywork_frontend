"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/lib/services/auth";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export function LoginPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (AuthService.isAuthenticated()) router.push("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      if (response.success && response.user) {
        router.push("/dashboard");
      } else {
        setError(response.error || "Invalid email or password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left — form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="w-8 h-8 rounded-lg bg-[#e8ff47] flex items-center justify-center">
              <span className="text-[#0a0a0f] font-black text-sm">AW</span>
            </div>
            <span className="text-white font-bold text-lg">AnyWork</span>
          </Link>

          <h1 className="text-3xl font-black text-white tracking-tight font-display mb-2">
            Welcome back
          </h1>
          <p className="text-white/40 mb-10">
            Sign in to your account to continue
          </p>

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
                  placeholder="••••••••"
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
                  Signing in…
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-white/30 text-sm mt-8 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#e8ff47] font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>

      {/* Right — decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 bg-white/[0.02] border-l border-white/10 relative overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at bottom left, rgba(232,255,71,0.06) 0%, transparent 70%)" }}
        />

        <div className="relative">
          <p className="text-white/20 text-xs font-semibold uppercase tracking-widest mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap gap-3">
            {["Acme Corp", "Buildco", "Nexus AI", "Dataflow", "Stackd"].map((name) => (
              <span key={name} className="px-3 py-1.5 rounded-lg border border-white/10 text-white/30 text-sm">{name}</span>
            ))}
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="text-4xl font-black text-white tracking-tight font-display leading-tight">
            "AnyWork cut our<br />time-to-hire by 60%."
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8ff47]/20 flex items-center justify-center">
              <span className="text-[#e8ff47] font-bold text-sm">SA</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Sarah A.</p>
              <p className="text-white/30 text-xs">Head of Talent, Acme Corp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}