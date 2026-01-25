/**
 * API Client - Base HTTP client for all API calls
 * Handles authentication, error handling, and request/response transformation
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    
    if (!response.ok) {
      let errorMessage = "حدث خطأ غير متوقع";
      
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return {
        success: true,
        data: data.data ?? data,
        message: data.message,
        meta: data.meta,
      };
    }

    return { success: true };
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "GET",
        headers: { ...this.defaultHeaders, ...options?.headers },
        signal: options?.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return { success: false, error: "تم إلغاء الطلب" };
      }
      return { success: false, error: "فشل الاتصال بالخادم" };
    }
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: { ...this.defaultHeaders, ...options?.headers },
        body: body ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return { success: false, error: "فشل الاتصال بالخادم" };
    }
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: { ...this.defaultHeaders, ...options?.headers },
        body: body ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return { success: false, error: "فشل الاتصال بالخادم" };
    }
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options?.headers },
        body: body ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return { success: false, error: "فشل الاتصال بالخادم" };
    }
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: { ...this.defaultHeaders, ...options?.headers },
        signal: options?.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return { success: false, error: "فشل الاتصال بالخادم" };
    }
  }

  async upload<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const headers = { ...options?.headers };
      // Don't set Content-Type for FormData, browser will set it with boundary
      delete headers["Content-Type"];
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
        signal: options?.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return { success: false, error: "فشل رفع الملف" };
    }
  }

  setAuthToken(token: string) {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.defaultHeaders["Authorization"];
  }

  setTenantId(tenantId: string) {
    this.defaultHeaders["X-Tenant-ID"] = tenantId;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
