/**
 * Employees Service - API calls for employee management
 */

import apiClient, { ApiResponse } from "./client";
import type { Employee } from "@/lib/types/core-hr";

export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  page: number;
  pageSize: number;
}

export const employeesService = {
  /**
   * Get all employees with optional filters
   */
  async getAll(filters?: EmployeeFilters): Promise<ApiResponse<EmployeeListResponse>> {
    return apiClient.get<EmployeeListResponse>("/employees", { params: filters as Record<string, string | number> });
  },

  /**
   * Get single employee by ID
   */
  async getById(id: string): Promise<ApiResponse<Employee>> {
    return apiClient.get<Employee>(`/employees/${id}`);
  },

  /**
   * Create new employee
   */
  async create(data: Omit<Employee, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Employee>> {
    return apiClient.post<Employee>("/employees", data);
  },

  /**
   * Update employee
   */
  async update(id: string, data: Partial<Employee>): Promise<ApiResponse<Employee>> {
    return apiClient.put<Employee>(`/employees/${id}`, data);
  },

  /**
   * Delete employee
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/employees/${id}`);
  },

  /**
   * Get employees by department
   */
  async getByDepartment(departmentId: string): Promise<ApiResponse<Employee[]>> {
    return apiClient.get<Employee[]>(`/departments/${departmentId}/employees`);
  },

  /**
   * Upload employee photo
   */
  async uploadPhoto(employeeId: string, file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("photo", file);
    return apiClient.upload<{ url: string }>(`/employees/${employeeId}/photo`, formData);
  },

  /**
   * Import employees from CSV
   */
  async importCSV(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.upload(`/employees/import`, formData);
  },

  /**
   * Export employees to CSV
   */
  async exportCSV(filters?: EmployeeFilters): Promise<ApiResponse<Blob>> {
    return apiClient.get<Blob>("/employees/export", { 
      params: filters as Record<string, string | number>,
      headers: { Accept: "text/csv" }
    });
  },
};

export default employeesService;
