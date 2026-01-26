/**
 * Time & Attendance Types
 * أنواع الحضور والانصراف والورديات
 */

// ===== Shift (الوردية) =====
export interface Shift {
  id: string;
  tenantId: string;
  
  name: string;
  nameAr: string;
  code: string;
  
  // Working hours
  startTime: string; // HH:mm format
  endTime: string;
  
  // Break
  breakStartTime?: string;
  breakEndTime?: string;
  breakDurationMinutes?: number;
  
  // Flexibility
  flexibleStartMinutes?: number; // Grace period for late arrival
  flexibleEndMinutes?: number;   // Grace period for early leave
  
  // Work days (0=Sunday, 6=Saturday)
  workDays: number[];
  
  // Overtime settings
  overtimeEnabled: boolean;
  overtimeMultiplier?: number; // e.g., 1.5x
  
  // Color for UI
  color: string;
  
  isDefault: boolean;
  isActive: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// ===== Attendance Record =====
export type AttendanceStatus = 
  | "pending"      // بانتظار/غير مكتمل
  | "present"      // حاضر
  | "absent"       // غائب
  | "late"         // متأخر
  | "early_leave"  // مغادرة مبكرة
  | "on_leave"     // في إجازة
  | "holiday"      // عطلة رسمية
  | "weekend";     // عطلة أسبوعية

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  shiftId: string;
  
  date: string; // YYYY-MM-DD
  
  // Check-in/out times
  checkInTime?: string;    // ISO datetime
  checkOutTime?: string;
  
  // Expected vs actual
  expectedCheckIn: string;
  expectedCheckOut: string;
  
  // Calculated values
  status: AttendanceStatus;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  totalWorkMinutes?: number;
  overtimeMinutes?: number;
  
  // Source
  checkInSource?: "manual" | "biometric" | "mobile" | "web";
  checkOutSource?: "manual" | "biometric" | "mobile" | "web";
  
  // Location (for mobile check-in)
  checkInLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  
  notes?: string;
  
  // If modified by admin
  modifiedById?: string;
  modifiedAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ===== Attendance Request =====
export type AttendanceRequestType = 
  | "check_correction"  // تصحيح حضور
  | "overtime"          // عمل إضافي
  | "permission"        // استئذان
  | "work_from_home";   // عمل من المنزل

export type AttendanceRequestStatus = 
  | "pending"   // بانتظار الموافقة
  | "approved"  // معتمد
  | "rejected"; // مرفوض

export interface AttendanceRequest {
  id: string;
  tenantId: string;
  employeeId: string;
  
  type: AttendanceRequestType;
  status: AttendanceRequestStatus;
  
  date: string; // YYYY-MM-DD
  
  // For check correction
  requestedCheckIn?: string;
  requestedCheckOut?: string;
  
  // For overtime
  overtimeHours?: number;
  
  // For permission
  permissionStartTime?: string;
  permissionEndTime?: string;
  
  reason: string;
  attachmentUrl?: string;
  
  // Approval workflow
  approvedById?: string;
  approvedAt?: string;
  rejectionReason?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ===== Holiday =====
export interface Holiday {
  id: string;
  tenantId: string;
  
  name: string;
  nameAr: string;
  
  date: string;         // YYYY-MM-DD
  endDate?: string;     // For multi-day holidays
  
  isRecurring: boolean; // Repeats yearly
  
  createdAt: string;
  updatedAt: string;
}

// ===== Labels =====
export const attendanceStatusLabels: Record<AttendanceStatus, { ar: string; en: string }> = {
  pending: { ar: "قيد المعالجة", en: "Pending" },
  present: { ar: "حاضر", en: "Present" },
  absent: { ar: "غائب", en: "Absent" },
  late: { ar: "متأخر", en: "Late" },
  early_leave: { ar: "مغادرة مبكرة", en: "Early Leave" },
  on_leave: { ar: "في إجازة", en: "On Leave" },
  holiday: { ar: "عطلة رسمية", en: "Holiday" },
  weekend: { ar: "عطلة أسبوعية", en: "Weekend" },
};

export const requestTypeLabels: Record<AttendanceRequestType, { ar: string; en: string }> = {
  check_correction: { ar: "تصحيح حضور", en: "Check Correction" },
  overtime: { ar: "عمل إضافي", en: "Overtime" },
  permission: { ar: "استئذان", en: "Permission" },
  work_from_home: { ar: "عمل من المنزل", en: "Work From Home" },
};

export const requestStatusLabels: Record<AttendanceRequestStatus, { ar: string; en: string }> = {
  pending: { ar: "بانتظار الموافقة", en: "Pending" },
  approved: { ar: "معتمد", en: "Approved" },
  rejected: { ar: "مرفوض", en: "Rejected" },
};

// Day names
export const dayNames = {
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

// ===== Mock Data =====
export const mockShifts: Shift[] = [
  {
    id: "shift-1",
    tenantId: "tenant-1",
    name: "Morning Shift",
    nameAr: "الوردية الصباحية",
    code: "MORNING",
    startTime: "08:00",
    endTime: "16:00",
    breakStartTime: "12:00",
    breakEndTime: "13:00",
    breakDurationMinutes: 60,
    flexibleStartMinutes: 15,
    flexibleEndMinutes: 15,
    workDays: [0, 1, 2, 3, 4], // Sunday to Thursday
    overtimeEnabled: true,
    overtimeMultiplier: 1.5,
    color: "#3B82F6",
    isDefault: true,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "shift-2",
    tenantId: "tenant-1",
    name: "Evening Shift",
    nameAr: "الوردية المسائية",
    code: "EVENING",
    startTime: "14:00",
    endTime: "22:00",
    breakStartTime: "18:00",
    breakEndTime: "19:00",
    breakDurationMinutes: 60,
    flexibleStartMinutes: 10,
    flexibleEndMinutes: 10,
    workDays: [0, 1, 2, 3, 4],
    overtimeEnabled: true,
    overtimeMultiplier: 1.5,
    color: "#8B5CF6",
    isDefault: false,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "shift-3",
    tenantId: "tenant-1",
    name: "Night Shift",
    nameAr: "الوردية الليلية",
    code: "NIGHT",
    startTime: "22:00",
    endTime: "06:00",
    breakDurationMinutes: 30,
    flexibleStartMinutes: 5,
    flexibleEndMinutes: 5,
    workDays: [0, 1, 2, 3, 4],
    overtimeEnabled: true,
    overtimeMultiplier: 2.0,
    color: "#1F2937",
    isDefault: false,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Generate mock attendance records for current month
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

export const mockAttendanceRecords: AttendanceRecord[] = Array.from({ length: 20 }, (_, i) => {
  const day = i + 1;
  const date = new Date(currentYear, currentMonth, day);
  const dayOfWeek = date.getDay();
  
  // Skip weekends (Friday=5, Saturday=6)
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return {
      id: `att-${i + 1}`,
      tenantId: "tenant-1",
      employeeId: "emp-1",
      shiftId: "shift-1",
      date: date.toISOString().split("T")[0],
      expectedCheckIn: "08:00",
      expectedCheckOut: "16:00",
      status: "weekend" as AttendanceStatus,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    };
  }
  
  // Random status for workdays
  const statuses: AttendanceStatus[] = ["present", "present", "present", "late", "present"];
  const status = day <= today.getDate() ? statuses[Math.floor(Math.random() * statuses.length)] : "present";
  
  const checkInHour = status === "late" ? 8 + Math.floor(Math.random() * 2) : 8;
  const checkInMinute = status === "late" ? Math.floor(Math.random() * 59) : Math.floor(Math.random() * 15);
  
  return {
    id: `att-${i + 1}`,
    tenantId: "tenant-1",
    employeeId: "emp-1",
    shiftId: "shift-1",
    date: date.toISOString().split("T")[0],
    checkInTime: day <= today.getDate() ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(checkInHour).padStart(2, "0")}:${String(checkInMinute).padStart(2, "0")}:00Z` : undefined,
    checkOutTime: day < today.getDate() ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T16:${String(Math.floor(Math.random() * 30)).padStart(2, "0")}:00Z` : undefined,
    expectedCheckIn: "08:00",
    expectedCheckOut: "16:00",
    status,
    lateMinutes: status === "late" ? (checkInHour - 8) * 60 + checkInMinute : 0,
    totalWorkMinutes: day < today.getDate() ? 480 : undefined,
    checkInSource: "web",
    checkOutSource: day < today.getDate() ? "web" : undefined,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  };
});

export const mockAttendanceRequests: AttendanceRequest[] = [
  {
    id: "req-1",
    tenantId: "tenant-1",
    employeeId: "emp-1",
    type: "check_correction",
    status: "pending",
    date: "2024-01-15",
    requestedCheckIn: "2024-01-15T08:00:00Z",
    requestedCheckOut: "2024-01-15T16:00:00Z",
    reason: "نسيت تسجيل الحضور صباحاً",
    createdAt: "2024-01-15T17:00:00Z",
    updatedAt: "2024-01-15T17:00:00Z",
  },
  {
    id: "req-2",
    tenantId: "tenant-1",
    employeeId: "emp-2",
    type: "overtime",
    status: "approved",
    date: "2024-01-14",
    overtimeHours: 3,
    reason: "إنهاء مشروع عاجل",
    approvedById: "emp-manager-1",
    approvedAt: "2024-01-15T09:00:00Z",
    createdAt: "2024-01-14T19:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "req-3",
    tenantId: "tenant-1",
    employeeId: "emp-3",
    type: "permission",
    status: "pending",
    date: "2024-01-16",
    permissionStartTime: "14:00",
    permissionEndTime: "16:00",
    reason: "موعد طبي",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
];

export const mockHolidays: Holiday[] = [
  {
    id: "holiday-1",
    tenantId: "tenant-1",
    name: "National Day",
    nameAr: "اليوم الوطني",
    date: "2024-09-23",
    isRecurring: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "holiday-2",
    tenantId: "tenant-1",
    name: "Eid Al-Fitr",
    nameAr: "عيد الفطر",
    date: "2024-04-10",
    endDate: "2024-04-13",
    isRecurring: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// ===== Helper Functions =====
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "م" : "ص";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
}

export function formatMinutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} دقيقة`;
  if (mins === 0) return `${hours} ساعة`;
  return `${hours} ساعة و ${mins} دقيقة`;
}

export function getStatusColor(status: AttendanceStatus): string {
  switch (status) {
    case "present":
      return "bg-green-500";
    case "absent":
      return "bg-red-500";
    case "late":
      return "bg-yellow-500";
    case "early_leave":
      return "bg-orange-500";
    case "on_leave":
      return "bg-blue-500";
    case "holiday":
      return "bg-purple-500";
    case "weekend":
      return "bg-gray-400";
    default:
      return "bg-gray-500";
  }
}

export function calculateWorkHours(checkIn: string, checkOut: string, breakMinutes: number = 0): number {
  const inTime = new Date(checkIn).getTime();
  const outTime = new Date(checkOut).getTime();
  const diffMinutes = (outTime - inTime) / (1000 * 60);
  return Math.max(0, diffMinutes - breakMinutes);
}
