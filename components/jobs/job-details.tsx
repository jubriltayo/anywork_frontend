import type { Job } from "@/lib/types/api";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  Building2,
} from "lucide-react";

interface JobDetailsProps {
  job: Job;
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="card mb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
          <div className="flex items-center gap-2 text-gray-500">
            <Building2 className="w-4 h-4" />
            <span>Company</span>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            job.is_active
              ? "bg-success/10 text-success border border-success"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          {job.is_active ? "Active" : "Closed"}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-border">
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Salary</p>
            <p className="font-semibold">{job.salary_range}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Job Type</p>
            <p className="font-semibold capitalize">{job.job_type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-semibold">Remote</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Posted</p>
            <p className="font-semibold">
              {new Date(job.posted_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">About This Job</h2>
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-foreground">
            {job.description}
          </p>
        </div>
      </div>
    </div>
  );
}
