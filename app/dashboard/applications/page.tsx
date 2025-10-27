"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/hooks/use-auth";
import { useApplications } from "@/lib/hooks/use-applications";
import { ApplicationsList } from "@/components/dashboard/applications-list";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ApplicationsPage() {
  const { requireAuth } = useAuth();
  const { applications, loading } = useApplications();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container-main max-w-4xl">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold mb-8">My Applications</h1>

          <ApplicationsList applications={applications} loading={loading} />
        </div>
      </main>
    </>
  );
}
