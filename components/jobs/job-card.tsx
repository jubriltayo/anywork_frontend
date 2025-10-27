import Link from "next/link";
import type { Job } from "@/lib/types/api";
import { MapPin, DollarSign, Briefcase, Calendar, Users } from "lucide-react";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.job_id}`} className="card-hover group block">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          {" "}
          <h3 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 mb-3">
            {job.description}
          </p>
        </div>
        <div className="shrink-0 ml-4">
          {" "}
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              job.is_active ? "bg-accent/10" : "bg-muted"
            }`}
          >
            <Briefcase
              className={`w-6 h-6 ${
                job.is_active ? "text-accent" : "text-muted-foreground"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          {" "}
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-medium truncate">Remote</span>{" "}
        </div>
        <div className="flex items-center gap-2 min-w-0">
          {" "}
          <DollarSign className="w-4 h-4 text-accent shrink-0" />
          <span className="text-sm font-medium truncate">
            {job.salary_range || "Not specified"}
          </span>{" "}
        </div>
        <div className="flex items-center gap-2 min-w-0">
          {" "}
          <Briefcase className="w-4 h-4 text-secondary shrink-0" />
          <span className="text-sm font-medium capitalize truncate">
            {job.job_type}
          </span>{" "}
        </div>
        <div className="flex items-center gap-2 min-w-0">
          {" "}
          <Calendar className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-medium truncate">
            {" "}
            {new Date(job.posted_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {" "}
          <span
            className={`badge ${
              job.is_active ? "badge-accent" : "bg-muted text-muted-foreground"
            }`}
          >
            {job.is_active ? "Active" : "Closed"}
          </span>
          <span className="badge badge-primary">View Details</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
          {" "}
          <Users className="w-4 h-4" />
          <span>5 applied</span>
        </div>
      </div>
    </Link>
  );
}
