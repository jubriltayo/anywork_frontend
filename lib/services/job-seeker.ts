import { apiClient } from "@/lib/api/client";
import type {
  PaginatedResponse,
  JobSeeker,
  JobSeekerFormData,
  Resume,
  Application,
  Skill,
  ApplicationFormData,
} from "@/lib/types/api";

export class JobSeekerService {
  // Profile Management
  static async getProfile(userId: string): Promise<JobSeeker> {
    try {
      const jobSeeker = await apiClient.get<JobSeeker>(
        `/jobseekers/${userId}/`
      );

      if (jobSeeker) {
        return jobSeeker;
      }
      throw new Error("Job seeker profile not found");
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch job seeker profile"
      );
    }
  }

  static async updateProfile(
    userId: string,
    data: JobSeekerFormData
  ): Promise<JobSeeker> {
    try {
      const jobSeeker = await apiClient.put<JobSeeker>(
        `/jobseekers/${userId}/`,
        data
      );

      if (jobSeeker) {
        return jobSeeker;
      }
      throw new Error("Failed to update job seeker profile");
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update job seeker profile"
      );
    }
  }

  // Resume Management
  static async getResumes(): Promise<PaginatedResponse<Resume>> {
    try {
      return await apiClient.get<PaginatedResponse<Resume>>("/resumes/");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch resumes"
      );
    }
  }

  static async uploadResume(formData: FormData): Promise<Resume> {
    try {
      const resume = await apiClient.upload<Resume>("/resumes/", formData);

      if (resume) {
        return resume;
      }
      throw new Error("Failed to upload resume");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload resume"
      );
    }
  }

  static async deleteResume(resumeId: string): Promise<void> {
    try {
      await apiClient.delete(`/resumes/${resumeId}/`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete resume"
      );
    }
  }

  // Application Management
  static async getApplications(): Promise<PaginatedResponse<Application>> {
    try {
      return await apiClient.get<PaginatedResponse<Application>>(
        "/applications/"
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch applications"
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

  // Skills Management
  static async getSkills(): Promise<PaginatedResponse<Skill>> {
    try {
      return await apiClient.get<PaginatedResponse<Skill>>("/skills/");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch skills"
      );
    }
  }

  static async addSkill(name: string): Promise<Skill> {
    try {
      const skill = await apiClient.post<Skill>("/skills/", {
        name,
      });

      if (skill) {
        return skill;
      }
      throw new Error("Failed to add skill");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to add skill"
      );
    }
  }

  static async deleteSkill(skillId: string): Promise<void> {
    try {
      await apiClient.delete(`/skills/${skillId}/`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete skill"
      );
    }
  }
}
