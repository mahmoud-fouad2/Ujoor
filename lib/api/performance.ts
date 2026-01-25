import { apiClient } from './client';
import type {
  EvaluationTemplate,
  EvaluationCycle,
  EmployeeEvaluation,
  PerformanceGoal,
  PerformanceRating,
  EvaluationStats,
  GoalStats,
  EvaluationFilters,
  GoalFilters,
  EvaluationReview,
} from '../types/performance';

// =====================
// Evaluation Templates API
// =====================

export const evaluationTemplatesApi = {
  /**
   * الحصول على جميع نماذج التقييم
   */
  getAll: () => 
    apiClient.get<EvaluationTemplate[]>('/evaluation-templates'),

  /**
   * الحصول على نموذج بالمعرف
   */
  getById: (id: string) => 
    apiClient.get<EvaluationTemplate>(`/evaluation-templates/${id}`),

  /**
   * إنشاء نموذج جديد
   */
  create: (data: Omit<EvaluationTemplate, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<EvaluationTemplate>('/evaluation-templates', data),

  /**
   * تحديث نموذج
   */
  update: (id: string, data: Partial<EvaluationTemplate>) =>
    apiClient.put<EvaluationTemplate>(`/evaluation-templates/${id}`, data),

  /**
   * حذف نموذج
   */
  delete: (id: string) =>
    apiClient.delete<void>(`/evaluation-templates/${id}`),

  /**
   * نسخ نموذج
   */
  duplicate: (id: string, name: string) =>
    apiClient.post<EvaluationTemplate>(`/evaluation-templates/${id}/duplicate`, { name }),

  /**
   * تعيين كافتراضي
   */
  setDefault: (id: string) =>
    apiClient.patch<EvaluationTemplate>(`/evaluation-templates/${id}/set-default`, {}),
};

// =====================
// Evaluation Cycles API
// =====================

export const evaluationCyclesApi = {
  /**
   * الحصول على جميع دورات التقييم
   */
  getAll: (year?: number) => 
    apiClient.get<EvaluationCycle[]>('/evaluation-cycles', {
      params: year ? { year } : undefined,
    }),

  /**
   * الحصول على دورة بالمعرف
   */
  getById: (id: string) => 
    apiClient.get<EvaluationCycle>(`/evaluation-cycles/${id}`),

  /**
   * إنشاء دورة جديدة
   */
  create: (data: Omit<EvaluationCycle, 'id' | 'tenantId' | 'totalEmployees' | 'completedCount' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<EvaluationCycle>('/evaluation-cycles', data),

  /**
   * تحديث دورة
   */
  update: (id: string, data: Partial<EvaluationCycle>) =>
    apiClient.put<EvaluationCycle>(`/evaluation-cycles/${id}`, data),

  /**
   * حذف دورة
   */
  delete: (id: string) =>
    apiClient.delete<void>(`/evaluation-cycles/${id}`),

  /**
   * بدء دورة التقييم
   */
  start: (id: string) =>
    apiClient.patch<EvaluationCycle>(`/evaluation-cycles/${id}/start`, {}),

  /**
   * إنهاء دورة التقييم
   */
  complete: (id: string) =>
    apiClient.patch<EvaluationCycle>(`/evaluation-cycles/${id}/complete`, {}),

  /**
   * أرشفة دورة
   */
  archive: (id: string) =>
    apiClient.patch<EvaluationCycle>(`/evaluation-cycles/${id}/archive`, {}),

  /**
   * الحصول على إحصائيات الدورة
   */
  getStats: (id: string) =>
    apiClient.get<EvaluationStats>(`/evaluation-cycles/${id}/stats`),
};

// =====================
// Employee Evaluations API
// =====================

export const employeeEvaluationsApi = {
  /**
   * الحصول على جميع تقييمات الموظفين
   */
  getAll: (filters?: EvaluationFilters) => 
    apiClient.get<EmployeeEvaluation[]>('/employee-evaluations', {
      params: filters as Record<string, string | number> | undefined,
    }),

  /**
   * الحصول على تقييم بالمعرف
   */
  getById: (id: string) => 
    apiClient.get<EmployeeEvaluation>(`/employee-evaluations/${id}`),

  /**
   * الحصول على تقييمات موظف
   */
  getByEmployee: (employeeId: string) =>
    apiClient.get<EmployeeEvaluation[]>(`/employee-evaluations/employee/${employeeId}`),

  /**
   * الحصول على تقييمات دورة
   */
  getByCycle: (cycleId: string) =>
    apiClient.get<EmployeeEvaluation[]>(`/employee-evaluations/cycle/${cycleId}`),

  /**
   * الحصول على التقييمات المعلقة للمدير
   */
  getPendingForManager: (managerId: string) =>
    apiClient.get<EmployeeEvaluation[]>(`/employee-evaluations/pending/${managerId}`),

  /**
   * تقديم التقييم الذاتي
   */
  submitSelfReview: (id: string, review: EvaluationReview) =>
    apiClient.patch<EmployeeEvaluation>(`/employee-evaluations/${id}/self-review`, review),

  /**
   * تقديم تقييم المدير
   */
  submitManagerReview: (id: string, review: EvaluationReview & { 
    strengths?: string; 
    improvements?: string; 
    developmentPlan?: string;
    managerComments?: string;
  }) =>
    apiClient.patch<EmployeeEvaluation>(`/employee-evaluations/${id}/manager-review`, review),

  /**
   * إتمام المعايرة
   */
  submitCalibration: (id: string, data: { finalScore: number; rating: string }) =>
    apiClient.patch<EmployeeEvaluation>(`/employee-evaluations/${id}/calibration`, data),

  /**
   * تأكيد اطلاع الموظف
   */
  acknowledge: (id: string, employeeComments?: string) =>
    apiClient.patch<EmployeeEvaluation>(`/employee-evaluations/${id}/acknowledge`, { employeeComments }),

  /**
   * تصدير التقييمات
   */
  export: (cycleId: string, format: 'csv' | 'xlsx' | 'pdf') =>
    apiClient.get<Blob>(`/employee-evaluations/export/${cycleId}`, { params: { format } }),
};

// =====================
// Performance Goals API
// =====================

export const performanceGoalsApi = {
  /**
   * الحصول على جميع الأهداف
   */
  getAll: (filters?: GoalFilters) => 
    apiClient.get<PerformanceGoal[]>('/performance-goals', {
      params: filters as Record<string, string | number> | undefined,
    }),

  /**
   * الحصول على هدف بالمعرف
   */
  getById: (id: string) => 
    apiClient.get<PerformanceGoal>(`/performance-goals/${id}`),

  /**
   * الحصول على أهداف موظف
   */
  getByEmployee: (employeeId: string) =>
    apiClient.get<PerformanceGoal[]>(`/performance-goals/employee/${employeeId}`),

  /**
   * الحصول على أهداف قسم
   */
  getByDepartment: (departmentId: string) =>
    apiClient.get<PerformanceGoal[]>(`/performance-goals/department/${departmentId}`),

  /**
   * إنشاء هدف جديد
   */
  create: (data: Omit<PerformanceGoal, 'id' | 'tenantId' | 'progress' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<PerformanceGoal>('/performance-goals', data),

  /**
   * تحديث هدف
   */
  update: (id: string, data: Partial<PerformanceGoal>) =>
    apiClient.put<PerformanceGoal>(`/performance-goals/${id}`, data),

  /**
   * حذف هدف
   */
  delete: (id: string) =>
    apiClient.delete<void>(`/performance-goals/${id}`),

  /**
   * تحديث التقدم
   */
  updateProgress: (id: string, currentValue: number) =>
    apiClient.patch<PerformanceGoal>(`/performance-goals/${id}/progress`, { currentValue }),

  /**
   * إكمال هدف
   */
  complete: (id: string) =>
    apiClient.patch<PerformanceGoal>(`/performance-goals/${id}/complete`, {}),

  /**
   * إلغاء هدف
   */
  cancel: (id: string, reason?: string) =>
    apiClient.patch<PerformanceGoal>(`/performance-goals/${id}/cancel`, { reason }),

  /**
   * إضافة معلم
   */
  addMilestone: (goalId: string, milestone: { title: string; dueDate: string; targetValue?: number }) =>
    apiClient.post<PerformanceGoal>(`/performance-goals/${goalId}/milestones`, milestone),

  /**
   * تحديث معلم
   */
  updateMilestone: (goalId: string, milestoneId: string, data: { actualValue?: number; isCompleted?: boolean }) =>
    apiClient.patch<PerformanceGoal>(`/performance-goals/${goalId}/milestones/${milestoneId}`, data),

  /**
   * الحصول على إحصائيات الأهداف
   */
  getStats: (params?: { employeeId?: string; departmentId?: string; year?: number }) =>
    apiClient.get<GoalStats>('/performance-goals/stats', { 
      params: params as Record<string, string | number> | undefined 
    }),
};

// =====================
// Performance Ratings API
// =====================

export const performanceRatingsApi = {
  /**
   * الحصول على جميع التقديرات
   */
  getAll: () => 
    apiClient.get<PerformanceRating[]>('/performance-ratings'),

  /**
   * تحديث التقديرات
   */
  update: (ratings: PerformanceRating[]) =>
    apiClient.put<PerformanceRating[]>('/performance-ratings', { ratings }),
};

// تصدير مجمع
export const performanceApi = {
  templates: evaluationTemplatesApi,
  cycles: evaluationCyclesApi,
  evaluations: employeeEvaluationsApi,
  goals: performanceGoalsApi,
  ratings: performanceRatingsApi,
};
