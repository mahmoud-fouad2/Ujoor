// نظام الخدمة الذاتية للموظفين - Employee Self-Service System

// ==================== الملف الشخصي ====================

export interface EmployeeProfile {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  firstNameEn?: string;
  lastNameEn?: string;
  email: string;
  phone: string;
  avatar?: string;
  departmentId: string;
  departmentName: string;
  jobTitleId: string;
  jobTitle: string;
  managerId?: string;
  managerName?: string;
  hireDate: string;
  birthDate?: string;
  gender: 'male' | 'female';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  nationality?: string;
  nationalId?: string;
  address?: AddressInfo;
  emergencyContact?: EmergencyContact;
  bankInfo?: BankInfo;
  documents?: EmployeeDocument[];
}

export interface AddressInfo {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  iban?: string;
  swiftCode?: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: 'id' | 'passport' | 'contract' | 'certificate' | 'other';
  fileUrl: string;
  expiryDate?: string;
  uploadedAt: string;
}

// ==================== الطلبات ====================

export type SelfServiceRequestType = 
  | 'leave' 
  | 'overtime' 
  | 'expense' 
  | 'loan' 
  | 'certificate' 
  | 'document' 
  | 'training' 
  | 'equipment'
  | 'profile-update'
  | 'remote-work';

export const selfServiceRequestTypeLabels: Record<SelfServiceRequestType, string> = {
  'leave': 'طلب إجازة',
  'overtime': 'طلب عمل إضافي',
  'expense': 'طلب تعويض مصاريف',
  'loan': 'طلب سلفة/قرض',
  'certificate': 'طلب شهادة',
  'document': 'طلب مستند',
  'training': 'طلب تدريب',
  'equipment': 'طلب معدات',
  'profile-update': 'تحديث البيانات',
  'remote-work': 'طلب عمل عن بُعد',
};

export type RequestStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';

export const requestStatusLabels: Record<RequestStatus, string> = {
  'draft': 'مسودة',
  'pending': 'قيد المراجعة',
  'approved': 'موافق عليه',
  'rejected': 'مرفوض',
  'cancelled': 'ملغي',
};

export const requestStatusColors: Record<RequestStatus, string> = {
  'draft': 'bg-gray-100 text-gray-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'approved': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
  'cancelled': 'bg-gray-100 text-gray-800',
};

export interface SelfServiceRequest {
  id: string;
  type: SelfServiceRequestType;
  employeeId: string;
  employeeName: string;
  title: string;
  description?: string;
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  approvers: RequestApprover[];
  comments?: RequestComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface RequestApprover {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  actionAt?: string;
}

export interface RequestComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

// ==================== الإشعارات ====================

export type NotificationType = 
  | 'request-status' 
  | 'approval-needed' 
  | 'reminder' 
  | 'announcement' 
  | 'payslip' 
  | 'document-expiry'
  | 'training'
  | 'system';

export const notificationTypeLabels: Record<NotificationType, string> = {
  'request-status': 'حالة طلب',
  'approval-needed': 'موافقة مطلوبة',
  'reminder': 'تذكير',
  'announcement': 'إعلان',
  'payslip': 'قسيمة راتب',
  'document-expiry': 'انتهاء مستند',
  'training': 'تدريب',
  'system': 'نظام',
};

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ==================== لوحة التحكم الشخصية ====================

export interface EmployeeDashboard {
  profile: {
    name: string;
    jobTitle: string;
    departmentName: string;
    avatar?: string;
  };
  attendance: {
    todayStatus: 'present' | 'absent' | 'late' | 'on-leave' | 'not-checked-in';
    checkInTime?: string;
    checkOutTime?: string;
    workingHoursToday: number;
    workingHoursThisMonth: number;
  };
  leaves: {
    annualBalance: number;
    usedDays: number;
    pendingRequests: number;
  };
  pendingApprovals: number;
  upcomingEvents: DashboardEvent[];
  recentRequests: SelfServiceRequest[];
  notifications: Notification[];
}

export interface DashboardEvent {
  id: string;
  title: string;
  date: string;
  type: 'holiday' | 'training' | 'meeting' | 'birthday' | 'anniversary' | 'other';
}

// ==================== الشهادات والخطابات ====================

export type CertificateType = 
  | 'salary-certificate' 
  | 'experience-certificate' 
  | 'employment-letter'
  | 'no-objection'
  | 'bank-letter'
  | 'custom';

export const certificateTypeLabels: Record<CertificateType, string> = {
  'salary-certificate': 'شهادة راتب',
  'experience-certificate': 'شهادة خبرة',
  'employment-letter': 'خطاب تعريف بالراتب',
  'no-objection': 'عدم ممانعة',
  'bank-letter': 'خطاب للبنك',
  'custom': 'خطاب مخصص',
};

export interface CertificateRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: CertificateType;
  purpose?: string;
  addressedTo?: string;
  language: 'ar' | 'en' | 'both';
  status: RequestStatus;
  generatedDocument?: string;
  requestedAt: string;
  processedAt?: string;
}

// ==================== بيانات وهمية ====================

export const mockEmployeeProfile: EmployeeProfile = {
  id: 'emp-current',
  employeeNumber: 'EMP-001',
  firstName: 'أحمد',
  lastName: 'محمد',
  firstNameEn: 'Ahmed',
  lastNameEn: 'Mohammed',
  email: 'ahmed@company.com',
  phone: '+966501234567',
  avatar: '/images/avatars/1.png',
  departmentId: 'dept-1',
  departmentName: 'تقنية المعلومات',
  jobTitleId: 'jt-1',
  jobTitle: 'مطور برمجيات أول',
  managerId: 'emp-manager',
  managerName: 'محمد علي',
  hireDate: '2020-03-15',
  birthDate: '1990-05-20',
  gender: 'male',
  maritalStatus: 'married',
  nationality: 'سعودي',
  nationalId: '1234567890',
  address: {
    street: 'شارع الملك فهد',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    postalCode: '12345',
  },
  emergencyContact: {
    name: 'محمد أحمد',
    relationship: 'أخ',
    phone: '+966509876543',
  },
  bankInfo: {
    bankName: 'البنك الأهلي',
    accountNumber: '****1234',
    iban: 'SA****1234',
  },
};

export const mockEmployeeDashboard: EmployeeDashboard = {
  profile: {
    name: 'أحمد محمد',
    jobTitle: 'مطور برمجيات أول',
    departmentName: 'تقنية المعلومات',
    avatar: '/images/avatars/1.png',
  },
  attendance: {
    todayStatus: 'present',
    checkInTime: '08:15',
    workingHoursToday: 6.5,
    workingHoursThisMonth: 145,
  },
  leaves: {
    annualBalance: 21,
    usedDays: 8,
    pendingRequests: 1,
  },
  pendingApprovals: 3,
  upcomingEvents: [
    { id: 'evt-1', title: 'عيد الفطر', date: '2024-04-10', type: 'holiday' },
    { id: 'evt-2', title: 'دورة إدارة المشاريع', date: '2024-02-20', type: 'training' },
  ],
  recentRequests: [
    {
      id: 'req-1',
      type: 'leave',
      employeeId: 'emp-current',
      employeeName: 'أحمد محمد',
      title: 'إجازة سنوية',
      status: 'pending',
      priority: 'medium',
      approvers: [],
      createdAt: '2024-02-10T10:00:00Z',
      updatedAt: '2024-02-10T10:00:00Z',
    },
  ],
  notifications: [
    {
      id: 'notif-1',
      type: 'payslip',
      title: 'قسيمة الراتب متاحة',
      message: 'قسيمة راتب شهر يناير 2024 متاحة الآن',
      isRead: false,
      link: '/dashboard/payslips',
      createdAt: '2024-02-01T10:00:00Z',
    },
    {
      id: 'notif-2',
      type: 'approval-needed',
      title: 'طلب بانتظار موافقتك',
      message: 'طلب إجازة من محمد أحمد بانتظار موافقتك',
      isRead: false,
      link: '/dashboard/approvals',
      createdAt: '2024-02-05T10:00:00Z',
    },
  ],
};

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'payslip',
    title: 'قسيمة الراتب متاحة',
    message: 'قسيمة راتب شهر يناير 2024 متاحة الآن للتحميل',
    isRead: false,
    link: '/dashboard/payslips',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'notif-2',
    type: 'approval-needed',
    title: 'طلب بانتظار موافقتك',
    message: 'طلب إجازة من محمد أحمد بانتظار موافقتك',
    isRead: false,
    link: '/dashboard/approvals',
    createdAt: '2024-02-05T10:00:00Z',
  },
  {
    id: 'notif-3',
    type: 'training',
    title: 'تذكير بالدورة التدريبية',
    message: 'دورة إدارة المشاريع تبدأ غداً الساعة 9 صباحاً',
    isRead: true,
    link: '/dashboard/training-courses',
    createdAt: '2024-02-19T10:00:00Z',
  },
  {
    id: 'notif-4',
    type: 'document-expiry',
    title: 'تنبيه انتهاء صلاحية',
    message: 'جواز السفر سينتهي خلال 30 يوم',
    isRead: true,
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: 'notif-5',
    type: 'request-status',
    title: 'تم الموافقة على طلبك',
    message: 'تمت الموافقة على طلب الإجازة الخاص بك',
    isRead: true,
    createdAt: '2024-01-25T10:00:00Z',
  },
];

export const mockMyRequests: SelfServiceRequest[] = [
  {
    id: 'req-1',
    type: 'leave',
    employeeId: 'emp-current',
    employeeName: 'أحمد محمد',
    title: 'إجازة سنوية - 5 أيام',
    description: 'إجازة لظروف عائلية',
    status: 'pending',
    priority: 'medium',
    approvers: [
      { id: 'app-1', name: 'محمد علي', role: 'المدير المباشر', status: 'pending' },
    ],
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
  },
  {
    id: 'req-2',
    type: 'certificate',
    employeeId: 'emp-current',
    employeeName: 'أحمد محمد',
    title: 'طلب شهادة راتب',
    description: 'للتقديم على قرض بنكي',
    status: 'approved',
    priority: 'low',
    approvers: [
      { id: 'app-2', name: 'قسم الموارد البشرية', role: 'HR', status: 'approved', actionAt: '2024-02-08T10:00:00Z' },
    ],
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-08T10:00:00Z',
    resolvedAt: '2024-02-08T10:00:00Z',
  },
  {
    id: 'req-3',
    type: 'training',
    employeeId: 'emp-current',
    employeeName: 'أحمد محمد',
    title: 'طلب حضور دورة تدريبية',
    description: 'دورة في إدارة المشاريع الاحترافية PMP',
    status: 'approved',
    priority: 'medium',
    approvers: [
      { id: 'app-3', name: 'محمد علي', role: 'المدير المباشر', status: 'approved', actionAt: '2024-01-20T10:00:00Z' },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    resolvedAt: '2024-01-20T10:00:00Z',
  },
];
