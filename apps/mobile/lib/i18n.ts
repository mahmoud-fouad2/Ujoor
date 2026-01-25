import type { AppLanguage } from "@/lib/settings-storage";

type Dict = Record<string, { ar: string; en: string }>;

const dict: Dict = {
  login_title: { ar: "تسجيل الدخول", en: "Sign in" },
  login_subtitle: { ar: "ادخل بريدك وكلمة المرور.", en: "Enter your email and password." },
  email_label: { ar: "البريد الإلكتروني", en: "Email" },
  password_label: { ar: "كلمة المرور", en: "Password" },
  sign_in: { ar: "دخول", en: "Sign in" },
  dev_base_url_hint: { ar: "ملاحظة: أثناء التطوير اضبط EXPO_PUBLIC_API_BASE_URL على عنوان السيرفر.", en: "Dev note: set EXPO_PUBLIC_API_BASE_URL to your server URL." },

  attendance_title: { ar: "الحضور", en: "Attendance" },
  attendance_subtitle: { ar: "تسجيل حضور/انصراف مع تحقق الموقع (Geofence) من السيرفر.", en: "Check in/out with server-side geofence validation." },
  today: { ar: "حالة اليوم", en: "Today" },
  loading: { ar: "جارٍ التحميل...", en: "Loading..." },
  check_in: { ar: "تسجيل حضور", en: "Check in" },
  check_out: { ar: "تسجيل انصراف", en: "Check out" },
  status_none: { ar: "لم يتم تسجيل حضور اليوم", en: "Not checked in today" },
  status_checked_in: { ar: "تم تسجيل الحضور", en: "Checked in" },
  status_checked_out: { ar: "تم تسجيل الانصراف", en: "Checked out" },
  last_check_in: { ar: "آخر حضور", en: "Last check-in" },
  last_check_out: { ar: "آخر انصراف", en: "Last check-out" },
  refresh: { ar: "تحديث", en: "Refresh" },

  location_required: { ar: "الموقع مطلوب لتسجيل الحضور", en: "Location is required" },
  location_services_off: { ar: "خدمات الموقع (GPS) مغلقة", en: "Location services are off" },
  open_settings: { ar: "فتح الإعدادات", en: "Open settings" },
  try_again: { ar: "حاول مرة أخرى", en: "Try again" },

  history_title: { ar: "سجل الحضور", en: "My attendance" },
  empty_history: { ar: "لا توجد سجلات بعد", en: "No records yet" },
  last_7_days: { ar: "آخر 7 أيام", en: "Last 7 days" },
  last_30_days: { ar: "آخر 30 يوم", en: "Last 30 days" },
  last_90_days: { ar: "آخر 90 يوم", en: "Last 90 days" },
  load_more: { ar: "تحميل المزيد", en: "Load more" },
  no_more: { ar: "لا يوجد المزيد", en: "No more" },

  settings_title: { ar: "الإعدادات", en: "Settings" },
  logout: { ar: "تسجيل الخروج", en: "Sign out" },
  language: { ar: "اللغة", en: "Language" },
  arabic: { ar: "العربية", en: "Arabic" },
  english: { ar: "English", en: "English" },
  restart_required: { ar: "سيتم إعادة تشغيل التطبيق لتطبيق اتجاه الكتابة (RTL).", en: "The app will reload to apply layout direction." },
};

export function t(lang: AppLanguage, key: keyof typeof dict): string {
  return dict[key][lang];
}

export function humanizeApiError(lang: AppLanguage, message: string): string {
  const m = message || "";

  const map: Array<[string, { ar: string; en: string }]> = [
    ["Unauthorized", { ar: "غير مصرح", en: "Unauthorized" }],
    ["Tenant required", { ar: "بيانات الشركة غير متاحة", en: "Tenant required" }],
    ["Employee context required", { ar: "بيانات الموظف غير متاحة", en: "Employee context required" }],
    ["Location is required for attendance", { ar: "الموقع مطلوب لتسجيل الحضور", en: "Location is required" }],
    ["Location permission is required", { ar: "مطلوب إذن الموقع", en: "Location permission is required" }],
    ["Location services are off", { ar: "خدمات الموقع (GPS) مغلقة", en: "Location services are off" }],
    ["Location accuracy is too low", { ar: "دقة GPS ضعيفة، حاول مرة أخرى", en: "GPS accuracy is too low" }],
    ["Outside allowed work location", { ar: "أنت خارج نطاق مواقع العمل المسموحة", en: "Outside allowed work locations" }],
    ["Already checked in today", { ar: "تم تسجيل الحضور بالفعل اليوم", en: "Already checked in today" }],
    ["Already checked out today", { ar: "تم تسجيل الانصراف بالفعل اليوم", en: "Already checked out today" }],
    ["Must check in first", { ar: "يجب تسجيل الحضور أولاً", en: "You must check in first" }],
  ];

  const found = map.find(([needle]) => m.includes(needle));
  if (found) return found[1][lang];

  return lang === "ar" ? (m || "حدث خطأ") : (m || "Something went wrong");
}
