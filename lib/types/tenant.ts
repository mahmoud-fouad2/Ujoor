/**
 * Tenant Types & Interfaces
 * أنواع بيانات الشركات (Tenants)
 */

export type TenantStatus = "active" | "suspended" | "pending" | "deleted";
export type SubscriptionPlan = "starter" | "business" | "enterprise";

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  status: TenantStatus;
  plan: SubscriptionPlan;
  
  // Company Info
  commercialRegister?: string;
  taxNumber?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country: string;
  
  // Settings
  defaultLocale: "ar" | "en";
  defaultTheme: "shadcn" | "mantine";
  timezone: string;
  
  // Metadata
  usersCount: number;
  employeesCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Soft delete
  deletedAt?: string;
  suspendedAt?: string;
  suspendedReason?: string;
}

export interface TenantCreateInput {
  slug: string;
  name: string;
  nameAr: string;
  email: string;
  phone?: string;
  commercialRegister?: string;
  plan: SubscriptionPlan;
  defaultLocale: "ar" | "en";
  defaultTheme: "shadcn" | "mantine";
  
  // Company Admin
  adminName: string;
  adminEmail: string;
}

export interface TenantUpdateInput {
  name?: string;
  nameAr?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  defaultLocale?: "ar" | "en";
  defaultTheme?: "shadcn" | "mantine";
  plan?: SubscriptionPlan;
}

export interface SubscriptionRequest {
  id: string;
  companyName: string;
  companyNameAr?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  employeesCount?: string; // "1-10", "11-50", "51-200", "200+"
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

// Mock data for development
export const mockTenants: Tenant[] = [
  {
    id: "1",
    slug: "elite-tech",
    name: "Elite Technology Co.",
    nameAr: "شركة النخبة للتقنية",
    status: "active",
    plan: "business",
    email: "admin@elite-tech.sa",
    phone: "+966501234567",
    country: "SA",
    city: "Riyadh",
    defaultLocale: "ar",
    defaultTheme: "shadcn",
    timezone: "Asia/Riyadh",
    usersCount: 45,
    employeesCount: 120,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-20T14:30:00Z",
    createdBy: "super-admin",
  },
  {
    id: "2",
    slug: "riyadh-trading",
    name: "Riyadh Trading Est.",
    nameAr: "مؤسسة الرياض التجارية",
    status: "active",
    plan: "starter",
    email: "info@riyadh-trading.sa",
    country: "SA",
    city: "Riyadh",
    defaultLocale: "ar",
    defaultTheme: "shadcn",
    timezone: "Asia/Riyadh",
    usersCount: 32,
    employeesCount: 85,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-18T11:20:00Z",
    createdBy: "super-admin",
  },
  {
    id: "3",
    slug: "future-co",
    name: "Future Company",
    nameAr: "شركة المستقبل",
    status: "pending",
    plan: "enterprise",
    email: "contact@future-co.sa",
    country: "SA",
    city: "Jeddah",
    defaultLocale: "en",
    defaultTheme: "shadcn",
    timezone: "Asia/Riyadh",
    usersCount: 0,
    employeesCount: 0,
    createdAt: "2026-01-22T15:00:00Z",
    updatedAt: "2026-01-22T15:00:00Z",
    createdBy: "super-admin",
  },
  {
    id: "4",
    slug: "gulf-services",
    name: "Gulf Services Group",
    nameAr: "مجموعة خدمات الخليج",
    status: "suspended",
    plan: "business",
    email: "admin@gulf-services.sa",
    country: "SA",
    city: "Dammam",
    defaultLocale: "ar",
    defaultTheme: "shadcn",
    timezone: "Asia/Riyadh",
    usersCount: 28,
    employeesCount: 65,
    createdAt: "2025-12-01T09:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
    createdBy: "super-admin",
    suspendedAt: "2026-01-15T10:00:00Z",
    suspendedReason: "عدم سداد الاشتراك",
  },
];

export const mockRequests: SubscriptionRequest[] = [
  {
    id: "req-1",
    companyName: "Innovation Company",
    companyNameAr: "شركة الابتكار",
    contactName: "أحمد محمد",
    contactEmail: "ahmed@innovation.sa",
    contactPhone: "+966551234567",
    employeesCount: "51-200",
    message: "نرغب في الاشتراك في باقة Enterprise",
    status: "pending",
    createdAt: "2026-01-23T12:00:00Z",
  },
  {
    id: "req-2",
    companyName: "Excellence Group",
    companyNameAr: "مجموعة التميز",
    contactName: "سارة أحمد",
    contactEmail: "sara@excellence.sa",
    employeesCount: "11-50",
    status: "pending",
    createdAt: "2026-01-24T09:30:00Z",
  },
];
