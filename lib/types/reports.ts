// نظام التقارير والتحليلات - Reports & Analytics System

// ==================== أنواع التقارير ====================

export type ReportCategory = 
  | 'hr' 
  | 'payroll' 
  | 'attendance' 
  | 'leaves' 
  | 'performance' 
  | 'recruitment' 
  | 'training'
  | 'custom';

export const reportCategoryLabels: Record<ReportCategory, string> = {
  'hr': 'الموارد البشرية',
  'payroll': 'الرواتب',
  'attendance': 'الحضور والانصراف',
  'leaves': 'الإجازات',
  'performance': 'الأداء',
  'recruitment': 'التوظيف',
  'training': 'التدريب',
  'custom': 'تقارير مخصصة',
};

export type ReportFormat = 'table' | 'chart' | 'pivot' | 'summary';

export interface ReportDefinition {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  category: ReportCategory;
  format: ReportFormat;
  icon?: string;
  parameters?: ReportParameter[];
  columns?: ReportColumn[];
  isFavorite?: boolean;
  isScheduled?: boolean;
  lastRun?: string;
  createdBy?: string;
  createdAt: string;
}

export interface ReportParameter {
  id: string;
  name: string;
  type: 'date' | 'daterange' | 'select' | 'multiselect' | 'text' | 'number';
  required: boolean;
  defaultValue?: unknown;
  options?: { value: string; label: string }[];
}

export interface ReportColumn {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'percentage' | 'boolean';
  sortable?: boolean;
  filterable?: boolean;
  aggregatable?: boolean;
}

// ==================== التقارير المجدولة ====================

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export const scheduleFrequencyLabels: Record<ScheduleFrequency, string> = {
  'daily': 'يومياً',
  'weekly': 'أسبوعياً',
  'monthly': 'شهرياً',
  'quarterly': 'ربع سنوياً',
  'yearly': 'سنوياً',
};

export interface ScheduledReport {
  id: string;
  reportId: string;
  reportName: string;
  frequency: ScheduleFrequency;
  dayOfWeek?: number; // 0-6 للأسبوعي
  dayOfMonth?: number; // 1-31 للشهري
  time: string; // HH:mm
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  isActive: boolean;
  lastRun?: string;
  nextRun: string;
  createdAt: string;
}

// ==================== لوحات التحليلات ====================

export interface AnalyticsDashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  isDefault?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type WidgetType = 
  | 'kpi' 
  | 'chart-bar' 
  | 'chart-line' 
  | 'chart-pie' 
  | 'chart-donut'
  | 'table' 
  | 'trend' 
  | 'comparison';

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  size: 'small' | 'medium' | 'large' | 'full';
  dataSource: string;
  config?: Record<string, unknown>;
  position: { x: number; y: number };
}

// ==================== مؤشرات الأداء الرئيسية ====================

export interface KPIMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  target?: number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  category: string;
  description?: string;
  lastUpdated: string;
}

// ==================== إحصائيات الموارد البشرية ====================

export interface HRAnalytics {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  terminations: number;
  turnoverRate: number;
  averageTenure: number;
  headcountByDepartment: { department: string; count: number }[];
  headcountByNationality: { nationality: string; count: number }[];
  ageDistribution: { range: string; count: number }[];
  genderDistribution: { gender: string; count: number }[];
  employmentTypeDistribution: { type: string; count: number }[];
}

export interface AttendanceAnalytics {
  averageAttendanceRate: number;
  lateArrivals: number;
  earlyDepartures: number;
  absences: number;
  averageWorkingHours: number;
  overtimeHours: number;
  attendanceByDepartment: { department: string; rate: number }[];
  attendanceTrend: { date: string; rate: number }[];
}

export interface PayrollAnalytics {
  totalPayroll: number;
  averageSalary: number;
  salaryByDepartment: { department: string; total: number; average: number }[];
  salaryDistribution: { range: string; count: number }[];
  payrollTrend: { month: string; total: number }[];
  allowancesBreakdown: { type: string; amount: number }[];
  deductionsBreakdown: { type: string; amount: number }[];
}

// ==================== بيانات وهمية ====================

export const mockReports: ReportDefinition[] = [
  {
    id: 'rpt-1',
    name: 'تقرير الموظفين الشامل',
    description: 'قائمة بجميع الموظفين مع بياناتهم الأساسية',
    category: 'hr',
    format: 'table',
    isFavorite: true,
    lastRun: '2024-02-10T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rpt-2',
    name: 'تقرير الرواتب الشهري',
    description: 'تفاصيل رواتب جميع الموظفين',
    category: 'payroll',
    format: 'table',
    isFavorite: true,
    lastRun: '2024-02-01T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rpt-3',
    name: 'تقرير الحضور والانصراف',
    description: 'سجل حضور الموظفين اليومي',
    category: 'attendance',
    format: 'table',
    lastRun: '2024-02-15T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rpt-4',
    name: 'تقرير أرصدة الإجازات',
    description: 'أرصدة إجازات جميع الموظفين',
    category: 'leaves',
    format: 'table',
    lastRun: '2024-02-12T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rpt-5',
    name: 'تقرير التوظيف',
    description: 'إحصائيات التوظيف والمتقدمين',
    category: 'recruitment',
    format: 'chart',
    lastRun: '2024-02-08T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rpt-6',
    name: 'تقرير نتائج التقييم',
    description: 'نتائج تقييمات الأداء',
    category: 'performance',
    format: 'summary',
    lastRun: '2024-01-30T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rpt-7',
    name: 'تقرير التدريب',
    description: 'إحصائيات الدورات والتسجيلات',
    category: 'training',
    format: 'chart',
    lastRun: '2024-02-05T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rpt-8',
    name: 'تحليل معدل الدوران الوظيفي',
    description: 'تحليل نسبة ترك العمل',
    category: 'hr',
    format: 'chart',
    isFavorite: true,
    lastRun: '2024-02-01T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockScheduledReports: ScheduledReport[] = [
  {
    id: 'sch-1',
    reportId: 'rpt-2',
    reportName: 'تقرير الرواتب الشهري',
    frequency: 'monthly',
    dayOfMonth: 28,
    time: '08:00',
    recipients: ['hr@company.com', 'finance@company.com'],
    format: 'excel',
    isActive: true,
    lastRun: '2024-01-28T08:00:00Z',
    nextRun: '2024-02-28T08:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sch-2',
    reportId: 'rpt-3',
    reportName: 'تقرير الحضور والانصراف',
    frequency: 'weekly',
    dayOfWeek: 0,
    time: '09:00',
    recipients: ['managers@company.com'],
    format: 'pdf',
    isActive: true,
    lastRun: '2024-02-11T09:00:00Z',
    nextRun: '2024-02-18T09:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockKPIs: KPIMetric[] = [
  {
    id: 'kpi-1',
    name: 'إجمالي الموظفين',
    value: 250,
    previousValue: 245,
    trend: 'up',
    trendPercentage: 2,
    category: 'hr',
    lastUpdated: '2024-02-15T00:00:00Z',
  },
  {
    id: 'kpi-2',
    name: 'معدل الدوران الوظيفي',
    value: 8.5,
    previousValue: 10.2,
    target: 10,
    unit: '%',
    trend: 'down',
    trendPercentage: -16.7,
    category: 'hr',
    lastUpdated: '2024-02-15T00:00:00Z',
  },
  {
    id: 'kpi-3',
    name: 'معدل الحضور',
    value: 94.5,
    previousValue: 93.8,
    target: 95,
    unit: '%',
    trend: 'up',
    trendPercentage: 0.7,
    category: 'attendance',
    lastUpdated: '2024-02-15T00:00:00Z',
  },
  {
    id: 'kpi-4',
    name: 'متوسط الراتب',
    value: 12500,
    previousValue: 12000,
    unit: 'ر.س',
    trend: 'up',
    trendPercentage: 4.2,
    category: 'payroll',
    lastUpdated: '2024-02-15T00:00:00Z',
  },
  {
    id: 'kpi-5',
    name: 'الوظائف الشاغرة',
    value: 12,
    previousValue: 8,
    trend: 'up',
    trendPercentage: 50,
    category: 'recruitment',
    lastUpdated: '2024-02-15T00:00:00Z',
  },
  {
    id: 'kpi-6',
    name: 'معدل إكمال التدريب',
    value: 78,
    previousValue: 72,
    target: 85,
    unit: '%',
    trend: 'up',
    trendPercentage: 8.3,
    category: 'training',
    lastUpdated: '2024-02-15T00:00:00Z',
  },
];

export const mockHRAnalytics: HRAnalytics = {
  totalEmployees: 250,
  activeEmployees: 245,
  newHires: 15,
  terminations: 5,
  turnoverRate: 8.5,
  averageTenure: 3.5,
  headcountByDepartment: [
    { department: 'تقنية المعلومات', count: 45 },
    { department: 'المبيعات', count: 60 },
    { department: 'الموارد البشرية', count: 15 },
    { department: 'المالية', count: 25 },
    { department: 'العمليات', count: 55 },
    { department: 'التسويق', count: 30 },
    { department: 'الإدارة', count: 20 },
  ],
  headcountByNationality: [
    { nationality: 'سعودي', count: 175 },
    { nationality: 'مصري', count: 30 },
    { nationality: 'أردني', count: 20 },
    { nationality: 'هندي', count: 15 },
    { nationality: 'أخرى', count: 10 },
  ],
  ageDistribution: [
    { range: '18-25', count: 35 },
    { range: '26-35', count: 95 },
    { range: '36-45', count: 75 },
    { range: '46-55', count: 35 },
    { range: '55+', count: 10 },
  ],
  genderDistribution: [
    { gender: 'ذكر', count: 180 },
    { gender: 'أنثى', count: 70 },
  ],
  employmentTypeDistribution: [
    { type: 'دوام كامل', count: 220 },
    { type: 'دوام جزئي', count: 15 },
    { type: 'عقد مؤقت', count: 10 },
    { type: 'متدرب', count: 5 },
  ],
};

export const mockAttendanceAnalytics: AttendanceAnalytics = {
  averageAttendanceRate: 94.5,
  lateArrivals: 45,
  earlyDepartures: 20,
  absences: 12,
  averageWorkingHours: 8.2,
  overtimeHours: 320,
  attendanceByDepartment: [
    { department: 'تقنية المعلومات', rate: 96 },
    { department: 'المبيعات', rate: 92 },
    { department: 'الموارد البشرية', rate: 98 },
    { department: 'المالية', rate: 95 },
    { department: 'العمليات', rate: 93 },
    { department: 'التسويق', rate: 94 },
  ],
  attendanceTrend: [
    { date: '2024-02-01', rate: 95 },
    { date: '2024-02-02', rate: 93 },
    { date: '2024-02-03', rate: 94 },
    { date: '2024-02-04', rate: 96 },
    { date: '2024-02-05', rate: 92 },
    { date: '2024-02-06', rate: 95 },
    { date: '2024-02-07', rate: 94 },
  ],
};

export const mockPayrollAnalytics: PayrollAnalytics = {
  totalPayroll: 3125000,
  averageSalary: 12500,
  salaryByDepartment: [
    { department: 'تقنية المعلومات', total: 675000, average: 15000 },
    { department: 'المبيعات', total: 720000, average: 12000 },
    { department: 'الموارد البشرية', total: 180000, average: 12000 },
    { department: 'المالية', total: 350000, average: 14000 },
    { department: 'العمليات', total: 605000, average: 11000 },
    { department: 'التسويق', total: 390000, average: 13000 },
    { department: 'الإدارة', total: 400000, average: 20000 },
  ],
  salaryDistribution: [
    { range: '< 5,000', count: 15 },
    { range: '5,000 - 10,000', count: 75 },
    { range: '10,000 - 15,000', count: 90 },
    { range: '15,000 - 20,000', count: 45 },
    { range: '> 20,000', count: 25 },
  ],
  payrollTrend: [
    { month: 'سبتمبر', total: 2950000 },
    { month: 'أكتوبر', total: 3000000 },
    { month: 'نوفمبر', total: 3050000 },
    { month: 'ديسمبر', total: 3100000 },
    { month: 'يناير', total: 3125000 },
  ],
  allowancesBreakdown: [
    { type: 'بدل سكن', amount: 625000 },
    { type: 'بدل مواصلات', amount: 187500 },
    { type: 'بدل طعام', amount: 125000 },
    { type: 'بدلات أخرى', amount: 93750 },
  ],
  deductionsBreakdown: [
    { type: 'تأمينات اجتماعية', amount: 281250 },
    { type: 'ضريبة الدخل', amount: 0 },
    { type: 'خصومات أخرى', amount: 31250 },
  ],
};
