"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/lib/services/auth";
import { Mail, Lock, Briefcase, User } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"job_seeker" | "employer">("job_seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [jobSeekerData, setJobSeekerData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const [employerData, setEmployerData] = useState({
    company_name: "",
    company_description: "",
    website: "",
  });

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

    if (
      role === "job_seeker" &&
      (!jobSeekerData.first_name || !jobSeekerData.last_name)
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (role === "employer" && !employerData.company_name) {
      setError("Please fill in all required fields");
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
    <div className="card">
      <h1 className="text-3xl font-bold mb-2">Create Account</h1>
      <p className="text-gray-400 mb-8">Join AnyWork and start your journey</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">I am a:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("job_seeker")}
              className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                role === "job_seeker"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                role === "employer"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent"
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-sm font-medium">Employer</span>
            </button>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {role === "job_seeker" && (
          <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-semibold text-sm">Job Seeker Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name *
                </label>
                <Input
                  type="text"
                  placeholder="John"
                  value={jobSeekerData.first_name}
                  onChange={(e) =>
                    setJobSeekerData({
                      ...jobSeekerData,
                      first_name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name *
                </label>
                <Input
                  type="text"
                  placeholder="Doe"
                  value={jobSeekerData.last_name}
                  onChange={(e) =>
                    setJobSeekerData({
                      ...jobSeekerData,
                      last_name: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={jobSeekerData.phone_number}
                onChange={(e) =>
                  setJobSeekerData({
                    ...jobSeekerData,
                    phone_number: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}

        {role === "employer" && (
          <div className="space-y-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
            <h3 className="font-semibold text-sm">Company Information</h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name *
              </label>
              <Input
                type="text"
                placeholder="Your Company Inc."
                value={employerData.company_name}
                onChange={(e) =>
                  setEmployerData({
                    ...employerData,
                    company_name: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Description
              </label>
              <textarea
                placeholder="Tell us about your company..."
                value={employerData.company_description}
                onChange={(e) =>
                  setEmployerData({
                    ...employerData,
                    company_description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <Input
                type="url"
                placeholder="https://yourcompany.com"
                value={employerData.website}
                onChange={(e) =>
                  setEmployerData({ ...employerData, website: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-error/10 border border-error text-error rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-gray-400 mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
