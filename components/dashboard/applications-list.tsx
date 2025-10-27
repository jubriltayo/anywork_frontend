import Link from "next/link";
import { ApplicationStatus } from "./application-status";
import type { Application } from "@/lib/types/api";
import { Calendar, FileText } from "lucide-react";

interface ApplicationsListProps {
  applications: Application[];
  loading: boolean;
}

export function ApplicationsList({
  applications,
  loading,
}: ApplicationsListProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="card text-center py-12">
        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted mb-4">No applications yet</p>
        <Link href="/jobs" className="text-primary hover:underline font-medium">
          {" "}
          Browse jobs and apply now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.application_id} className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Job Application</h3>
              <p className="text-muted text-sm">{app.cover_letter}</p>
            </div>
            <ApplicationStatus status={app.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(app.applied_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
