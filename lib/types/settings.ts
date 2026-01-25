// نظام الإعدادات المتقدمة - Advanced Settings System

// ==================== إعدادات النظام العامة ====================

export interface SystemSettings {
  general: GeneralSettings;
  localization: LocalizationSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
  backup: BackupSettings;
}

export interface GeneralSettings {
  companyName: string;
  companyNameEn?: string;
  companyLogo?: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  fiscalYearStart: string; // MM-DD
  weekStartDay: 0 | 1 | 5 | 6; // 0=Sunday, 1=Monday, 5=Friday, 6=Saturday
}

export interface LocalizationSettings {
  defaultLanguage: 'ar' | 'en';
  supportedLanguages: ('ar' | 'en')[];
  direction: 'rtl' | 'ltr';
  numberFormat: string;
  calendarType: 'gregorian' | 'hijri' | 'both';
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
    preventReuse: number;
  };
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  twoFactorAuth: 'disabled' | 'optional' | 'required';
  ipWhitelist: string[];
  auditLogging: boolean;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  defaultChannels: ('email' | 'sms' | 'push' | 'in-app')[];
  digestFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export interface IntegrationSettings {
  gosi: GosiIntegration;
  mol: MolIntegration;
  muqeem: MuqeemIntegration;
  mudad: MudadIntegration;
  erpIntegrations: ERPIntegration[];
}

export interface GosiIntegration {
  enabled: boolean;
  subscriberNumber?: string;
  lastSync?: string;
  autoSync: boolean;
}

export interface MolIntegration {
  enabled: boolean;
  establishmentNumber?: string;
  lastSync?: string;
  autoSync: boolean;
}

export interface MuqeemIntegration {
  enabled: boolean;
  username?: string;
  lastSync?: string;
  autoSync: boolean;
}

export interface MudadIntegration {
  enabled: boolean;
  organizationId?: string;
  lastSync?: string;
  autoSync: boolean;
}

export interface ERPIntegration {
  id: string;
  name: string;
  type: 'sap' | 'oracle' | 'odoo' | 'custom';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  config?: Record<string, unknown>;
}

export interface BackupSettings {
  autoBackup: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  includeAttachments: boolean;
  lastBackup?: string;
  nextBackup?: string;
}

// ==================== إعدادات الموارد البشرية ====================

export interface HRSettings {
  employment: EmploymentSettings;
  attendance: AttendanceSettings;
  leaves: LeaveSettings;
  payroll: PayrollSettings;
  performance: PerformanceSettings;
}

export interface EmploymentSettings {
  probationPeriod: number; // days
  noticePeriod: number; // days
  defaultWorkingDays: number[];
  defaultWorkingHours: number;
  overtimeRules: OvertimeRule[];
  endOfServiceFormula: 'saudi-labor-law' | 'custom';
}

export interface OvertimeRule {
  id: string;
  name: string;
  type: 'weekday' | 'weekend' | 'holiday';
  multiplier: number;
  maxHours?: number;
}

export interface AttendanceSettings {
  checkInMethod: ('biometric' | 'mobile' | 'web' | 'manual')[];
  gracePeroidMinutes: number;
  lateDeductionRules: LateDeductionRule[];
  autoCheckoutTime?: string;
  requireLocation: boolean;
  locationRadius?: number; // meters
}

export interface LateDeductionRule {
  id: string;
  fromMinutes: number;
  toMinutes: number;
  deductionType: 'fixed' | 'percentage' | 'hourly';
  deductionValue: number;
}

export interface LeaveSettings {
  leaveTypes: LeaveTypeConfig[];
  accrualMethod: 'monthly' | 'yearly' | 'custom';
  carryOverEnabled: boolean;
  maxCarryOverDays: number;
  encashmentEnabled: boolean;
  maxEncashmentDays: number;
  minAdvanceRequest: number; // days
  maxConsecutiveDays?: number;
}

export interface LeaveTypeConfig {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  annualEntitlement: number;
  isPaid: boolean;
  requiresApproval: boolean;
  requiresAttachment: boolean;
  maxDaysPerRequest?: number;
  minNoticeDays: number;
  applicableGenders: ('male' | 'female')[];
  isActive: boolean;
}

export interface PayrollSettings {
  paymentDay: number;
  paymentMethod: 'bank-transfer' | 'check' | 'cash';
  salaryComponents: SalaryComponent[];
  deductionComponents: DeductionComponent[];
  taxSettings: TaxSettings;
  gosiSettings: GosiSettings;
}

export interface SalaryComponent {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  type: 'fixed' | 'percentage' | 'formula';
  value?: number;
  formula?: string;
  isTaxable: boolean;
  isGosiApplicable: boolean;
  isActive: boolean;
}

export interface DeductionComponent {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  type: 'fixed' | 'percentage' | 'formula';
  value?: number;
  formula?: string;
  isActive: boolean;
}

export interface TaxSettings {
  enabled: boolean;
  taxRates: { from: number; to: number; rate: number }[];
}

export interface GosiSettings {
  employeeContribution: number; // percentage
  employerContribution: number; // percentage
  maxSalary: number;
}

export interface PerformanceSettings {
  reviewCycles: ReviewCycleConfig[];
  ratingScale: RatingScaleConfig;
  goalCategories: string[];
  competencies: CompetencyConfig[];
}

export interface ReviewCycleConfig {
  id: string;
  name: string;
  frequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  startMonth: number;
  selfAssessment: boolean;
  peerReview: boolean;
  managerReview: boolean;
}

export interface RatingScaleConfig {
  min: number;
  max: number;
  labels: { value: number; label: string; labelEn: string }[];
}

export interface CompetencyConfig {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  description?: string;
}

// ==================== إعدادات سير العمل ====================

export interface WorkflowSettings {
  approvalWorkflows: ApprovalWorkflow[];
  escalationRules: EscalationRule[];
  delegationEnabled: boolean;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  type: 'leave' | 'expense' | 'loan' | 'overtime' | 'document' | 'general';
  steps: ApprovalStep[];
  isActive: boolean;
}

export interface ApprovalStep {
  id: string;
  order: number;
  approverType: 'direct-manager' | 'department-head' | 'hr' | 'specific-user' | 'role';
  approverId?: string;
  roleId?: string;
  canSkip: boolean;
  autoApproveAfter?: number; // hours
}

export interface EscalationRule {
  id: string;
  workflowId: string;
  waitHours: number;
  escalateTo: 'skip-level-manager' | 'hr' | 'specific-user';
  escalateToId?: string;
  notifyOriginal: boolean;
}

// ==================== الأدوار والصلاحيات ====================

export interface Role {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  permissions: Permission[];
  isSystem: boolean;
  usersCount: number;
  createdAt: string;
}

export interface Permission {
  id: string;
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'admin';
  granted: boolean;
}

export const moduleLabels: Record<string, string> = {
  'dashboard': 'لوحة التحكم',
  'employees': 'الموظفين',
  'attendance': 'الحضور والانصراف',
  'leaves': 'الإجازات',
  'payroll': 'الرواتب',
  'recruitment': 'التوظيف',
  'performance': 'الأداء',
  'training': 'التدريب',
  'reports': 'التقارير',
  'settings': 'الإعدادات',
};

// ==================== بيانات وهمية ====================

export const mockSystemSettings: SystemSettings = {
  general: {
    companyName: 'شركة المثال للتقنية',
    companyNameEn: 'Example Tech Company',
    timezone: 'Asia/Riyadh',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    currency: 'SAR',
    fiscalYearStart: '01-01',
    weekStartDay: 0,
  },
  localization: {
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en'],
    direction: 'rtl',
    numberFormat: 'ar-SA',
    calendarType: 'both',
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      expiryDays: 90,
      preventReuse: 3,
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: 'optional',
    ipWhitelist: [],
    auditLogging: true,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: false,
    defaultChannels: ['email', 'in-app'],
    digestFrequency: 'immediate',
  },
  integrations: {
    gosi: { enabled: true, subscriberNumber: '12345678', autoSync: true },
    mol: { enabled: true, establishmentNumber: '87654321', autoSync: true },
    muqeem: { enabled: false, autoSync: false },
    mudad: { enabled: true, organizationId: 'MUD-123', autoSync: true },
    erpIntegrations: [],
  },
  backup: {
    autoBackup: true,
    frequency: 'daily',
    retentionDays: 30,
    includeAttachments: true,
    lastBackup: '2024-02-14T02:00:00Z',
    nextBackup: '2024-02-15T02:00:00Z',
  },
};

export const mockRoles: Role[] = [
  {
    id: 'role-admin',
    name: 'مدير النظام',
    nameEn: 'System Administrator',
    description: 'صلاحيات كاملة على النظام',
    permissions: [],
    isSystem: true,
    usersCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-hr',
    name: 'موظف موارد بشرية',
    nameEn: 'HR Employee',
    description: 'إدارة شؤون الموظفين',
    permissions: [],
    isSystem: true,
    usersCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-manager',
    name: 'مدير',
    nameEn: 'Manager',
    description: 'إدارة الفريق والموافقات',
    permissions: [],
    isSystem: true,
    usersCount: 25,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role-employee',
    name: 'موظف',
    nameEn: 'Employee',
    description: 'الخدمة الذاتية الأساسية',
    permissions: [],
    isSystem: true,
    usersCount: 218,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockLeaveTypes: LeaveTypeConfig[] = [
  {
    id: 'lt-annual',
    name: 'إجازة سنوية',
    nameEn: 'Annual Leave',
    code: 'ANNUAL',
    annualEntitlement: 21,
    isPaid: true,
    requiresApproval: true,
    requiresAttachment: false,
    minNoticeDays: 7,
    applicableGenders: ['male', 'female'],
    isActive: true,
  },
  {
    id: 'lt-sick',
    name: 'إجازة مرضية',
    nameEn: 'Sick Leave',
    code: 'SICK',
    annualEntitlement: 30,
    isPaid: true,
    requiresApproval: true,
    requiresAttachment: true,
    minNoticeDays: 0,
    applicableGenders: ['male', 'female'],
    isActive: true,
  },
  {
    id: 'lt-maternity',
    name: 'إجازة أمومة',
    nameEn: 'Maternity Leave',
    code: 'MATERNITY',
    annualEntitlement: 70,
    isPaid: true,
    requiresApproval: true,
    requiresAttachment: true,
    minNoticeDays: 30,
    applicableGenders: ['female'],
    isActive: true,
  },
  {
    id: 'lt-paternity',
    name: 'إجازة أبوة',
    nameEn: 'Paternity Leave',
    code: 'PATERNITY',
    annualEntitlement: 3,
    isPaid: true,
    requiresApproval: true,
    requiresAttachment: true,
    minNoticeDays: 0,
    applicableGenders: ['male'],
    isActive: true,
  },
  {
    id: 'lt-hajj',
    name: 'إجازة حج',
    nameEn: 'Hajj Leave',
    code: 'HAJJ',
    annualEntitlement: 15,
    isPaid: true,
    requiresApproval: true,
    requiresAttachment: false,
    minNoticeDays: 30,
    applicableGenders: ['male', 'female'],
    isActive: true,
  },
];

export const mockWorkflows: ApprovalWorkflow[] = [
  {
    id: 'wf-leave',
    name: 'موافقة الإجازات',
    type: 'leave',
    steps: [
      { id: 'step-1', order: 1, approverType: 'direct-manager', canSkip: false },
      { id: 'step-2', order: 2, approverType: 'hr', canSkip: true },
    ],
    isActive: true,
  },
  {
    id: 'wf-expense',
    name: 'موافقة المصاريف',
    type: 'expense',
    steps: [
      { id: 'step-1', order: 1, approverType: 'direct-manager', canSkip: false },
      { id: 'step-2', order: 2, approverType: 'department-head', canSkip: false },
    ],
    isActive: true,
  },
];
