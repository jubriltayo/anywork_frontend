import Link from "next/link";
import type { Job } from "@/lib/types/api";
import { Briefcase, Calendar, Clock, BanknoteIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  // Helper function to format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) return "Today";
    if (diffInHours < 48) return "Yesterday";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <Link
      href={`/jobs/${job.job_id}`}
      className="group block p-6 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {job.description}
          </p>
        </div>
        <div className="shrink-0 ml-4">
          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Job Details Grid - Type, Salary, Posted */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Job Type */}
        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm font-medium text-foreground capitalize truncate">
              {job.job_type.replace("-", " ")}
            </p>
          </div>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
          <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center shrink-0">
            <BanknoteIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Salary</p>
            <p className="text-sm font-medium text-foreground truncate">
              {job.salary_range || "Not specified"}
            </p>
          </div>
        </div>

        {/* Posted Date */}
        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Posted</p>
            <p className="text-sm font-medium text-foreground truncate">
              {formatRelativeTime(job.posted_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer - Status Badge */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            job.is_active
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          )}
        >
          {job.is_active ? "🟢 Hiring" : "🔴 Closed"}
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Expires {new Date(job.expires_at).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
