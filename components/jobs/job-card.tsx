import Link from "next/link";
import type { Job } from "@/lib/types/api";
import { MapPin, Clock, BanknoteIcon, ArrowRight } from "lucide-react";
import { formatJobType, getRelativeTime } from "@/lib/utils/job";

interface JobCardProps {
  job: Job;
}

const JOB_TYPE_STYLES: Record<string, string> = {
  "full-time": "bg-[#e8ff47]/10 text-[#e8ff47]",
  "part-time": "bg-blue-500/15 text-blue-400",
  "remote": "bg-purple-500/15 text-purple-400",
};

export function JobCard({ job }: JobCardProps) {
  const typeStyle =
    JOB_TYPE_STYLES[job.job_type] ?? "bg-white/10 text-white/50";

  const location = `${job.location.city}, ${job.location.state}`;
  const jobType = formatJobType(job.job_type);
  const posted = getRelativeTime(job.posted_at);

  return (
    <Link
      href={`/jobs/${job.job_id}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">

          {/* Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeStyle}`}>
              {jobType}
            </span>

            {!job.is_active && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-white/30">
                Closed
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-lg leading-snug mb-1 group-hover:text-[#e8ff47] transition-colors line-clamp-2">
            {job.title}
          </h3>

          {/* Description */}
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-4">
            {job.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-xs text-white/30">

            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>

            {job.salary_range && (
              <span className="flex items-center gap-1.5">
                <BanknoteIcon className="w-3.5 h-3.5" />
                {job.salary_range}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {posted}
            </span>

            <span className="text-white/20">
              Expires {new Date(job.expires_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="shrink-0 w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/20 group-hover:border-[#e8ff47]/30 group-hover:text-[#e8ff47] transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}