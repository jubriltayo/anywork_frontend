// Base API Types
export interface BaseResponse<T = unknown> {
  status: string;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Auth Types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: "job_seeker" | "employer";
}

// User Types
export interface User {
  user_id: string;
  email: string;
  role: "job_seeker" | "employer" | "admin";
  created_at: string;
  updated_at: string;
}

// Job Seeker Types
export interface JobSeeker {
  user: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface JobSeekerFormData {
  first_name: string;
  last_name: string;
  phone_number?: string;
}

// Employer Types
export interface Employer {
  user: string;
  company_name: string;
  company_description?: string;
  website?: string;
}

export interface EmployerFormData {
  company_name: string;
  company_description?: string | null;
  website?: string | null;
}

// Category Types
export interface Category {
  category_id: string;
  name: string;
  description: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

// Location Types
export interface Location {
  location_id: string;
  city: string;
  state: string;
  country: string;
}

export interface LocationFormData {
  city: string;
  state: string;
  country: string;
}

// Job Types
export interface Job {
  job_id: string;
  title: string;
  description: string;
  salary_range?: string;
  job_type: "full-time" | "part-time" | "remote";
  posted_at: string;
  expires_at: string;
  is_active: boolean;
  employer: string;
  location: string | Location;
  category: string | Location;

  location_details?: Location;
  category_details?: Category;
  employer_details?: {
    company_name: string;
    company_description?: string;
    website?: string;
  };
}

export interface JobFormData {
  title: string;
  description: string;
  location: string;
  category: string;
  salary_range?: string;
  job_type: "full-time" | "part-time" | "remote";
  expires_at: string;
}

export interface JobUpdateData {
  title?: string;
  description?: string;
  location?: string;
  category?: string;
  salary_range?: string;
  job_type?: "full-time" | "part-time" | "remote";
  expires_at?: string;
  is_active?: boolean;
}

// Application Types
export interface Application {
  application_id: string;
  cover_letter: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
  applied_at: string;
  job_seeker: string;
  job: string | Job;
  resume: string;

  job_seeker_details?: {
    first_name: string;
    last_name: string;
    full_name: string;
    phone_number?: string;
    email: string;
  };
  resume_details?: {
    resume_id: string;
    file_url: string;
    file_name: string;
    uploaded_at: string;
  };

  job_details?: Job;
}

export interface ApplicationFormData {
  job_seeker: string;
  job: string;
  resume: string;
  cover_letter: string;
}

export interface ApplicationUpdateData {
  status?: "pending" | "reviewed" | "rejected" | "accepted";
  cover_letter?: string;
}

// Resume Types
export interface Resume {
  resume_id: string;
  file_path: string;
  checksum: string;
  uploaded_at: string;
  job_seeker: string;
}

export interface ResumeUploadData {
  job_seeker: string;
  file: File;
}

// Notification Types
export interface Notification {
  notification_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user: string;
}

export interface NotificationFormData {
  message: string;
  user: string;
  is_read?: boolean;
}

export interface NotificationUpdateData {
  is_read?: boolean;
  message?: string;
}

// Skill Types
export interface Skill {
  skill_id: string;
  name: string;
  user: string;
}

export interface SkillFormData {
  name: string;
}

// Analytics Types
export interface Analytics {
  analytics_id: string;
  views: number;
  applications: number;
  date: string;
  job: string;
}

// Search and Filter Types
export interface JobSearchFilters {
  search?: string;
  job_type?: string;
  salary_min?: string;
  salary_max?: string;
  location?: string;
  category?: string;
  page?: number;
}

export interface ApplicationFilters {
  status?: string;
  job?: string;
  job_seeker?: string;
  page?: number;
}
