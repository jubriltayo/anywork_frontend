import type { Job, Application } from "@/lib/types/api";
import { ApplicationStatus } from "@/components/dashboard/application-status";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationsManagerProps {
  jobs: Job[];
  applications: Application[];
  selectedJob: string | null;
  onJobSelect: (jobId: string) => void;
  onStatusChange: (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => void;
}

export function ApplicationsManager({
  jobs,
  applications,
  selectedJob,
  onJobSelect,
  onStatusChange,
}: ApplicationsManagerProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Job List */}
      <div className="md:col-span-1">
        <h3 className="font-semibold mb-4">Your Jobs</h3>
        <div className="space-y-2">
          {jobs.map((job) => (
            <button
              key={job.job_id}
              onClick={() => onJobSelect(job.job_id)}
              className={`w-full text-left p-3 rounded-lg transition ${
                selectedJob === job.job_id
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <p className="font-medium text-sm truncate">{job.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Applications */}
      <div className="md:col-span-3">
        {applications.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted">No applications for this job yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.application_id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Application</h4>
                    <p className="text-muted text-sm">{app.cover_letter}</p>
                  </div>
                  <ApplicationStatus status={app.status} />
                </div>

                {app.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        onStatusChange(app.application_id, "accepted")
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onStatusChange(app.application_id, "rejected")
                      }
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
