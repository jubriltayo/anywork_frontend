import { useState, useEffect, useCallback } from "react";
import { JobService } from "@/lib/services/job";
import type { Job, JobSearchFilters } from "@/lib/types/api";

export function useJobs(
  initialPage = 1,
  initialFilters: JobSearchFilters = {}
) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [filters, setFilters] = useState<JobSearchFilters>(initialFilters);

  const searchJobs = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await JobService.getJobs(page, filters);
      setJobs(response.results);
      setTotalCount(response.count);
      setHasNext(response.next !== null);
      setHasPrevious(response.previous !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateFilters = useCallback((newFilters: JobSearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const nextPage = useCallback(() => {
    if (hasNext) {
      setPage((prev) => prev + 1);
    }
  }, [hasNext]);

  const previousPage = useCallback(() => {
    if (hasPrevious) {
      setPage((prev) => Math.max(1, prev - 1));
    }
  }, [hasPrevious]);

  const refresh = useCallback(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    page,
    totalCount,
    hasNext,
    hasPrevious,
    filters,
    pagination: {
      count: totalCount,
      next: hasNext,
      previous: hasPrevious,
    },
    searchJobs,
    updateFilters,
    clearFilters,
    nextPage,
    previousPage,
    refresh,
  };
}

export function useJob(jobId: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await JobService.getJobById(jobId);
        setJob(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  return { job, loading, error };
}
