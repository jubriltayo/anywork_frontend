import { useState, useEffect, useCallback } from "react";
import { ApplicationService } from "@/lib/services/application";
import type { Application } from "@/lib/types/api";

interface UseApplicationsOptions {
  jobId?: string;
  status?: Application["status"];
  autoFetch?: boolean;
}

export function useApplications(
  page = 1,
  options: UseApplicationsOptions = {}
) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);

  const { jobId, status, autoFetch = true } = options;

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters: Record<string, string> = {};
      if (jobId) filters.job = jobId;
      if (status) filters.status = status;

      const response = await ApplicationService.getApplications(
        currentPage,
        filters
      );

      setApplications(response.results);
      setTotalCount(response.count);
      setHasNext(response.next !== null);
      setHasPrevious(response.previous !== null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, jobId, status]);

  useEffect(() => {
    if (autoFetch) {
      fetchApplications();
    }
  }, [autoFetch, fetchApplications]);

  const nextPage = () => {
    if (hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (hasPrevious) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  const updateStatus = async (
    applicationId: string,
    newStatus: Application["status"]
  ) => {
    try {
      await ApplicationService.updateApplicationStatus(
        applicationId,
        newStatus
      );
      await fetchApplications();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update status",
      };
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      await ApplicationService.deleteApplication(applicationId);
      await fetchApplications();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to delete application",
      };
    }
  };

  const refresh = () => {
    fetchApplications();
  };

  return {
    applications,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
    currentPage,
    nextPage,
    previousPage,
    updateStatus,
    deleteApplication,
    refresh,
  };
}

export function useApplication(applicationId: string) {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplication = useCallback(async () => {
    if (!applicationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await ApplicationService.getApplicationById(
        applicationId
      );
      setApplication(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch application"
      );
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const updateStatus = async (newStatus: Application["status"]) => {
    try {
      await ApplicationService.updateApplicationStatus(
        applicationId,
        newStatus
      );
      await fetchApplication();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update status",
      };
    }
  };

  return {
    application,
    loading,
    error,
    updateStatus,
    refresh: fetchApplication,
  };
}
