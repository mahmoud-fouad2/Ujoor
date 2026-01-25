/**
 * Core HR Types & Interfaces
 * أنواع بيانات الموارد البشرية الأساسية (Phase 3)
 */

// ===== Employee Types =====
export type EmployeeStatus = "active" | "onboarding" | "on_leave" | "terminated";
export type Gender = "male" | "female";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type ContractType = "full_time" | "part_time" | "contract" | "intern";

export interface Employee {
  id: string;
  employeeNumber: string; // الرقم الوظيفي
  
  // Personal Info
  firstName: string;
  firstNameAr?: string;
  lastName: string;
  lastNameAr?: string;
  email: string;
  phone?: string;
  nationalId?: string;
  nationality?: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  
  // Employment Info
  departmentId: string;
  jobTitleId: string;
  managerId?: string; // المدير المباشر
  branchId?: string;
  hireDate: string;
  contractType: ContractType;
  probationEndDate?: string;
  
  // Status
  status: EmployeeStatus;
  terminationDate?: string;
  terminationReason?: string;
  
  // Salary (basic info, full payroll in Phase 5)
  basicSalary?: number;
  currency?: string;
  
  // Metadata
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface EmployeeCreateInput {
  employeeNumber?: string; // auto-generate if empty
  firstName: string;
  firstNameAr?: string;
  lastName: string;
  lastNameAr?: string;
  email: string;
  phone?: string;
  nationalId?: string;
  departmentId: string;
  jobTitleId: string;
  managerId?: string;
  hireDate: string;
  contractType: ContractType;
  basicSalary?: number;
}

// ===== Department Types =====
export interface Department {
  id: string;
  name: string;
  nameAr?: string;
  code?: string;
  description?: string;
  parentId?: string; // للأقسام الفرعية
  managerId?: string; // مدير القسم (employee id)
  employeesCount: number;
  
  // Metadata
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentCreateInput {
  name: string;
  nameAr?: string;
  code?: string;
  description?: string;
  parentId?: string;
  managerId?: string;
}

// ===== Job Title Types =====
export interface JobTitle {
  id: string;
  name: string;
  nameAr?: string;
  code?: string;
  description?: string;
  level?: number; // 1=Entry, 2=Mid, 3=Senior, 4=Manager, 5=Director, 6=Executive
  minSalary?: number;
  maxSalary?: number;
  employeesCount: number;
  
  // Metadata
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobTitleCreateInput {
  name: string;
  nameAr?: string;
  code?: string;
  description?: string;
  level?: number;
  minSalary?: number;
  maxSalary?: number;
}

// ===== Branch Types =====
export interface Branch {
  id: string;
  name: string;
  nameAr?: string;
  code?: string;
  address?: string;
  city?: string;
  country: string;
  phone?: string;
  email?: string;
  isHeadquarters: boolean;
  employeesCount: number;
  
  // Metadata
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Organization Profile =====
export interface OrganizationProfile {
  id: string;
  tenantId: string;
  
  // Basic Info
  name: string;
  nameAr?: string;
  commercialRegister?: string;
  taxNumber?: string;
  
  // Contact
  address?: string;
  city?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // Logo
  logoUrl?: string;
  
  // Metadata
  updatedAt: string;
}

// ===== Mock Data =====
export const mockDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Human Resources",
    nameAr: "الموارد البشرية",
    code: "HR",
    description: "إدارة شؤون الموظفين والتوظيف",
    employeesCount: 8,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "dept-2",
    name: "Information Technology",
    nameAr: "تقنية المعلومات",
    code: "IT",
    description: "البنية التحتية والأنظمة",
    employeesCount: 15,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "dept-3",
    name: "Finance",
    nameAr: "المالية",
    code: "FIN",
    description: "المحاسبة والشؤون المالية",
    employeesCount: 6,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "dept-4",
    name: "Sales",
    nameAr: "المبيعات",
    code: "SALES",
    description: "فريق المبيعات وتطوير الأعمال",
    employeesCount: 20,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "dept-5",
    name: "Operations",
    nameAr: "العمليات",
    code: "OPS",
    description: "إدارة العمليات والتشغيل",
    employeesCount: 12,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
];

export const mockJobTitles: JobTitle[] = [
  {
    id: "job-1",
    name: "Software Engineer",
    nameAr: "مهندس برمجيات",
    code: "SE",
    level: 2,
    minSalary: 12000,
    maxSalary: 20000,
    employeesCount: 8,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "job-2",
    name: "Senior Software Engineer",
    nameAr: "مهندس برمجيات أول",
    code: "SSE",
    level: 3,
    minSalary: 18000,
    maxSalary: 28000,
    employeesCount: 4,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "job-3",
    name: "HR Specialist",
    nameAr: "أخصائي موارد بشرية",
    code: "HRS",
    level: 2,
    minSalary: 8000,
    maxSalary: 14000,
    employeesCount: 3,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "job-4",
    name: "Accountant",
    nameAr: "محاسب",
    code: "ACC",
    level: 2,
    minSalary: 7000,
    maxSalary: 12000,
    employeesCount: 4,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "job-5",
    name: "Department Manager",
    nameAr: "مدير قسم",
    code: "MGR",
    level: 4,
    minSalary: 20000,
    maxSalary: 35000,
    employeesCount: 5,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "job-6",
    name: "Sales Representative",
    nameAr: "مندوب مبيعات",
    code: "SR",
    level: 1,
    minSalary: 5000,
    maxSalary: 9000,
    employeesCount: 12,
    tenantId: "tenant-1",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
];

export const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    employeeNumber: "EMP001",
    firstName: "Ahmed",
    firstNameAr: "أحمد",
    lastName: "Al-Saud",
    lastNameAr: "آل سعود",
    email: "ahmed@company.sa",
    phone: "+966501234567",
    nationalId: "1234567890",
    nationality: "SA",
    gender: "male",
    maritalStatus: "married",
    departmentId: "dept-2",
    jobTitleId: "job-2",
    hireDate: "2024-03-15",
    contractType: "full_time",
    status: "active",
    basicSalary: 22000,
    currency: "SAR",
    tenantId: "tenant-1",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    createdBy: "admin",
  },
  {
    id: "emp-2",
    employeeNumber: "EMP002",
    firstName: "Fatima",
    firstNameAr: "فاطمة",
    lastName: "Al-Rashid",
    lastNameAr: "الراشد",
    email: "fatima@company.sa",
    phone: "+966502345678",
    gender: "female",
    maritalStatus: "single",
    departmentId: "dept-1",
    jobTitleId: "job-3",
    hireDate: "2024-06-01",
    contractType: "full_time",
    status: "active",
    basicSalary: 11000,
    currency: "SAR",
    tenantId: "tenant-1",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    createdBy: "admin",
  },
  {
    id: "emp-3",
    employeeNumber: "EMP003",
    firstName: "Mohammed",
    firstNameAr: "محمد",
    lastName: "Al-Harbi",
    lastNameAr: "الحربي",
    email: "mohammed@company.sa",
    phone: "+966503456789",
    gender: "male",
    maritalStatus: "married",
    departmentId: "dept-3",
    jobTitleId: "job-4",
    hireDate: "2025-01-10",
    contractType: "full_time",
    status: "active",
    basicSalary: 9500,
    currency: "SAR",
    tenantId: "tenant-1",
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    createdBy: "admin",
  },
  {
    id: "emp-4",
    employeeNumber: "EMP004",
    firstName: "Sara",
    firstNameAr: "سارة",
    lastName: "Al-Otaibi",
    lastNameAr: "العتيبي",
    email: "sara@company.sa",
    gender: "female",
    departmentId: "dept-4",
    jobTitleId: "job-6",
    hireDate: "2025-06-15",
    contractType: "full_time",
    status: "onboarding",
    basicSalary: 7000,
    currency: "SAR",
    tenantId: "tenant-1",
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    createdBy: "admin",
  },
  {
    id: "emp-5",
    employeeNumber: "EMP005",
    firstName: "Khalid",
    firstNameAr: "خالد",
    lastName: "Al-Ghamdi",
    lastNameAr: "الغامدي",
    email: "khalid@company.sa",
    gender: "male",
    departmentId: "dept-5",
    jobTitleId: "job-5",
    managerId: undefined,
    hireDate: "2023-08-20",
    contractType: "full_time",
    status: "active",
    basicSalary: 28000,
    currency: "SAR",
    tenantId: "tenant-1",
    createdAt: "2023-08-20T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    createdBy: "admin",
  },
];

// Helper to get display name (Arabic if available, else English)
export function getDisplayName(item: { name: string; nameAr?: string }, locale: "ar" | "en" = "ar"): string {
  if (locale === "ar" && item.nameAr) return item.nameAr;
  return item.name;
}

// Helper to get employee full name
export function getEmployeeFullName(emp: Employee, locale: "ar" | "en" = "ar"): string {
  if (locale === "ar" && emp.firstNameAr && emp.lastNameAr) {
    return `${emp.firstNameAr} ${emp.lastNameAr}`;
  }
  return `${emp.firstName} ${emp.lastName}`;
}

// Get level label
export function getLevelLabel(level?: number): string {
  const levels: Record<number, string> = {
    1: "Entry Level",
    2: "Mid Level",
    3: "Senior",
    4: "Manager",
    5: "Director",
    6: "Executive",
  };
  return level ? levels[level] ?? "Unknown" : "Not Set";
}

export function getLevelLabelAr(level?: number): string {
  const levels: Record<number, string> = {
    1: "مبتدئ",
    2: "متوسط",
    3: "أول",
    4: "مدير",
    5: "مدير تنفيذي",
    6: "قيادي",
  };
  return level ? levels[level] ?? "غير معروف" : "غير محدد";
}
