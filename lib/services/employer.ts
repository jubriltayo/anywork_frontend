import { apiClient } from "@/lib/api/client";
import type {
  PaginatedResponse,
  Employer,
  EmployerFormData,
  Job,
  Category,
  Location,
  Application,
  JobFormData,
  JobUpdateData,
} from "@/lib/types/api";

export class EmployerService {
  // Profile Management
  static async getProfile(userId: string): Promise<Employer> {
    try {
      const employer = await apiClient.get<Employer>(`/employers/${userId}/`);

      if (employer) {
        return employer;
      }
      throw new Error("Employer profile not found");
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch employer profile"
      );
    }
  }

  static async updateProfile(
    userId: string,
    data: EmployerFormData
  ): Promise<Employer> {
    try {
      const employer = await apiClient.put<Employer>(
        `/employers/${userId}/`,
        data
      );

      if (employer) {
        return employer;
      }
      throw new Error("Failed to update employer profile");
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update employer profile"
      );
    }
  }

  // Categories
  static async getCategories(): Promise<PaginatedResponse<Category>> {
    try {
      return await apiClient.get<PaginatedResponse<Category>>("/categories/");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
    }
  }

  static async createCategory(data: {
    name: string;
    description?: string;
  }): Promise<Category> {
    try {
      const category = await apiClient.post<Category>("/categories/", data);

      if (category) {
        return category;
      }
      throw new Error("Failed to create category");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create category"
      );
    }
  }

  // Locations
  static async getLocations(): Promise<PaginatedResponse<Location>> {
    try {
      return await apiClient.get<PaginatedResponse<Location>>("/locations/");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch locations"
      );
    }
  }

  static async createLocation(data: {
    city: string;
    state: string;
    country: string;
  }): Promise<Location> {
    try {
      const location = await apiClient.post<Location>("/locations/", data);

      if (location) {
        return location;
      }
      throw new Error("Failed to create location");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create location"
      );
    }
  }

  // Job Management
  static async getJobs(): Promise<Job[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Job>>(
        "/employer/jobs/"
      );
      return response.results;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch jobs"
      );
    }
  }

  static async getJobById(jobId: string): Promise<Job> {
    try {
      const job = await apiClient.get<Job>(`/employer/jobs/${jobId}/`);

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
      const job = await apiClient.put<Job>(`/employer/jobs/${jobId}/`, data);

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
      await apiClient.delete(`/employer/jobs/${jobId}/`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete job"
      );
    }
  }

  // Application Management
  static async getApplicationsForJob(
    jobId: string
  ): Promise<PaginatedResponse<Application>> {
    try {
      return await apiClient.get<PaginatedResponse<Application>>(
        "/applications/",
        { job: jobId }
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch applications"
      );
    }
  }

  static async updateApplicationStatus(
    applicationId: string,
    status: "pending" | "reviewed" | "rejected" | "accepted"
  ): Promise<Application> {
    try {
      const application = await apiClient.patch<Application>(
        `/applications/${applicationId}/`,
        { status }
      );

      if (application) {
        return application;
      }
      throw new Error("Failed to update application status");
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update application status"
      );
    }
  }
}
