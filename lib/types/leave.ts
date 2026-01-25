// =====================
// Leave Types & Interfaces
// =====================

// أنواع الإجازات
export type LeaveCategory = 
  | 'annual'      // إجازة سنوية
  | 'sick'        // إجازة مرضية
  | 'unpaid'      // إجازة بدون راتب
  | 'maternity'   // إجازة أمومة
  | 'paternity'   // إجازة أبوة
  | 'marriage'    // إجازة زواج
  | 'bereavement' // إجازة وفاة
  | 'hajj'        // إجازة حج
  | 'study'       // إجازة دراسية
  | 'emergency'   // إجازة طارئة
  | 'compensatory'// إجازة تعويضية
  | 'other';      // أخرى

export const leaveCategoryLabels: Record<LeaveCategory, string> = {
  annual: 'إجازة سنوية',
  sick: 'إجازة مرضية',
  unpaid: 'إجازة بدون راتب',
  maternity: 'إجازة أمومة',
  paternity: 'إجازة أبوة',
  marriage: 'إجازة زواج',
  bereavement: 'إجازة وفاة',
  hajj: 'إجازة حج',
  study: 'إجازة دراسية',
  emergency: 'إجازة طارئة',
  compensatory: 'إجازة تعويضية',
  other: 'أخرى',
};

// حالة طلب الإجازة
export type LeaveRequestStatus = 
  | 'pending'   // قيد الانتظار
  | 'approved'  // موافق عليه
  | 'rejected'  // مرفوض
  | 'cancelled' // ملغي
  | 'taken';    // تم أخذها

export const leaveRequestStatusLabels: Record<LeaveRequestStatus, string> = {
  pending: 'قيد الانتظار',
  approved: 'موافق عليه',
  rejected: 'مرفوض',
  cancelled: 'ملغي',
  taken: 'تم أخذها',
};

// ألوان حالات الطلبات
export const leaveRequestStatusColors: Record<LeaveRequestStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  taken: 'bg-blue-100 text-blue-800',
};

// نوع استحقاق الإجازة
export type AccrualType = 
  | 'yearly'    // سنوي
  | 'monthly'   // شهري
  | 'none';     // بدون استحقاق

export const accrualTypeLabels: Record<AccrualType, string> = {
  yearly: 'سنوي',
  monthly: 'شهري',
  none: 'بدون استحقاق',
};

// =====================
// Main Interfaces
// =====================

// نوع الإجازة
export interface LeaveType {
  id: string;
  tenantId: string;
  name: string;
  nameEn: string;
  category: LeaveCategory;
  description?: string;
  color: string;
  
  // الإعدادات
  maxDaysPerYear: number;
  minDaysPerRequest: number;
  maxDaysPerRequest: number;
  requiresAttachment: boolean;
  allowHalfDay: boolean;
  isPaid: boolean;
  affectsSalary: boolean;
  salaryPercentage: number; // نسبة الراتب (100 = كامل)
  
  // الاستحقاق
  accrualType: AccrualType;
  accrualRate: number; // معدل الاستحقاق الشهري/السنوي
  carryOverAllowed: boolean;
  maxCarryOverDays: number;
  
  // الشروط
  minServiceMonths: number; // الحد الأدنى لأشهر الخدمة
  genderRestriction?: 'male' | 'female' | 'all';
  
  // البيانات الوصفية
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// طلب الإجازة
export interface LeaveRequest {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  departmentId: string;
  departmentName: string;
  
  leaveTypeId: string;
  leaveTypeName: string;
  leaveCategory: LeaveCategory;
  
  // التواريخ
  startDate: string;
  endDate: string;
  totalDays: number;
  isHalfDay: boolean;
  halfDayPeriod?: 'morning' | 'afternoon';
  
  // التفاصيل
  reason: string;
  attachments: LeaveAttachment[];
  
  // الموافقات
  status: LeaveRequestStatus;
  approvalFlow: LeaveApproval[];
  currentApprover?: string;
  
  // البديل
  delegateEmployeeId?: string;
  delegateEmployeeName?: string;
  
  // معلومات إضافية
  emergencyContact?: string;
  emergencyPhone?: string;
  
  // البيانات الوصفية
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

// مرفق الإجازة
export interface LeaveAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// موافقة الإجازة
export interface LeaveApproval {
  id: string;
  approverId: string;
  approverName: string;
  approverRole: string;
  order: number;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  actionDate?: string;
}

// رصيد الإجازات
export interface LeaveBalance {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  departmentId: string;
  departmentName: string;
  
  leaveTypeId: string;
  leaveTypeName: string;
  leaveCategory: LeaveCategory;
  
  year: number;
  
  // الأرصدة
  entitled: number;      // المستحق
  carriedOver: number;   // المرحل
  taken: number;         // المأخوذ
  pending: number;       // قيد الانتظار
  remaining: number;     // المتبقي
  
  // التواريخ
  accrualStartDate: string;
  expiryDate?: string;
  
  // البيانات الوصفية
  createdAt: string;
  updatedAt: string;
}

// إعدادات سياسة الإجازات
export interface LeavePolicy {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  
  // الإعدادات العامة
  workingDaysPerWeek: number;
  weekendDays: number[]; // 0 = Sunday, 6 = Saturday
  includeHolidaysInLeave: boolean;
  allowNegativeBalance: boolean;
  maxNegativeDays: number;
  
  // فترة الاستحقاق
  accrualStartDate: 'hire_date' | 'year_start';
  yearStartMonth: number; // 1-12
  
  // الموافقات
  requireManagerApproval: boolean;
  requireHRApproval: boolean;
  autoApproveAfterDays: number; // 0 = لا موافقة تلقائية
  
  // الإشعارات
  notifyManager: boolean;
  notifyHR: boolean;
  notifyEmployee: boolean;
  reminderDaysBefore: number;
  
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// حدث تقويم الإجازات
export interface LeaveCalendarEvent {
  id: string;
  title: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  category: LeaveCategory;
  color: string;
  startDate: string;
  endDate: string;
  status: LeaveRequestStatus;
  isHalfDay: boolean;
}

// ملخص الإجازات للموظف
export interface EmployeeLeaveSummary {
  employeeId: string;
  employeeName: string;
  year: number;
  balances: {
    leaveTypeId: string;
    leaveTypeName: string;
    category: LeaveCategory;
    entitled: number;
    taken: number;
    pending: number;
    remaining: number;
  }[];
  totalEntitled: number;
  totalTaken: number;
  totalPending: number;
  totalRemaining: number;
}

// إحصائيات الإجازات
export interface LeaveStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  employeesOnLeave: number;
  upcomingLeaves: number;
  
  byCategory: {
    category: LeaveCategory;
    count: number;
    totalDays: number;
  }[];
  
  byDepartment: {
    departmentId: string;
    departmentName: string;
    totalRequests: number;
    totalDays: number;
  }[];
  
  monthlyTrend: {
    month: string;
    requests: number;
    days: number;
  }[];
}

// =====================
// Filter Types
// =====================

export interface LeaveRequestFilters {
  employeeId?: string;
  departmentId?: string;
  leaveTypeId?: string;
  status?: LeaveRequestStatus;
  startDate?: string;
  endDate?: string;
  year?: number;
}

export interface LeaveBalanceFilters {
  employeeId?: string;
  departmentId?: string;
  leaveTypeId?: string;
  year?: number;
}

// =====================
// Mock Data
// =====================

export const leaveTypeColors: Record<LeaveCategory, string> = {
  annual: '#3B82F6',     // blue
  sick: '#EF4444',       // red
  unpaid: '#6B7280',     // gray
  maternity: '#EC4899',  // pink
  paternity: '#8B5CF6',  // purple
  marriage: '#F59E0B',   // amber
  bereavement: '#1F2937',// dark gray
  hajj: '#10B981',       // emerald
  study: '#06B6D4',      // cyan
  emergency: '#F97316',  // orange
  compensatory: '#84CC16',// lime
  other: '#6366F1',      // indigo
};

export const mockLeaveTypes: LeaveType[] = [
  {
    id: 'lt-001',
    tenantId: 'tenant-1',
    name: 'إجازة سنوية',
    nameEn: 'Annual Leave',
    category: 'annual',
    description: 'الإجازة السنوية المستحقة للموظف',
    color: leaveTypeColors.annual,
    maxDaysPerYear: 30,
    minDaysPerRequest: 1,
    maxDaysPerRequest: 21,
    requiresAttachment: false,
    allowHalfDay: true,
    isPaid: true,
    affectsSalary: false,
    salaryPercentage: 100,
    accrualType: 'monthly',
    accrualRate: 2.5,
    carryOverAllowed: true,
    maxCarryOverDays: 15,
    minServiceMonths: 3,
    genderRestriction: 'all',
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'lt-002',
    tenantId: 'tenant-1',
    name: 'إجازة مرضية',
    nameEn: 'Sick Leave',
    category: 'sick',
    description: 'إجازة للموظف في حالة المرض',
    color: leaveTypeColors.sick,
    maxDaysPerYear: 30,
    minDaysPerRequest: 1,
    maxDaysPerRequest: 30,
    requiresAttachment: true,
    allowHalfDay: false,
    isPaid: true,
    affectsSalary: true,
    salaryPercentage: 75,
    accrualType: 'none',
    accrualRate: 0,
    carryOverAllowed: false,
    maxCarryOverDays: 0,
    minServiceMonths: 0,
    genderRestriction: 'all',
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'lt-003',
    tenantId: 'tenant-1',
    name: 'إجازة أمومة',
    nameEn: 'Maternity Leave',
    category: 'maternity',
    description: 'إجازة للموظفات بعد الولادة',
    color: leaveTypeColors.maternity,
    maxDaysPerYear: 70,
    minDaysPerRequest: 70,
    maxDaysPerRequest: 70,
    requiresAttachment: true,
    allowHalfDay: false,
    isPaid: true,
    affectsSalary: false,
    salaryPercentage: 100,
    accrualType: 'none',
    accrualRate: 0,
    carryOverAllowed: false,
    maxCarryOverDays: 0,
    minServiceMonths: 0,
    genderRestriction: 'female',
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'lt-004',
    tenantId: 'tenant-1',
    name: 'إجازة أبوة',
    nameEn: 'Paternity Leave',
    category: 'paternity',
    description: 'إجازة للموظفين عند ولادة طفل',
    color: leaveTypeColors.paternity,
    maxDaysPerYear: 3,
    minDaysPerRequest: 1,
    maxDaysPerRequest: 3,
    requiresAttachment: true,
    allowHalfDay: false,
    isPaid: true,
    affectsSalary: false,
    salaryPercentage: 100,
    accrualType: 'none',
    accrualRate: 0,
    carryOverAllowed: false,
    maxCarryOverDays: 0,
    minServiceMonths: 0,
    genderRestriction: 'male',
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'lt-005',
    tenantId: 'tenant-1',
    name: 'إجازة زواج',
    nameEn: 'Marriage Leave',
    category: 'marriage',
    description: 'إجازة بمناسبة الزواج',
    color: leaveTypeColors.marriage,
    maxDaysPerYear: 5,
    minDaysPerRequest: 5,
    maxDaysPerRequest: 5,
    requiresAttachment: true,
    allowHalfDay: false,
    isPaid: true,
    affectsSalary: false,
    salaryPercentage: 100,
    accrualType: 'none',
    accrualRate: 0,
    carryOverAllowed: false,
    maxCarryOverDays: 0,
    minServiceMonths: 0,
    genderRestriction: 'all',
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'lt-006',
    tenantId: 'tenant-1',
    name: 'إجازة وفاة',
    nameEn: 'Bereavement Leave',
    category: 'bereavement',
    description: 'إجازة في حالة وفاة أحد الأقارب',
    color: leaveTypeColors.bereavement,
    maxDaysPerYear: 5,
    minDaysPerRequest: 1,
    maxDaysPerRequest: 5,
    requiresAttachment: true,
    allowHalfDay: false,
    isPaid: true,
    affectsSalary: false,
    salaryPercentage: 100,
    accrualType: 'none',
    accrualRate: 0,
    carryOverAllowed: false,
    maxCarryOverDays: 0,
    minServiceMonths: 0,
    genderRestriction: 'all',
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'lt-007',
    tenantId: 'tenant-1',
    name: 'إجازة حج',
    nameEn: 'Hajj Leave',
    category: 'hajj',
    description: 'إجازة لأداء فريضة الحج (مرة واحدة)',
    color: leaveTypeColors.hajj,
    maxDaysPerYear: 15,
    minDaysPerRequest: 10,
    maxDaysPerRequest: 15,
    requiresAttachment: true,
    allowHalfDay: false,
    isPaid: true,
    affectsSalary: false,
    salaryPercentage: 100,
    accrualType: 'none',
    accrualRate: 0,
    carryOverAllowed: false,
    maxCarryOverDays: 0,
    minServiceMonths: 24,
    genderRestriction: 'all',
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'lt-008',
    tenantId: 'tenant-1',
    name: 'إجازة بدون راتب',
    nameEn: 'Unpaid Leave',
    category: 'unpaid',
    description: 'إجازة استثنائية بدون راتب',
    color: leaveTypeColors.unpaid,
    maxDaysPerYear: 90,
    minDaysPerRequest: 1,
    maxDaysPerRequest: 30,
    requiresAttachment: false,
    allowHalfDay: false,
    isPaid: false,
    affectsSalary: true,
    salaryPercentage: 0,
    accrualType: 'none',
    accrualRate: 0,
    carryOverAllowed: false,
    maxCarryOverDays: 0,
    minServiceMonths: 12,
    genderRestriction: 'all',
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr-001',
    tenantId: 'tenant-1',
    employeeId: 'emp-001',
    employeeName: 'أحمد محمد علي',
    employeeNumber: 'EMP001',
    departmentId: 'dept-1',
    departmentName: 'تقنية المعلومات',
    leaveTypeId: 'lt-001',
    leaveTypeName: 'إجازة سنوية',
    leaveCategory: 'annual',
    startDate: '2026-02-01',
    endDate: '2026-02-07',
    totalDays: 5,
    isHalfDay: false,
    reason: 'إجازة عائلية',
    attachments: [],
    status: 'pending',
    approvalFlow: [
      {
        id: 'apv-001',
        approverId: 'mgr-001',
        approverName: 'خالد العمري',
        approverRole: 'مدير مباشر',
        order: 1,
        status: 'pending',
      },
    ],
    currentApprover: 'mgr-001',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
    submittedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'lr-002',
    tenantId: 'tenant-1',
    employeeId: 'emp-002',
    employeeName: 'سارة أحمد',
    employeeNumber: 'EMP002',
    departmentId: 'dept-2',
    departmentName: 'الموارد البشرية',
    leaveTypeId: 'lt-002',
    leaveTypeName: 'إجازة مرضية',
    leaveCategory: 'sick',
    startDate: '2026-01-22',
    endDate: '2026-01-24',
    totalDays: 3,
    isHalfDay: false,
    reason: 'مرض طارئ',
    attachments: [
      {
        id: 'att-001',
        name: 'تقرير طبي.pdf',
        url: '/documents/medical-report.pdf',
        type: 'application/pdf',
        size: 150000,
        uploadedAt: '2026-01-22T08:00:00Z',
      },
    ],
    status: 'approved',
    approvalFlow: [
      {
        id: 'apv-002',
        approverId: 'mgr-002',
        approverName: 'فاطمة الزهراء',
        approverRole: 'مدير مباشر',
        order: 1,
        status: 'approved',
        comment: 'سلامات، موافق على الإجازة',
        actionDate: '2026-01-22T09:00:00Z',
      },
    ],
    createdAt: '2026-01-22T07:30:00Z',
    updatedAt: '2026-01-22T09:00:00Z',
    submittedAt: '2026-01-22T07:30:00Z',
    approvedAt: '2026-01-22T09:00:00Z',
  },
  {
    id: 'lr-003',
    tenantId: 'tenant-1',
    employeeId: 'emp-003',
    employeeName: 'محمد الحربي',
    employeeNumber: 'EMP003',
    departmentId: 'dept-1',
    departmentName: 'تقنية المعلومات',
    leaveTypeId: 'lt-001',
    leaveTypeName: 'إجازة سنوية',
    leaveCategory: 'annual',
    startDate: '2026-01-15',
    endDate: '2026-01-17',
    totalDays: 3,
    isHalfDay: false,
    reason: 'سفر عائلي',
    attachments: [],
    status: 'taken',
    approvalFlow: [
      {
        id: 'apv-003',
        approverId: 'mgr-001',
        approverName: 'خالد العمري',
        approverRole: 'مدير مباشر',
        order: 1,
        status: 'approved',
        actionDate: '2026-01-10T14:00:00Z',
      },
    ],
    createdAt: '2026-01-08T11:00:00Z',
    updatedAt: '2026-01-17T23:59:59Z',
    submittedAt: '2026-01-08T11:00:00Z',
    approvedAt: '2026-01-10T14:00:00Z',
  },
  {
    id: 'lr-004',
    tenantId: 'tenant-1',
    employeeId: 'emp-004',
    employeeName: 'نورة السالم',
    employeeNumber: 'EMP004',
    departmentId: 'dept-3',
    departmentName: 'المالية',
    leaveTypeId: 'lt-005',
    leaveTypeName: 'إجازة زواج',
    leaveCategory: 'marriage',
    startDate: '2026-02-15',
    endDate: '2026-02-19',
    totalDays: 5,
    isHalfDay: false,
    reason: 'إجازة زواج',
    attachments: [],
    status: 'approved',
    approvalFlow: [
      {
        id: 'apv-004',
        approverId: 'mgr-003',
        approverName: 'عبدالله القحطاني',
        approverRole: 'مدير مباشر',
        order: 1,
        status: 'approved',
        comment: 'مبروك! موافق',
        actionDate: '2026-01-18T10:00:00Z',
      },
    ],
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-18T10:00:00Z',
    submittedAt: '2026-01-15T09:00:00Z',
    approvedAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'lr-005',
    tenantId: 'tenant-1',
    employeeId: 'emp-005',
    employeeName: 'عمر الشهري',
    employeeNumber: 'EMP005',
    departmentId: 'dept-2',
    departmentName: 'الموارد البشرية',
    leaveTypeId: 'lt-001',
    leaveTypeName: 'إجازة سنوية',
    leaveCategory: 'annual',
    startDate: '2026-03-01',
    endDate: '2026-03-14',
    totalDays: 10,
    isHalfDay: false,
    reason: 'إجازة عمرة',
    attachments: [],
    status: 'rejected',
    approvalFlow: [
      {
        id: 'apv-005',
        approverId: 'mgr-002',
        approverName: 'فاطمة الزهراء',
        approverRole: 'مدير مباشر',
        order: 1,
        status: 'rejected',
        comment: 'يرجى تأجيل الإجازة بسبب ضغط العمل',
        actionDate: '2026-01-20T16:00:00Z',
      },
    ],
    createdAt: '2026-01-19T14:00:00Z',
    updatedAt: '2026-01-20T16:00:00Z',
    submittedAt: '2026-01-19T14:00:00Z',
    rejectedAt: '2026-01-20T16:00:00Z',
  },
];

export const mockLeaveBalances: LeaveBalance[] = [
  {
    id: 'lb-001',
    tenantId: 'tenant-1',
    employeeId: 'emp-001',
    employeeName: 'أحمد محمد علي',
    employeeNumber: 'EMP001',
    departmentId: 'dept-1',
    departmentName: 'تقنية المعلومات',
    leaveTypeId: 'lt-001',
    leaveTypeName: 'إجازة سنوية',
    leaveCategory: 'annual',
    year: 2026,
    entitled: 30,
    carriedOver: 5,
    taken: 3,
    pending: 5,
    remaining: 27,
    accrualStartDate: '2026-01-01',
    expiryDate: '2026-12-31',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'lb-002',
    tenantId: 'tenant-1',
    employeeId: 'emp-001',
    employeeName: 'أحمد محمد علي',
    employeeNumber: 'EMP001',
    departmentId: 'dept-1',
    departmentName: 'تقنية المعلومات',
    leaveTypeId: 'lt-002',
    leaveTypeName: 'إجازة مرضية',
    leaveCategory: 'sick',
    year: 2026,
    entitled: 30,
    carriedOver: 0,
    taken: 0,
    pending: 0,
    remaining: 30,
    accrualStartDate: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'lb-003',
    tenantId: 'tenant-1',
    employeeId: 'emp-002',
    employeeName: 'سارة أحمد',
    employeeNumber: 'EMP002',
    departmentId: 'dept-2',
    departmentName: 'الموارد البشرية',
    leaveTypeId: 'lt-001',
    leaveTypeName: 'إجازة سنوية',
    leaveCategory: 'annual',
    year: 2026,
    entitled: 30,
    carriedOver: 10,
    taken: 5,
    pending: 0,
    remaining: 35,
    accrualStartDate: '2026-01-01',
    expiryDate: '2026-12-31',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'lb-004',
    tenantId: 'tenant-1',
    employeeId: 'emp-002',
    employeeName: 'سارة أحمد',
    employeeNumber: 'EMP002',
    departmentId: 'dept-2',
    departmentName: 'الموارد البشرية',
    leaveTypeId: 'lt-002',
    leaveTypeName: 'إجازة مرضية',
    leaveCategory: 'sick',
    year: 2026,
    entitled: 30,
    carriedOver: 0,
    taken: 3,
    pending: 0,
    remaining: 27,
    accrualStartDate: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-24T00:00:00Z',
  },
  {
    id: 'lb-005',
    tenantId: 'tenant-1',
    employeeId: 'emp-003',
    employeeName: 'محمد الحربي',
    employeeNumber: 'EMP003',
    departmentId: 'dept-1',
    departmentName: 'تقنية المعلومات',
    leaveTypeId: 'lt-001',
    leaveTypeName: 'إجازة سنوية',
    leaveCategory: 'annual',
    year: 2026,
    entitled: 30,
    carriedOver: 0,
    taken: 3,
    pending: 0,
    remaining: 27,
    accrualStartDate: '2026-01-01',
    expiryDate: '2026-12-31',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-17T00:00:00Z',
  },
];

// =====================
// Helper Functions
// =====================

/**
 * حساب عدد أيام العمل بين تاريخين
 */
export function calculateWorkingDays(
  startDate: Date,
  endDate: Date,
  weekendDays: number[] = [5, 6] // الجمعة والسبت
): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (!weekendDays.includes(dayOfWeek)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * تنسيق نطاق التواريخ
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  };
  
  if (start.getFullYear() !== end.getFullYear()) {
    options.year = 'numeric';
  }
  
  const startStr = start.toLocaleDateString('ar-SA', options);
  const endStr = end.toLocaleDateString('ar-SA', { ...options, year: 'numeric' });
  
  return `${startStr} - ${endStr}`;
}

/**
 * الحصول على لون حالة طلب الإجازة
 */
export function getLeaveStatusColor(status: LeaveRequestStatus): string {
  return leaveRequestStatusColors[status];
}

/**
 * الحصول على نسبة الرصيد المستخدم
 */
export function getBalancePercentage(balance: LeaveBalance): number {
  const total = balance.entitled + balance.carriedOver;
  if (total === 0) return 0;
  return Math.round((balance.taken / total) * 100);
}

/**
 * التحقق من إمكانية طلب إجازة
 */
export function canRequestLeave(
  balance: LeaveBalance,
  requestedDays: number,
  allowNegative: boolean = false,
  maxNegative: number = 0
): { allowed: boolean; reason?: string } {
  const available = balance.remaining - balance.pending;
  
  if (requestedDays <= available) {
    return { allowed: true };
  }
  
  if (allowNegative && requestedDays <= available + maxNegative) {
    return { 
      allowed: true, 
      reason: 'سيكون الرصيد سالباً بعد هذه الإجازة' 
    };
  }
  
  return { 
    allowed: false, 
    reason: `الرصيد المتاح (${available} يوم) غير كافٍ` 
  };
}
