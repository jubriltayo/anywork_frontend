"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { JobForm } from "@/components/employer/job-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export function NewJobPageContent() {
  const router = useRouter();
  const { requireAuth } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container-main max-w-2xl">
          <Link
            href="/dashboard/employer/jobs"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>

          <h1 className="text-4xl font-bold mb-8">Post a New Job</h1>

          <div className="card">
            <JobForm
              onSuccess={() => router.push("/dashboard/employer/jobs")}
            />
          </div>
        </div>
      </main>
    </>
  );
}
