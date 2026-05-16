"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { JobForm } from "@/components/employer/job-form";
import { useAuth } from "@/lib/hooks/use-auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewJobPage() {
  const router = useRouter();
  const { requireAuth } = useAuth();

  useEffect(() => { requireAuth(); }, [requireAuth]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard/employer/jobs"
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight font-display">Post a New Job</h1>
              <p className="text-white/30 text-sm">Fill in the details to publish your listing</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <JobForm onSuccess={() => router.push("/dashboard/employer/jobs")} />
          </div>
        </div>
      </main>
    </>
  );
}