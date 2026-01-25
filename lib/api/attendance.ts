/**
 * Attendance Service - API calls for attendance management
 */

import apiClient, { ApiResponse } from "./client";
import type { AttendanceRecord, AttendanceRequest, Shift, Holiday } from "@/lib/types/attendance";

export interface AttendanceFilters {
  employeeId?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  totalWorkHours: number;
  avgWorkHours: number;
  punctualityRate: number;
}

export const attendanceService = {
  // ============ Attendance Records ============
  
  /**
   * Get attendance records with filters
   */
  async getRecords(filters?: AttendanceFilters): Promise<ApiResponse<AttendanceRecord[]>> {
    return apiClient.get<AttendanceRecord[]>("/attendance", { params: filters as Record<string, string | number> });
  },

  /**
   * Get single attendance record
   */
  async getRecord(id: string): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.get<AttendanceRecord>(`/attendance/${id}`);
  },

  /**
   * Check in employee
   */
  async checkIn(data: {
    employeeId: string;
    location?: { lat: number; lng: number };
    notes?: string;
  }): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.post<AttendanceRecord>("/attendance/check-in", data);
  },

  /**
   * Check out employee
   */
  async checkOut(data: {
    employeeId: string;
    location?: { lat: number; lng: number };
    notes?: string;
  }): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.post<AttendanceRecord>("/attendance/check-out", data);
  },

  /**
   * Get attendance statistics
   */
  async getStats(filters?: {
    employeeId?: string;
    departmentId?: string;
    month?: string;
  }): Promise<ApiResponse<AttendanceStats>> {
    return apiClient.get<AttendanceStats>("/attendance/stats", { params: filters });
  },

  /**
   * Get monthly attendance calendar
   */
  async getMonthlyCalendar(employeeId: string, year: number, month: number): Promise<ApiResponse<AttendanceRecord[]>> {
    return apiClient.get<AttendanceRecord[]>(`/attendance/calendar/${employeeId}`, {
      params: { year, month },
    });
  },

  // ============ Shifts ============

  /**
   * Get all shifts
   */
  async getShifts(): Promise<ApiResponse<Shift[]>> {
    return apiClient.get<Shift[]>("/shifts");
  },

  /**
   * Create shift
   */
  async createShift(data: Omit<Shift, "id">): Promise<ApiResponse<Shift>> {
    return apiClient.post<Shift>("/shifts", data);
  },

  /**
   * Update shift
   */
  async updateShift(id: string, data: Partial<Shift>): Promise<ApiResponse<Shift>> {
    return apiClient.put<Shift>(`/shifts/${id}`, data);
  },

  /**
   * Delete shift
   */
  async deleteShift(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/shifts/${id}`);
  },

  /**
   * Assign shift to employees
   */
  async assignShift(shiftId: string, employeeIds: string[]): Promise<ApiResponse<void>> {
    return apiClient.post(`/shifts/${shiftId}/assign`, { employeeIds });
  },

  // ============ Attendance Requests ============

  /**
   * Get attendance requests
   */
  async getRequests(filters?: {
    employeeId?: string;
    status?: string;
    type?: string;
  }): Promise<ApiResponse<AttendanceRequest[]>> {
    return apiClient.get<AttendanceRequest[]>("/attendance/requests", { params: filters });
  },

  /**
   * Create attendance request
   */
  async createRequest(data: Omit<AttendanceRequest, "id" | "status" | "createdAt">): Promise<ApiResponse<AttendanceRequest>> {
    return apiClient.post<AttendanceRequest>("/attendance/requests", data);
  },

  /**
   * Approve attendance request
   */
  async approveRequest(id: string, comment?: string): Promise<ApiResponse<AttendanceRequest>> {
    return apiClient.post<AttendanceRequest>(`/attendance/requests/${id}/approve`, { comment });
  },

  /**
   * Reject attendance request
   */
  async rejectRequest(id: string, reason: string): Promise<ApiResponse<AttendanceRequest>> {
    return apiClient.post<AttendanceRequest>(`/attendance/requests/${id}/reject`, { reason });
  },

  // ============ Holidays ============

  /**
   * Get holidays
   */
  async getHolidays(year?: number): Promise<ApiResponse<Holiday[]>> {
    return apiClient.get<Holiday[]>("/holidays", { params: year ? { year } : undefined });
  },

  /**
   * Create holiday
   */
  async createHoliday(data: Omit<Holiday, "id">): Promise<ApiResponse<Holiday>> {
    return apiClient.post<Holiday>("/holidays", data);
  },

  /**
   * Delete holiday
   */
  async deleteHoliday(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/holidays/${id}`);
  },

  // ============ Reports ============

  /**
   * Generate attendance report
   */
  async generateReport(filters: {
    startDate: string;
    endDate: string;
    departmentId?: string;
    format?: "json" | "csv" | "pdf";
  }): Promise<ApiResponse<Blob | AttendanceRecord[]>> {
    return apiClient.get("/attendance/reports", { params: filters });
  },
};

export default attendanceService;
