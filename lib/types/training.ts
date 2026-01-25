// نظام التدريب والتطوير - Training & Development System

// ==================== الدورات التدريبية ====================

export type CourseStatus = 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export const courseStatusLabels: Record<CourseStatus, string> = {
  'draft': 'مسودة',
  'scheduled': 'مجدول',
  'ongoing': 'جاري',
  'completed': 'مكتمل',
  'cancelled': 'ملغي',
};

export const courseStatusColors: Record<CourseStatus, string> = {
  'draft': 'bg-gray-100 text-gray-800',
  'scheduled': 'bg-blue-100 text-blue-800',
  'ongoing': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800',
};

export type CourseType = 'in-person' | 'online' | 'hybrid' | 'self-paced' | 'workshop' | 'conference';

export const courseTypeLabels: Record<CourseType, string> = {
  'in-person': 'حضوري',
  'online': 'عن بُعد',
  'hybrid': 'مختلط',
  'self-paced': 'ذاتي',
  'workshop': 'ورشة عمل',
  'conference': 'مؤتمر',
};

export type CourseCategory = 'technical' | 'soft-skills' | 'leadership' | 'compliance' | 'safety' | 'onboarding' | 'other';

export const courseCategoryLabels: Record<CourseCategory, string> = {
  'technical': 'تقني',
  'soft-skills': 'مهارات شخصية',
  'leadership': 'قيادة',
  'compliance': 'امتثال',
  'safety': 'سلامة',
  'onboarding': 'تهيئة',
  'other': 'أخرى',
};

export interface TrainingCourse {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: CourseCategory;
  type: CourseType;
  status: CourseStatus;
  instructor?: InstructorInfo;
  provider?: string;
  duration: number; // hours
  maxParticipants?: number;
  currentParticipants: number;
  startDate?: string;
  endDate?: string;
  location?: string;
  meetingLink?: string;
  objectives: string[];
  prerequisites?: string[];
  materials?: CourseMaterial[];
  cost?: number;
  currency?: string;
  isMandatory: boolean;
  targetDepartments?: string[];
  targetRoles?: string[];
  certificate?: CertificateInfo;
  rating?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorInfo {
  id: string;
  name: string;
  nameEn?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  isExternal: boolean;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'presentation' | 'other';
  url: string;
  size?: number;
}

export interface CertificateInfo {
  name: string;
  validityPeriod?: number; // months
  expiryDate?: string;
}

// ==================== تسجيل الموظفين ====================

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'enrolled' | 'in-progress' | 'completed' | 'failed' | 'withdrawn';

export const enrollmentStatusLabels: Record<EnrollmentStatus, string> = {
  'pending': 'بانتظار الموافقة',
  'approved': 'موافق عليه',
  'rejected': 'مرفوض',
  'enrolled': 'مسجل',
  'in-progress': 'قيد التدريب',
  'completed': 'مكتمل',
  'failed': 'راسب',
  'withdrawn': 'منسحب',
};

export const enrollmentStatusColors: Record<EnrollmentStatus, string> = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'approved': 'bg-blue-100 text-blue-800',
  'rejected': 'bg-red-100 text-red-800',
  'enrolled': 'bg-purple-100 text-purple-800',
  'in-progress': 'bg-cyan-100 text-cyan-800',
  'completed': 'bg-green-100 text-green-800',
  'failed': 'bg-orange-100 text-orange-800',
  'withdrawn': 'bg-gray-100 text-gray-800',
};

export interface CourseEnrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  departmentName: string;
  status: EnrollmentStatus;
  enrollmentDate: string;
  approvedBy?: string;
  approvedAt?: string;
  startDate?: string;
  completionDate?: string;
  progress: number; // 0-100
  score?: number;
  grade?: string;
  feedback?: string;
  certificate?: EmployeeCertificate;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeCertificate {
  id: string;
  name: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  verificationCode?: string;
}

// ==================== خطط التطوير ====================

export type DevelopmentPlanStatus = 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';

export const developmentPlanStatusLabels: Record<DevelopmentPlanStatus, string> = {
  'draft': 'مسودة',
  'active': 'نشط',
  'on-hold': 'معلق',
  'completed': 'مكتمل',
  'cancelled': 'ملغي',
};

export const developmentPlanStatusColors: Record<DevelopmentPlanStatus, string> = {
  'draft': 'bg-gray-100 text-gray-800',
  'active': 'bg-green-100 text-green-800',
  'on-hold': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-blue-100 text-blue-800',
  'cancelled': 'bg-red-100 text-red-800',
};

export interface DevelopmentPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  title: string;
  description?: string;
  status: DevelopmentPlanStatus;
  startDate: string;
  targetDate: string;
  goals: DevelopmentGoal[];
  activities: DevelopmentActivity[];
  mentor?: MentorInfo;
  progress: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorInfo {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
}

export interface DevelopmentGoal {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  metrics?: string;
}

export interface DevelopmentActivity {
  id: string;
  title: string;
  type: 'course' | 'assignment' | 'mentoring' | 'reading' | 'project' | 'certification' | 'other';
  description?: string;
  courseId?: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  notes?: string;
}

export const activityTypeLabels: Record<DevelopmentActivity['type'], string> = {
  'course': 'دورة تدريبية',
  'assignment': 'مهمة',
  'mentoring': 'توجيه',
  'reading': 'قراءة',
  'project': 'مشروع',
  'certification': 'شهادة',
  'other': 'أخرى',
};

// ==================== المهارات والكفاءات ====================

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export const skillLevelLabels: Record<SkillLevel, string> = {
  'beginner': 'مبتدئ',
  'intermediate': 'متوسط',
  'advanced': 'متقدم',
  'expert': 'خبير',
};

export const skillLevelColors: Record<SkillLevel, string> = {
  'beginner': 'bg-blue-100 text-blue-800',
  'intermediate': 'bg-yellow-100 text-yellow-800',
  'advanced': 'bg-green-100 text-green-800',
  'expert': 'bg-purple-100 text-purple-800',
};

export interface Skill {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  description?: string;
}

export interface EmployeeSkill {
  id: string;
  employeeId: string;
  skillId: string;
  skillName: string;
  level: SkillLevel;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  requiredLevel: SkillLevel;
  currentLevel?: SkillLevel;
  gap: number; // 0-3 (levels difference)
  priority: 'low' | 'medium' | 'high';
  suggestedCourses?: string[];
}

// ==================== طلبات التدريب ====================

export type TrainingRequestStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export const trainingRequestStatusLabels: Record<TrainingRequestStatus, string> = {
  'pending': 'بانتظار الموافقة',
  'approved': 'موافق عليه',
  'rejected': 'مرفوض',
  'completed': 'مكتمل',
};

export const trainingRequestStatusColors: Record<TrainingRequestStatus, string> = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'approved': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
  'completed': 'bg-blue-100 text-blue-800',
};

export interface TrainingRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  courseId?: string;
  courseTitle?: string;
  externalCourse?: {
    name: string;
    provider: string;
    url?: string;
    cost: number;
    startDate: string;
    endDate: string;
  };
  reason: string;
  status: TrainingRequestStatus;
  approvers: RequestApprover[];
  submittedAt: string;
  processedAt?: string;
  comments?: string;
}

export interface RequestApprover {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  actionAt?: string;
}

// ==================== إحصائيات التدريب ====================

export interface TrainingStats {
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
  completedEnrollments: number;
  pendingRequests: number;
  totalHoursCompleted: number;
  averageScore: number;
  certificationRate: number;
  budgetUsed: number;
  budgetTotal: number;
  enrollmentsByCategory: { category: CourseCategory; count: number }[];
  completionTrend: { month: string; completed: number; enrolled: number }[];
  topCourses: { courseId: string; title: string; enrollments: number; rating: number }[];
}

// ==================== بيانات وهمية ====================

export const mockCourses: TrainingCourse[] = [
  {
    id: 'course-1',
    title: 'مهارات التواصل الفعّال',
    titleEn: 'Effective Communication Skills',
    description: 'دورة شاملة لتطوير مهارات التواصل في بيئة العمل',
    category: 'soft-skills',
    type: 'in-person',
    status: 'scheduled',
    instructor: {
      id: 'inst-1',
      name: 'د. محمد الأحمد',
      title: 'مدرب معتمد',
      isExternal: true,
    },
    duration: 16,
    maxParticipants: 20,
    currentParticipants: 12,
    startDate: '2024-02-15',
    endDate: '2024-02-16',
    location: 'قاعة التدريب الرئيسية',
    objectives: [
      'فهم أساسيات التواصل الفعّال',
      'تطوير مهارات الاستماع النشط',
      'تحسين مهارات العرض والتقديم',
    ],
    isMandatory: false,
    rating: 4.5,
    createdBy: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'course-2',
    title: 'أساسيات إدارة المشاريع',
    titleEn: 'Project Management Fundamentals',
    description: 'تعلم أساسيات إدارة المشاريع ومنهجيات مختلفة',
    category: 'leadership',
    type: 'online',
    status: 'ongoing',
    provider: 'أكاديمية الإدارة',
    duration: 24,
    maxParticipants: 30,
    currentParticipants: 25,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    meetingLink: 'https://meet.example.com/pm-course',
    objectives: [
      'فهم دورة حياة المشروع',
      'تعلم أدوات التخطيط والمتابعة',
      'إدارة المخاطر والتحديات',
    ],
    certificate: {
      name: 'شهادة أساسيات إدارة المشاريع',
      validityPeriod: 24,
    },
    isMandatory: false,
    rating: 4.2,
    createdBy: 'admin',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'course-3',
    title: 'السلامة المهنية',
    titleEn: 'Occupational Safety',
    description: 'دورة إلزامية عن السلامة والصحة المهنية',
    category: 'safety',
    type: 'self-paced',
    status: 'ongoing',
    duration: 4,
    currentParticipants: 150,
    objectives: [
      'التعرف على مخاطر بيئة العمل',
      'إجراءات الطوارئ والإخلاء',
      'استخدام معدات الوقاية',
    ],
    isMandatory: true,
    rating: 4.0,
    createdBy: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
];

export const mockEnrollments: CourseEnrollment[] = [
  {
    id: 'enroll-1',
    courseId: 'course-1',
    courseTitle: 'مهارات التواصل الفعّال',
    employeeId: 'emp-1',
    employeeName: 'أحمد محمد',
    departmentName: 'تقنية المعلومات',
    status: 'enrolled',
    enrollmentDate: '2024-01-20',
    progress: 0,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'enroll-2',
    courseId: 'course-2',
    courseTitle: 'أساسيات إدارة المشاريع',
    employeeId: 'emp-2',
    employeeName: 'سارة علي',
    departmentName: 'المشاريع',
    status: 'in-progress',
    enrollmentDate: '2024-02-01',
    startDate: '2024-02-01',
    progress: 65,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
  },
  {
    id: 'enroll-3',
    courseId: 'course-3',
    courseTitle: 'السلامة المهنية',
    employeeId: 'emp-1',
    employeeName: 'أحمد محمد',
    departmentName: 'تقنية المعلومات',
    status: 'completed',
    enrollmentDate: '2024-01-05',
    startDate: '2024-01-05',
    completionDate: '2024-01-08',
    progress: 100,
    score: 92,
    grade: 'A',
    certificate: {
      id: 'cert-1',
      name: 'شهادة السلامة المهنية',
      issueDate: '2024-01-08',
      expiryDate: '2025-01-08',
    },
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z',
  },
];

export const mockTrainingStats: TrainingStats = {
  totalCourses: 25,
  activeCourses: 8,
  totalEnrollments: 342,
  completedEnrollments: 256,
  pendingRequests: 12,
  totalHoursCompleted: 1520,
  averageScore: 84.5,
  certificationRate: 78,
  budgetUsed: 45000,
  budgetTotal: 100000,
  enrollmentsByCategory: [
    { category: 'technical', count: 120 },
    { category: 'soft-skills', count: 85 },
    { category: 'leadership', count: 45 },
    { category: 'compliance', count: 62 },
    { category: 'safety', count: 30 },
  ],
  completionTrend: [
    { month: 'يناير', completed: 45, enrolled: 60 },
    { month: 'فبراير', completed: 52, enrolled: 70 },
    { month: 'مارس', completed: 48, enrolled: 55 },
    { month: 'أبريل', completed: 55, enrolled: 65 },
  ],
  topCourses: [
    { courseId: 'course-1', title: 'مهارات التواصل الفعّال', enrollments: 45, rating: 4.5 },
    { courseId: 'course-2', title: 'أساسيات إدارة المشاريع', enrollments: 38, rating: 4.2 },
    { courseId: 'course-3', title: 'السلامة المهنية', enrollments: 150, rating: 4.0 },
  ],
};
