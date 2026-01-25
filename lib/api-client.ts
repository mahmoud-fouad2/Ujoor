/**
 * API Client Utilities
 */

const API_BASE = "/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }

  return data;
}

// Employee API
export const employeesApi = {
  list: (params?: { page?: number; limit?: number; search?: string; department?: string; status?: string }) =>
    apiRequest<any[]>("/employees", { params }),
  
  get: (id: string) =>
    apiRequest<any>(`/employees/${id}`),
  
  create: (data: any) =>
    apiRequest<any>("/employees", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<void>(`/employees/${id}`, { method: "DELETE" }),
};

// Department API
export const departmentsApi = {
  list: () => apiRequest<any[]>("/departments"),
  
  get: (id: string) => apiRequest<any>(`/departments/${id}`),
  
  create: (data: any) =>
    apiRequest<any>("/departments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<void>(`/departments/${id}`, { method: "DELETE" }),
};

// Attendance API
export const attendanceApi = {
  list: (params?: { date?: string; employeeId?: string; page?: number; limit?: number }) =>
    apiRequest<any[]>("/attendance", { params }),
  
  checkIn: (data: { employeeId?: string; location?: string; notes?: string }) =>
    apiRequest<any>("/attendance", {
      method: "POST",
      body: JSON.stringify({ type: "CHECK_IN", ...data }),
    }),
  
  checkOut: (data: { employeeId?: string; location?: string; notes?: string }) =>
    apiRequest<any>("/attendance", {
      method: "POST",
      body: JSON.stringify({ type: "CHECK_OUT", ...data }),
    }),
};

// Leave API
export const leavesApi = {
  list: (params?: { status?: string; employeeId?: string; page?: number; limit?: number }) =>
    apiRequest<any[]>("/leaves", { params }),
  
  get: (id: string) => apiRequest<any>(`/leaves/${id}`),
  
  create: (data: any) =>
    apiRequest<any>("/leaves", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  approve: (id: string, notes?: string) =>
    apiRequest<any>(`/leaves/${id}`, {
      method: "PUT",
      body: JSON.stringify({ action: "APPROVE", notes }),
    }),
  
  reject: (id: string, notes?: string) =>
    apiRequest<any>(`/leaves/${id}`, {
      method: "PUT",
      body: JSON.stringify({ action: "REJECT", notes }),
    }),
  
  cancel: (id: string) =>
    apiRequest<void>(`/leaves/${id}`, { method: "DELETE" }),
};

// Leave Types API
export const leaveTypesApi = {
  list: () => apiRequest<any[]>("/leave-types"),
  
  create: (data: any) =>
    apiRequest<any>("/leave-types", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Shifts API
export const shiftsApi = {
  list: () => apiRequest<any[]>("/shifts"),
  
  get: (id: string) => apiRequest<any>(`/shifts/${id}`),
  
  create: (data: any) =>
    apiRequest<any>("/shifts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/shifts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<void>(`/shifts/${id}`, { method: "DELETE" }),
};

// Job Titles API
export const jobTitlesApi = {
  list: () => apiRequest<any[]>("/job-titles"),
  
  get: (id: string) => apiRequest<any>(`/job-titles/${id}`),
  
  create: (data: any) =>
    apiRequest<any>("/job-titles", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/job-titles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<void>(`/job-titles/${id}`, { method: "DELETE" }),
};

// Documents API
export const documentsApi = {
  list: (params?: { employeeId?: string; category?: string }) =>
    apiRequest<any[]>("/documents", { params }),
  
  get: (id: string) => apiRequest<any>(`/documents/${id}`),
  
  upload: async (formData: FormData) => {
    const response = await fetch(`${API_BASE}/documents`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<void>(`/documents/${id}`, { method: "DELETE" }),
};

// Holidays API
export const holidaysApi = {
  list: (params?: { year?: number }) =>
    apiRequest<any[]>("/holidays", { params }),
  
  get: (id: string) => apiRequest<any>(`/holidays/${id}`),
  
  create: (data: any) =>
    apiRequest<any>("/holidays", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/holidays/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<void>(`/holidays/${id}`, { method: "DELETE" }),
};

// Announcements API
export const announcementsApi = {
  list: (params?: { isPublished?: boolean; priority?: string }) =>
    apiRequest<any[]>("/announcements", { params }),
  
  get: (id: string) => apiRequest<any>(`/announcements/${id}`),
  
  create: (data: any) =>
    apiRequest<any>("/announcements", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<void>(`/announcements/${id}`, { method: "DELETE" }),
  
  markAsRead: (id: string) =>
    apiRequest<void>(`/announcements/${id}/read`, { method: "POST" }),
};

// Tenants API (Super Admin only)
export const tenantsApi = {
  list: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    apiRequest<any[]>("/tenants", { params }),
  
  get: (id: string) => apiRequest<any>(`/tenants/${id}`),
  
  create: (data: any) =>
    apiRequest<any>("/tenants", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/tenants/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<void>(`/tenants/${id}`, { method: "DELETE" }),
};

// Dashboard API
export const dashboardApi = {
  stats: () => apiRequest<any>("/dashboard/stats"),
  activities: (limit?: number) =>
    apiRequest<any[]>("/dashboard/activities", { params: { limit } }),
  charts: (period?: string) =>
    apiRequest<any>("/dashboard/charts", { params: { period } }),
};

// Profile API
export const profileApi = {
  get: () => apiRequest<any>("/profile"),
  update: (data: any) =>
    apiRequest<any>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<void>("/profile/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
