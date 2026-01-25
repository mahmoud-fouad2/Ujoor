/**
 * Departments Service - API calls for department management
 */

import apiClient, { ApiResponse } from "./client";
import type { Department } from "@/lib/types/core-hr";

export interface DepartmentFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const departmentsService = {
  /**
   * Get all departments
   */
  async getAll(filters?: DepartmentFilters): Promise<ApiResponse<Department[]>> {
    return apiClient.get<Department[]>("/departments", { params: filters as Record<string, string | number> });
  },

  /**
   * Get department by ID
   */
  async getById(id: string): Promise<ApiResponse<Department>> {
    return apiClient.get<Department>(`/departments/${id}`);
  },

  /**
   * Create new department
   */
  async create(data: Omit<Department, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Department>> {
    return apiClient.post<Department>("/departments", data);
  },

  /**
   * Update department
   */
  async update(id: string, data: Partial<Department>): Promise<ApiResponse<Department>> {
    return apiClient.put<Department>(`/departments/${id}`, data);
  },

  /**
   * Delete department
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/departments/${id}`);
  },

  /**
   * Get department tree/hierarchy
   */
  async getTree(): Promise<ApiResponse<Department[]>> {
    return apiClient.get<Department[]>("/departments/tree");
  },

  /**
   * Get department stats
   */
  async getStats(id: string): Promise<ApiResponse<{
    employeeCount: number;
    avgSalary: number;
    attendanceRate: number;
  }>> {
    return apiClient.get(`/departments/${id}/stats`);
  },
};

export default departmentsService;
