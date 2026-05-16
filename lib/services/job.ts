import { apiClient } from "@/lib/api/client";
import type {
  PaginatedResponse,
  Job,
  JobLocation,
  Category,
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
      return await apiClient.get<PaginatedResponse<Job>>("/jobs/", {
        page,
        ...filters,
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch jobs"
      );
    }
  }

  static async getJobById(jobId: string): Promise<Job> {
    try {
      return await apiClient.get<Job>(`/jobs/${jobId}/`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch job"
      );
    }
  }

  static async createJob(data: JobFormData): Promise<Job> {
    try {
      return await apiClient.post<Job>("/jobs/", data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create job"
      );
    }
  }

  static async updateJob(
    jobId: string,
    data: JobUpdateData
  ): Promise<Job> {
    try {
      return await apiClient.patch<Job>(`/jobs/${jobId}/`, data);
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

  static async getLocations(): Promise<JobLocation[]> {
    try {
      const response =
        await apiClient.get<PaginatedResponse<JobLocation>>("/locations/");

      return response.results ?? [];
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch locations"
      );
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const response =
        await apiClient.get<PaginatedResponse<Category>>("/categories/");

      return response.results ?? [];
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
    }
  }
}