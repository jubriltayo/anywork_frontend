// components/employer/applications-manager.tsx
import type { Job, Application } from "@/lib/types/api";
import { ApplicationStatus } from "@/components/dashboard/application-status";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Mail,
  Phone,
  Building,
  MapPin,
  Clock,
  Calendar,
  User,
} from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils";

interface ApplicationsManagerProps {
  jobs: Job[];
  applications: Application[];
  selectedJob: string | null;
  onJobSelect: (jobId: string) => void;
  onStatusChange: (
    applicationId: string,
    status: Application["status"]
  ) => void;
}

export function ApplicationsManager({
  jobs,
  applications,
  selectedJob,
  onJobSelect,
  onStatusChange,
}: ApplicationsManagerProps) {
  const selectedJobData = jobs.find((job) => job.job_id === selectedJob);

  function isLocation(obj: unknown): obj is Location {
    return typeof obj === "object" && obj !== null && "city" in obj;
  }

  // Helper function to safely get location string
  const getLocationString = (job: Job): string => {
    if (typeof job.location === "string") {
      return job.location;
    }

    if (isLocation(job.location)) {
      return `${job.location.city}, ${job.location.state || ""}`.trim();
    }

    if (job.location_details?.city) {
      return `${job.location_details.city}, ${
        job.location_details.state || ""
      }`.trim();
    }

    return "Remote";
  };

  // Helper function to safely get job title
  const getJobTitle = (job: Job): string => {
    return job.title || "Untitled Job";
  };

  // Calculate application statistics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const acceptedApplications = applications.filter(
    (app) => app.status === "accepted"
  ).length;
  const rejectedApplications = applications.filter(
    (app) => app.status === "rejected"
  ).length;
  const reviewedApplications = applications.filter(
    (app) => app.status === "reviewed"
  ).length;

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Job List Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <h3 className="font-semibold text-lg mb-4">Your Job Postings</h3>
          <div className="space-y-3">
            {jobs.map((job) => {
              // Count applications for this specific job
              const jobApplications = applications.filter(
                (app) => app.job === job.job_id
              );
              const applicationCount = jobApplications.length;

              return (
                <button
                  key={job.job_id}
                  onClick={() => onJobSelect(job.job_id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selectedJob === job.job_id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:bg-accent/50 hover:border-accent"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm leading-tight">
                      {getJobTitle(job)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {applicationCount}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span className="truncate">{getLocationString(job)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(job.posted_at)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Applications Main Content */}
      <div className="lg:col-span-3">
        {selectedJobData && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {getJobTitle(selectedJobData)}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{getLocationString(selectedJobData)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  Posted {formatRelativeTime(selectedJobData.posted_at)}
                </span>
              </div>
              <Badge variant="outline">
                {applications.length} application
                {applications.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="card text-center py-16">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {selectedJob
                ? "No one has applied to this job yet. Share your job posting to attract candidates."
                : "Select a job to view applications."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Application Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {totalApplications}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {pendingApplications}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {reviewedApplications}
                </div>
                <div className="text-sm text-muted-foreground">Reviewed</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {acceptedApplications}
                </div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-red-500">
                  {rejectedApplications}
                </div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.application_id}
                  application={application}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Application Card Component
interface ApplicationCardProps {
  application: Application;
  onStatusChange: (
    applicationId: string,
    status: Application["status"]
  ) => void;
}

function ApplicationCard({
  application,
  onStatusChange,
}: ApplicationCardProps) {
  const applicantDetails = application.job_seeker_details;
  const resumeDetails = application.resume_details;

  const handleDownloadResume = () => {
    if (!resumeDetails?.file_url) {
      console.error("No resume file available");
      return;
    }

    const link = document.createElement("a");
    link.href = resumeDetails.file_url;
    link.download =
      resumeDetails.file_name ||
      `resume-${
        applicantDetails?.full_name?.replace(/\s+/g, "-").toLowerCase() ||
        "applicant"
      }.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewResume = () => {
    if (!resumeDetails?.file_url) {
      console.error("No resume file available");
      return;
    }
    window.open(resumeDetails.file_url, "_blank");
  };

  // Show loading state if applicant details are not available
  if (!applicantDetails) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 hover:shadow-md transition-shadow duration-200 border">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Applicant Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {applicantDetails.full_name}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{applicantDetails.email}</span>
                    </div>
                    {applicantDetails.phone_number && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{applicantDetails.phone_number}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Applied {formatRelativeTime(application.applied_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <ApplicationStatus status={application.status} />
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mb-4">
            <h4 className="font-medium mb-2 text-sm text-muted-foreground">
              Cover Letter
            </h4>
            <p className="text-sm leading-relaxed bg-muted/30 p-3 rounded-lg border">
              {application.cover_letter || "No cover letter provided."}
            </p>
          </div>

          {/* Resume Actions */}
          {resumeDetails?.file_url ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviewResume}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Preview Resume
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadResume}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </Button>
              <span className="text-xs text-muted-foreground">
                {resumeDetails.file_name}
              </span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              No resume uploaded
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
          {application.status === "pending" && (
            <>
              <Button
                onClick={() =>
                  onStatusChange(application.application_id, "accepted")
                }
                className="w-full"
                size="sm"
              >
                Accept
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  onStatusChange(application.application_id, "reviewed")
                }
                className="w-full"
                size="sm"
              >
                Mark Reviewed
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  onStatusChange(application.application_id, "rejected")
                }
                className="w-full"
                size="sm"
              >
                Reject
              </Button>
            </>
          )}

          {application.status === "reviewed" && (
            <>
              <Button
                onClick={() =>
                  onStatusChange(application.application_id, "accepted")
                }
                className="w-full"
                size="sm"
              >
                Hire
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  onStatusChange(application.application_id, "rejected")
                }
                className="w-full"
                size="sm"
              >
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  onStatusChange(application.application_id, "pending")
                }
                className="w-full"
                size="sm"
              >
                Mark Pending
              </Button>
            </>
          )}

          {(application.status === "accepted" ||
            application.status === "rejected") && (
            <div className="text-center space-y-2">
              <Badge
                variant={
                  application.status === "accepted" ? "default" : "destructive"
                }
                className="text-sm w-full justify-center"
              >
                {application.status === "accepted" ? "Hired" : "Rejected"}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {formatDate(application.applied_at)}
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  onStatusChange(application.application_id, "reviewed")
                }
                className="w-full"
                size="sm"
              >
                Reopen
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
