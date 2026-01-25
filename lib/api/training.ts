/**
 * Training Service - API calls for training and development management
 * TODO: Connect to actual API endpoints when backend is ready
 */

import { apiClient, ApiResponse } from "./client";
import type {
  TrainingCourse,
  CourseEnrollment,
  DevelopmentPlan,
  CourseCategory,
  CourseStatus,
  EnrollmentStatus,
} from "@/lib/types/training";

// Alias for backward compat
type TrainingEnrollment = CourseEnrollment;
type TrainingCategory = CourseCategory;

// =====================
// Training Courses API
// =====================

export interface CourseFilters {
  category?: TrainingCategory;
  status?: CourseStatus;
  search?: string;
  isMandatory?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CourseListResponse {
  courses: TrainingCourse[];
  total: number;
  page: number;
  pageSize: number;
}

export const trainingCoursesApi = {
  /**
   * Get all training courses
   */
  getAll: (filters?: CourseFilters) =>
    apiClient.get<CourseListResponse>("/training/courses", {
      params: filters as Record<string, string | number | boolean>,
    }),

  /**
   * Get course by ID
   */
  getById: (id: string) => apiClient.get<TrainingCourse>(`/training/courses/${id}`),

  /**
   * Create new course
   */
  create: (data: Omit<TrainingCourse, "id" | "tenantId" | "createdAt" | "updatedAt">) =>
    apiClient.post<TrainingCourse>("/training/courses", data),

  /**
   * Update course
   */
  update: (id: string, data: Partial<TrainingCourse>) =>
    apiClient.put<TrainingCourse>(`/training/courses/${id}`, data),

  /**
   * Delete course
   */
  delete: (id: string) => apiClient.delete<void>(`/training/courses/${id}`),

  /**
   * Publish course
   */
  publish: (id: string) => apiClient.patch<TrainingCourse>(`/training/courses/${id}/publish`, {}),

  /**
   * Archive course
   */
  archive: (id: string) => apiClient.patch<TrainingCourse>(`/training/courses/${id}/archive`, {}),

  /**
   * Get course categories
   */
  getCategories: () => apiClient.get<TrainingCategory[]>("/training/categories"),
};

// =====================
// Training Enrollments API
// =====================

export interface EnrollmentFilters {
  courseId?: string;
  employeeId?: string;
  status?: EnrollmentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface EnrollmentListResponse {
  enrollments: TrainingEnrollment[];
  total: number;
  page: number;
  pageSize: number;
}

export const trainingEnrollmentsApi = {
  /**
   * Get all enrollments
   */
  getAll: (filters?: EnrollmentFilters) =>
    apiClient.get<EnrollmentListResponse>("/training/enrollments", {
      params: filters as Record<string, string | number>,
    }),

  /**
   * Get enrollment by ID
   */
  getById: (id: string) => apiClient.get<TrainingEnrollment>(`/training/enrollments/${id}`),

  /**
   * Get enrollments by employee
   */
  getByEmployee: (employeeId: string) =>
    apiClient.get<TrainingEnrollment[]>(`/training/enrollments/employee/${employeeId}`),

  /**
   * Enroll employee in course
   */
  enroll: (courseId: string, employeeId: string) =>
    apiClient.post<TrainingEnrollment>("/training/enrollments", { courseId, employeeId }),

  /**
   * Bulk enroll employees
   */
  bulkEnroll: (courseId: string, employeeIds: string[]) =>
    apiClient.post<{ enrolled: number; errors: string[] }>("/training/enrollments/bulk", {
      courseId,
      employeeIds,
    }),

  /**
   * Cancel enrollment
   */
  cancel: (id: string, reason?: string) =>
    apiClient.patch<TrainingEnrollment>(`/training/enrollments/${id}/cancel`, { reason }),

  /**
   * Complete enrollment
   */
  complete: (id: string, score?: number, feedback?: string) =>
    apiClient.patch<TrainingEnrollment>(`/training/enrollments/${id}/complete`, {
      score,
      feedback,
    }),

  /**
   * Update progress
   */
  updateProgress: (id: string, progress: number) =>
    apiClient.patch<TrainingEnrollment>(`/training/enrollments/${id}/progress`, { progress }),
};

// =====================
// Development Plans API
// =====================

export interface DevelopmentPlanFilters {
  employeeId?: string;
  status?: "draft" | "active" | "completed" | "cancelled";
  year?: number;
  page?: number;
  pageSize?: number;
}

export interface DevelopmentPlanListResponse {
  plans: DevelopmentPlan[];
  total: number;
  page: number;
  pageSize: number;
}

export const developmentPlansApi = {
  /**
   * Get all development plans
   */
  getAll: (filters?: DevelopmentPlanFilters) =>
    apiClient.get<DevelopmentPlanListResponse>("/training/development-plans", {
      params: filters as Record<string, string | number>,
    }),

  /**
   * Get plan by ID
   */
  getById: (id: string) => apiClient.get<DevelopmentPlan>(`/training/development-plans/${id}`),

  /**
   * Get plan by employee
   */
  getByEmployee: (employeeId: string) =>
    apiClient.get<DevelopmentPlan[]>(`/training/development-plans/employee/${employeeId}`),

  /**
   * Create plan
   */
  create: (data: Omit<DevelopmentPlan, "id" | "tenantId" | "createdAt" | "updatedAt">) =>
    apiClient.post<DevelopmentPlan>("/training/development-plans", data),

  /**
   * Update plan
   */
  update: (id: string, data: Partial<DevelopmentPlan>) =>
    apiClient.put<DevelopmentPlan>(`/training/development-plans/${id}`, data),

  /**
   * Delete plan
   */
  delete: (id: string) => apiClient.delete<void>(`/training/development-plans/${id}`),

  /**
   * Activate plan
   */
  activate: (id: string) =>
    apiClient.patch<DevelopmentPlan>(`/training/development-plans/${id}/activate`, {}),

  /**
   * Complete plan
   */
  complete: (id: string, notes?: string) =>
    apiClient.patch<DevelopmentPlan>(`/training/development-plans/${id}/complete`, { notes }),
};

// Unified Training API export
export const trainingApi = {
  courses: trainingCoursesApi,
  enrollments: trainingEnrollmentsApi,
  developmentPlans: developmentPlansApi,
};

export default trainingApi;
