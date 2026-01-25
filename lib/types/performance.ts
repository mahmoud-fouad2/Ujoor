// =====================
// Performance & Evaluation Types
// =====================

// حالة دورة التقييم
export type EvaluationCycleStatus = 
  | 'draft'       // مسودة
  | 'active'      // نشط
  | 'completed'   // مكتمل
  | 'archived';   // مؤرشف

export const evaluationCycleStatusLabels: Record<EvaluationCycleStatus, string> = {
  draft: 'مسودة',
  active: 'نشط',
  completed: 'مكتمل',
  archived: 'مؤرشف',
};

// حالة تقييم الموظف
export type EmployeeEvaluationStatus = 
  | 'pending_self_review'      // بانتظار التقييم الذاتي
  | 'pending_manager_review'   // بانتظار تقييم المدير
  | 'pending_calibration'      // بانتظار المعايرة
  | 'pending_acknowledgment'   // بانتظار التأكيد
  | 'completed';               // مكتمل

export const employeeEvaluationStatusLabels: Record<EmployeeEvaluationStatus, string> = {
  pending_self_review: 'بانتظار التقييم الذاتي',
  pending_manager_review: 'بانتظار تقييم المدير',
  pending_calibration: 'بانتظار المعايرة',
  pending_acknowledgment: 'بانتظار التأكيد',
  completed: 'مكتمل',
};

// نوع الهدف
export type GoalType = 
  | 'individual'    // فردي
  | 'team'          // فريق
  | 'department'    // قسم
  | 'company';      // شركة

export const goalTypeLabels: Record<GoalType, string> = {
  individual: 'فردي',
  team: 'فريق',
  department: 'قسم',
  company: 'شركة',
};

// حالة الهدف
export type GoalStatus = 
  | 'not_started'   // لم يبدأ
  | 'in_progress'   // قيد التنفيذ
  | 'at_risk'       // معرض للخطر
  | 'overdue'       // متأخر
  | 'completed'     // مكتمل
  | 'cancelled';    // ملغي

export const goalStatusLabels: Record<GoalStatus, string> = {
  not_started: 'لم يبدأ',
  in_progress: 'قيد التنفيذ',
  at_risk: 'معرض للخطر',
  overdue: 'متأخر',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

export const goalStatusColors: Record<GoalStatus, string> = {
  not_started: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  at_risk: 'bg-orange-100 text-orange-800',
  overdue: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-500',
};

// أولوية الهدف
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';

export const goalPriorityLabels: Record<GoalPriority, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'عالية',
  critical: 'حرجة',
};

export const goalPriorityColors: Record<GoalPriority, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export const employeeEvaluationStatusColors: Record<EmployeeEvaluationStatus, string> = {
  pending_self_review: 'bg-blue-100 text-blue-800',
  pending_manager_review: 'bg-purple-100 text-purple-800',
  pending_calibration: 'bg-orange-100 text-orange-800',
  pending_acknowledgment: 'bg-teal-100 text-teal-800',
  completed: 'bg-green-100 text-green-800',
};

// نوع مقياس التقييم
export type RatingScale = 
  | 'numeric_5'     // 1-5
  | 'numeric_10'    // 1-10
  | 'percentage'    // 0-100%
  | 'descriptive';  // وصفي

export const ratingScaleLabels: Record<RatingScale, string> = {
  numeric_5: 'رقمي (1-5)',
  numeric_10: 'رقمي (1-10)',
  percentage: 'نسبة مئوية',
  descriptive: 'وصفي',
};

// =====================
// Main Interfaces
// =====================

// نموذج التقييم
export interface EvaluationTemplate {
  id: string;
  tenantId: string;
  name: string;
  nameEn: string;
  description?: string;
  
  // الإعدادات
  ratingScale: RatingScale;
  includesSelfReview: boolean;
  includesManagerReview: boolean;
  includes360Review: boolean;
  requiresCalibration: boolean;
  
  // الأقسام
  sections: EvaluationSection[];
  
  // الوزن الإجمالي
  totalWeight: number;
  
  // البيانات الوصفية
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// قسم التقييم
export interface EvaluationSection {
  id: string;
  name: string;
  description?: string;
  weight: number;
  order: number;
  criteria: EvaluationCriterion[];
}

// معيار التقييم
export interface EvaluationCriterion {
  id: string;
  name: string;
  description?: string;
  weight: number;
  order: number;
  isRequired: boolean;
}

// دورة التقييم
export interface EvaluationCycle {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  
  // الفترة
  startDate: string;
  endDate: string;
  year: number;
  quarter?: number;
  
  // النموذج المستخدم
  templateId: string;
  templateName: string;
  
  // المراحل
  selfReviewStart?: string;
  selfReviewEnd?: string;
  managerReviewStart?: string;
  managerReviewEnd?: string;
  calibrationStart?: string;
  calibrationEnd?: string;
  
  // الإحصائيات
  totalEmployees: number;
  completedCount: number;
  
  // الحالة
  status: EvaluationCycleStatus;
  
  // البيانات الوصفية
  createdAt: string;
  updatedAt: string;
}

// تقييم الموظف
export interface EmployeeEvaluation {
  id: string;
  tenantId: string;
  cycleId: string;
  cycleName: string;
  
  // الموظف
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  employeeAvatar?: string;
  departmentId: string;
  departmentName: string;
  jobTitleId: string;
  jobTitle: string;
  
  // المدير
  managerId: string;
  managerName: string;
  
  // النموذج
  templateId: string;
  templateName?: string;
  template?: EvaluationTemplate;
  
  // فترة التقييم
  periodStart?: string;
  periodEnd?: string;
  
  // التقييمات
  selfReview?: EvaluationReview;
  managerReview?: EvaluationReview;
  finalReview?: EvaluationReview;
  
  // النتائج
  selfScore?: number;
  managerScore?: number;
  finalScore?: number;
  rating?: string;
  
  // الملاحظات
  strengths?: string;
  improvements?: string;
  developmentPlan?: string;
  managerComments?: string;
  employeeComments?: string;
  
  // الحالة
  status: EmployeeEvaluationStatus;
  
  // التواريخ
  selfReviewDate?: string;
  managerReviewDate?: string;
  acknowledgedDate?: string;
  completedDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

// مراجعة التقييم
export interface EvaluationReview {
  id?: string;
  evaluationId?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewType?: 'self' | 'manager' | '360';
  sections?: {
    sectionId: string;
    sectionName: string;
    criteria: {
      criterionId: string;
      criterionName: string;
      rating: number;
      comment?: string;
    }[];
    sectionScore: number;
  }[];
  score: number;
  overallScore?: number;
  comments?: string;
  strengths?: string[];
  improvements?: string[];
  recommendations?: string;
  submittedAt?: string;
}

// هدف الأداء (KPI)
export interface PerformanceGoal {
  id: string;
  tenantId: string;
  
  // الموظف/الفريق
  employeeId?: string;
  employeeName?: string;
  departmentId?: string;
  departmentName?: string;
  
  // تفاصيل الهدف
  title: string;
  description?: string;
  type: GoalType;
  priority: GoalPriority;
  
  // القياس
  metric: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  
  // الفترة
  startDate: string;
  dueDate: string;
  completedDate?: string;
  
  // الوزن والتقدم
  weight: number;
  progress: number;
  
  // الحالة
  status: GoalStatus;
  
  // المعالم
  milestones: GoalMilestone[];
  
  // المهام المرتبطة
  linkedTasksCount: number;
  
  // البيانات الوصفية
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// معلم الهدف
export interface GoalMilestone {
  id: string;
  goalId?: string;
  title: string;
  dueDate: string;
  targetDate?: string;
  targetValue?: number;
  actualValue?: number;
  order?: number;
  isCompleted: boolean;
  completedDate?: string;
}

// تصنيف الأداء
export interface PerformanceRating {
  id: string;
  tenantId?: string;
  name: string;
  nameEn?: string;
  label?: string;
  minScore: number;
  maxScore: number;
  color: string;
  description?: string;
  order?: number;
}

// =====================
// Stats & Reports
// =====================

// إحصائيات التقييم
export interface EvaluationStats {
  totalEmployees: number;
  evaluated: number;
  pending: number;
  inProgress: number;
  
  averageScore: number;
  
  byRating: {
    rating: string;
    count: number;
    percentage: number;
  }[];
  
  byDepartment: {
    departmentId: string;
    departmentName: string;
    avgScore: number;
    count: number;
  }[];
  
  completionRate: number;
}

// إحصائيات الأهداف
export interface GoalStats {
  totalGoals: number;
  completed: number;
  inProgress: number;
  atRisk: number;
  notStarted: number;
  
  averageProgress: number;
  onTrackPercentage: number;
  
  byType: {
    type: GoalType;
    count: number;
  }[];
  
  byPriority: {
    priority: GoalPriority;
    count: number;
  }[];
}

// =====================
// Filters
// =====================

export interface EvaluationFilters {
  cycleId?: string;
  employeeId?: string;
  departmentId?: string;
  managerId?: string;
  status?: EmployeeEvaluationStatus;
  year?: number;
}

export interface GoalFilters {
  employeeId?: string;
  departmentId?: string;
  type?: GoalType;
  status?: GoalStatus;
  priority?: GoalPriority;
  startDate?: string;
  endDate?: string;
}

// =====================
// Mock Data
// =====================

export const defaultPerformanceRatings: PerformanceRating[] = [
  { id: 'r1', name: 'استثنائي', nameEn: 'Exceptional', label: 'استثنائي', minScore: 4.5, maxScore: 5, color: '#10B981', description: 'أداء يتجاوز التوقعات بشكل كبير' },
  { id: 'r2', name: 'يتجاوز التوقعات', nameEn: 'Exceeds Expectations', label: 'يتجاوز التوقعات', minScore: 3.5, maxScore: 4.49, color: '#3B82F6', description: 'أداء يتجاوز المتطلبات' },
  { id: 'r3', name: 'يلبي التوقعات', nameEn: 'Meets Expectations', label: 'يلبي التوقعات', minScore: 2.5, maxScore: 3.49, color: '#F59E0B', description: 'أداء يلبي المتطلبات' },
  { id: 'r4', name: 'يحتاج تحسين', nameEn: 'Needs Improvement', label: 'يحتاج تحسين', minScore: 1.5, maxScore: 2.49, color: '#F97316', description: 'أداء أقل من المتوقع' },
  { id: 'r5', name: 'غير مرضي', nameEn: 'Unsatisfactory', label: 'غير مرضي', minScore: 0, maxScore: 1.49, color: '#EF4444', description: 'أداء غير مقبول' },
];

export const mockEvaluationTemplates: EvaluationTemplate[] = [
  {
    id: 'et-001',
    tenantId: 'tenant-1',
    name: 'نموذج التقييم السنوي',
    nameEn: 'Annual Evaluation Template',
    description: 'النموذج القياسي للتقييم السنوي للموظفين',
    ratingScale: 'numeric_5',
    includesSelfReview: true,
    includesManagerReview: true,
    includes360Review: false,
    requiresCalibration: true,
    totalWeight: 100,
    sections: [
      {
        id: 'sec-1',
        name: 'الأداء الوظيفي',
        description: 'تقييم جودة العمل والإنتاجية',
        weight: 40,
        order: 1,
        criteria: [
          { id: 'cr-1', name: 'جودة العمل', description: 'مستوى الدقة والإتقان', weight: 15, order: 1, isRequired: true },
          { id: 'cr-2', name: 'الإنتاجية', description: 'كمية العمل المنجز', weight: 15, order: 2, isRequired: true },
          { id: 'cr-3', name: 'الالتزام بالمواعيد', description: 'تسليم العمل في الوقت المحدد', weight: 10, order: 3, isRequired: true },
        ],
      },
      {
        id: 'sec-2',
        name: 'المهارات والكفاءات',
        description: 'المهارات الفنية والشخصية',
        weight: 30,
        order: 2,
        criteria: [
          { id: 'cr-4', name: 'المهارات التقنية', description: 'إتقان المهارات المطلوبة للوظيفة', weight: 15, order: 1, isRequired: true },
          { id: 'cr-5', name: 'حل المشكلات', description: 'القدرة على التحليل وإيجاد الحلول', weight: 10, order: 2, isRequired: true },
          { id: 'cr-6', name: 'التعلم المستمر', description: 'السعي للتطور والتعلم', weight: 5, order: 3, isRequired: false },
        ],
      },
      {
        id: 'sec-3',
        name: 'السلوك والقيم',
        description: 'الالتزام بقيم الشركة',
        weight: 30,
        order: 3,
        criteria: [
          { id: 'cr-7', name: 'العمل الجماعي', description: 'التعاون مع الفريق', weight: 10, order: 1, isRequired: true },
          { id: 'cr-8', name: 'التواصل', description: 'مهارات التواصل الفعال', weight: 10, order: 2, isRequired: true },
          { id: 'cr-9', name: 'المبادرة', description: 'أخذ المبادرة والإبداع', weight: 10, order: 3, isRequired: true },
        ],
      },
    ],
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

export const mockEvaluationCycles: EvaluationCycle[] = [
  {
    id: 'ec-001',
    tenantId: 'tenant-1',
    name: 'تقييم الأداء السنوي 2025',
    description: 'دورة التقييم السنوي للعام 2025',
    startDate: '2025-12-01',
    endDate: '2026-01-31',
    year: 2025,
    templateId: 'et-001',
    templateName: 'نموذج التقييم السنوي',
    selfReviewStart: '2025-12-01',
    selfReviewEnd: '2025-12-15',
    managerReviewStart: '2025-12-16',
    managerReviewEnd: '2026-01-15',
    calibrationStart: '2026-01-16',
    calibrationEnd: '2026-01-25',
    totalEmployees: 50,
    completedCount: 35,
    status: 'active',
    createdAt: '2025-11-15T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'ec-002',
    tenantId: 'tenant-1',
    name: 'تقييم منتصف العام 2025',
    description: 'دورة تقييم منتصف العام',
    startDate: '2025-06-01',
    endDate: '2025-07-15',
    year: 2025,
    quarter: 2,
    templateId: 'et-001',
    templateName: 'نموذج التقييم السنوي',
    totalEmployees: 48,
    completedCount: 48,
    status: 'completed',
    createdAt: '2025-05-15T00:00:00Z',
    updatedAt: '2025-07-15T00:00:00Z',
  },
];

export const mockEmployeeEvaluations: EmployeeEvaluation[] = [
  {
    id: 'ee-001',
    tenantId: 'tenant-1',
    cycleId: 'ec-001',
    cycleName: 'تقييم الأداء السنوي 2025',
    employeeId: 'emp-001',
    employeeName: 'أحمد محمد علي',
    employeeNumber: 'EMP001',
    departmentId: 'dept-1',
    departmentName: 'تقنية المعلومات',
    jobTitleId: 'jt-1',
    jobTitle: 'مهندس برمجيات',
    managerId: 'mgr-001',
    managerName: 'خالد العمري',
    templateId: 'et-001',
    selfScore: 4.2,
    managerScore: 4.0,
    finalScore: 4.1,
    rating: 'يتجاوز التوقعات',
    strengths: 'مهارات تقنية عالية، التزام بالمواعيد',
    improvements: 'تحسين مهارات العرض والتقديم',
    status: 'pending_manager_review',
    selfReviewDate: '2025-12-14T10:00:00Z',
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2025-12-14T10:00:00Z',
  },
  {
    id: 'ee-002',
    tenantId: 'tenant-1',
    cycleId: 'ec-001',
    cycleName: 'تقييم الأداء السنوي 2025',
    employeeId: 'emp-002',
    employeeName: 'سارة أحمد',
    employeeNumber: 'EMP002',
    departmentId: 'dept-2',
    departmentName: 'الموارد البشرية',
    jobTitleId: 'jt-2',
    jobTitle: 'أخصائي موارد بشرية',
    managerId: 'mgr-002',
    managerName: 'فاطمة الزهراء',
    templateId: 'et-001',
    selfScore: 4.5,
    managerScore: 4.6,
    finalScore: 4.55,
    rating: 'استثنائي',
    strengths: 'تواصل ممتاز، إبداع في الحلول',
    status: 'completed',
    selfReviewDate: '2025-12-10T09:00:00Z',
    managerReviewDate: '2025-12-20T14:00:00Z',
    completedDate: '2026-01-05T11:00:00Z',
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2026-01-05T11:00:00Z',
  },
  {
    id: 'ee-003',
    tenantId: 'tenant-1',
    cycleId: 'ec-001',
    cycleName: 'تقييم الأداء السنوي 2025',
    employeeId: 'emp-003',
    employeeName: 'محمد الحربي',
    employeeNumber: 'EMP003',
    departmentId: 'dept-1',
    departmentName: 'تقنية المعلومات',
    jobTitleId: 'jt-3',
    jobTitle: 'مطور واجهات',
    managerId: 'mgr-001',
    managerName: 'خالد العمري',
    templateId: 'et-001',
    status: 'pending_self_review',
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
  },
  {
    id: 'ee-004',
    tenantId: 'tenant-1',
    cycleId: 'ec-001',
    cycleName: 'تقييم الأداء السنوي 2025',
    employeeId: 'emp-004',
    employeeName: 'نورة السالم',
    employeeNumber: 'EMP004',
    departmentId: 'dept-3',
    departmentName: 'المالية',
    jobTitleId: 'jt-4',
    jobTitle: 'محاسب',
    managerId: 'mgr-003',
    managerName: 'عبدالله القحطاني',
    templateId: 'et-001',
    status: 'pending_self_review',
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
  },
];

export const mockPerformanceGoals: PerformanceGoal[] = [
  {
    id: 'pg-001',
    tenantId: 'tenant-1',
    employeeId: 'emp-001',
    employeeName: 'أحمد محمد علي',
    departmentId: 'dept-1',
    departmentName: 'تقنية المعلومات',
    title: 'تطوير نظام إدارة الموارد البشرية',
    description: 'إكمال تطوير جميع وحدات النظام',
    type: 'individual',
    priority: 'high',
    metric: 'إكمال الوحدات',
    targetValue: 12,
    currentValue: 8,
    unit: 'وحدة',
    startDate: '2025-01-01',
    dueDate: '2025-12-31',
    weight: 30,
    progress: 67,
    status: 'in_progress',
    milestones: [
      { id: 'm1', title: 'الوحدة الأساسية', dueDate: '2025-03-31', targetValue: 3, actualValue: 3, isCompleted: true, completedDate: '2025-03-25' },
      { id: 'm2', title: 'وحدات HR', dueDate: '2025-06-30', targetValue: 6, actualValue: 6, isCompleted: true, completedDate: '2025-06-28' },
      { id: 'm3', title: 'الوحدات المتقدمة', dueDate: '2025-12-31', targetValue: 12, isCompleted: false },
    ],
    linkedTasksCount: 24,
    createdBy: 'mgr-001',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'pg-002',
    tenantId: 'tenant-1',
    departmentId: 'dept-2',
    departmentName: 'الموارد البشرية',
    title: 'تخفيض معدل دوران الموظفين',
    description: 'تخفيض معدل استقالات الموظفين خلال العام',
    type: 'department',
    priority: 'critical',
    metric: 'معدل الدوران',
    targetValue: 10,
    currentValue: 12,
    unit: '%',
    startDate: '2025-01-01',
    dueDate: '2025-12-31',
    weight: 25,
    progress: 80,
    status: 'at_risk',
    milestones: [
      { id: 'm1', title: 'Q1', dueDate: '2025-03-31', targetValue: 15, actualValue: 14, isCompleted: true },
      { id: 'm2', title: 'Q2', dueDate: '2025-06-30', targetValue: 13, actualValue: 13, isCompleted: true },
      { id: 'm3', title: 'Q3', dueDate: '2025-09-30', targetValue: 11, actualValue: 12, isCompleted: true },
      { id: 'm4', title: 'Q4', dueDate: '2025-12-31', targetValue: 10, isCompleted: false },
    ],
    linkedTasksCount: 15,
    createdBy: 'admin',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'pg-003',
    tenantId: 'tenant-1',
    employeeId: 'emp-002',
    employeeName: 'سارة أحمد',
    departmentId: 'dept-2',
    departmentName: 'الموارد البشرية',
    title: 'تحسين رضا الموظفين',
    description: 'رفع نسبة رضا الموظفين في الاستبيان السنوي',
    type: 'individual',
    priority: 'medium',
    metric: 'نسبة الرضا',
    targetValue: 85,
    currentValue: 88,
    unit: '%',
    startDate: '2025-01-01',
    dueDate: '2025-12-31',
    weight: 20,
    progress: 100,
    status: 'completed',
    milestones: [
      { id: 'm1', title: 'استبيان منتصف العام', dueDate: '2025-06-30', targetValue: 80, actualValue: 82, isCompleted: true },
      { id: 'm2', title: 'استبيان نهاية العام', dueDate: '2025-12-31', targetValue: 85, actualValue: 88, isCompleted: true },
    ],
    linkedTasksCount: 8,
    createdBy: 'mgr-002',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-12-20T00:00:00Z',
  },
];

// =====================
// Helper Functions
// =====================

/**
 * حساب التقدير بناءً على الدرجة
 */
export function getRatingByScore(score: number, ratings: PerformanceRating[]): PerformanceRating | undefined {
  return ratings.find(r => score >= r.minScore && score <= r.maxScore);
}

/**
 * حساب نسبة الإنجاز
 */
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * تحديد حالة الهدف تلقائياً
 */
export function determineGoalStatus(goal: PerformanceGoal): GoalStatus {
  const today = new Date();
  const dueDate = new Date(goal.dueDate);
  const startDate = new Date(goal.startDate);
  
  if (goal.progress >= 100) return 'completed';
  if (today < startDate) return 'not_started';
  
  // حساب التقدم المتوقع
  const totalDays = (dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const elapsedDays = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const expectedProgress = (elapsedDays / totalDays) * 100;
  
  if (goal.progress < expectedProgress - 20) return 'at_risk';
  return 'in_progress';
}

/**
 * تنسيق الدرجة
 */
export function formatScore(score: number, scale: RatingScale = 'numeric_5'): string {
  switch (scale) {
    case 'numeric_5':
      return `${score.toFixed(1)} / 5`;
    case 'numeric_10':
      return `${score.toFixed(1)} / 10`;
    case 'percentage':
      return `${score.toFixed(0)}%`;
    default:
      return score.toFixed(1);
  }
}
