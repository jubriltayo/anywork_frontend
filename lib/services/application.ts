import { apiClient } from "@/lib/api/client";
import type {
  PaginatedResponse,
  Application,
  ApplicationFormData,
  ApplicationUpdateData,
} from "@/lib/types/api";

export class ApplicationService {
  static async getApplications(
    page = 1,
    filters: {
      status?: string;
      job?: string;
      job_seeker?: string;
    } = {}
  ): Promise<PaginatedResponse<Application>> {
    try {
      const params: Record<string, unknown> = { page, ...filters };
      return await apiClient.get<PaginatedResponse<Application>>(
        "/applications/",
        params
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch applications"
      );
    }
  }

  static async getApplicationById(applicationId: string): Promise<Application> {
    try {
      const application = await apiClient.get<Application>(
        `/applications/${applicationId}/`
      );

      if (application) {
        return application;
      }
      throw new Error("Application not found");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch application"
      );
    }
  }

  static async createApplication(
    data: ApplicationFormData
  ): Promise<Application> {
    try {
      const application = await apiClient.post<Application>(
        "/applications/",
        data
      );

      if (application) {
        return application;
      }
      throw new Error("Failed to create application");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create application"
      );
    }
  }

  static async updateApplicationStatus(
    applicationId: string,
    status: Application["status"]
  ): Promise<Application> {
    try {
      const application = await apiClient.patch<Application>(
        `/applications/${applicationId}/`,
        { status }
      );

      if (application) {
        return application;
      }
      throw new Error("Failed to update application");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update application"
      );
    }
  }

  static async updateApplication(
    applicationId: string,
    data: ApplicationUpdateData
  ): Promise<Application> {
    try {
      const application = await apiClient.patch<Application>(
        `/applications/${applicationId}/`,
        data
      );

      if (application) {
        return application;
      }
      throw new Error("Failed to update application");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update application"
      );
    }
  }

  static async deleteApplication(applicationId: string): Promise<void> {
    try {
      await apiClient.delete(`/applications/${applicationId}/`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete application"
      );
    }
  }

  static async getApplicationsByJob(
    jobId: string
  ): Promise<PaginatedResponse<Application>> {
    try {
      return await apiClient.get<PaginatedResponse<Application>>(
        "/applications/",
        { job: jobId }
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch job applications"
      );
    }
  }
}
