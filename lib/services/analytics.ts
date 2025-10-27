import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse, Analytics } from "@/lib/types/api";

export class AnalyticsService {
  static async getAnalytics(): Promise<PaginatedResponse<Analytics>> {
    try {
      return await apiClient.get<PaginatedResponse<Analytics>>("/analytics/");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch analytics"
      );
    }
  }

  static async getAnalyticsById(analyticsId: string): Promise<Analytics> {
    try {
      const analytics = await apiClient.get<Analytics>(
        `/analytics/${analyticsId}/`
      );

      if (analytics) {
        return analytics;
      }
      throw new Error("Analytics not found");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch analytics"
      );
    }
  }

  static async getJobAnalytics(
    jobId: string
  ): Promise<PaginatedResponse<Analytics>> {
    try {
      return await apiClient.get<PaginatedResponse<Analytics>>("/analytics/", {
        job: jobId,
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch job analytics"
      );
    }
  }
}
