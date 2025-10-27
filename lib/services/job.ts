import { apiClient } from "@/lib/api/client";
import type {
  PaginatedResponse,
  Job,
  JobFormData,
  JobUpdateData,
  JobSearchFilters,
} from "@/lib/types/api";

export class JobService {
  static async getJobs(
    page = 1,
    filters: JobSearchFilters = {}
  ): Promise<PaginatedResponse<Job>> {
    try {
      const params: Record<string, unknown> = { page, ...filters };
      return await apiClient.get<PaginatedResponse<Job>>("/jobs/", params);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch jobs"
      );
    }
  }

  static async getJobById(jobId: string): Promise<Job> {
    try {
      const job = await apiClient.get<Job>(`/jobs/${jobId}/`);

      if (job) {
        return job;
      }
      throw new Error("Job not found");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch job"
      );
    }
  }

  static async createJob(data: JobFormData): Promise<Job> {
    try {
      const job = await apiClient.post<Job>("/jobs/", data);

      if (job) {
        return job;
      }
      throw new Error("Failed to create job");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create job"
      );
    }
  }

  static async updateJob(jobId: string, data: JobUpdateData): Promise<Job> {
    try {
      const job = await apiClient.patch<Job>(`/jobs/${jobId}/`, data);

      if (job) {
        return job;
      }
      throw new Error("Failed to update job");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update job"
      );
    }
  }

  static async deleteJob(jobId: string): Promise<void> {
    try {
      await apiClient.delete(`/jobs/${jobId}/`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete job"
      );
    }
  }

  static async searchJobs(
    query: string,
    page = 1
  ): Promise<PaginatedResponse<Job>> {
    try {
      return await this.getJobs(page, { search: query });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to search jobs"
      );
    }
  }
}
