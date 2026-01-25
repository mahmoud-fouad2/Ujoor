/**
 * Document Types & Storage
 * نظام إدارة الوثائق والملفات
 */

export type DocumentCategory = 
  | "personal"      // وثائق شخصية (هوية، جواز)
  | "employment"    // وثائق توظيف (عقد، خطاب تعيين)
  | "education"     // شهادات تعليمية
  | "medical"       // تقارير طبية
  | "financial"     // وثائق مالية
  | "legal"         // وثائق قانونية
  | "other";        // أخرى

export type DocumentStatus = "pending" | "approved" | "rejected" | "expired";

export interface Document {
  id: string;
  
  // File info
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number; // bytes
  url: string; // Storage URL (local or R2)
  
  // Metadata
  category: DocumentCategory;
  title: string;
  titleAr?: string;
  description?: string;
  
  // Relation
  employeeId: string;
  tenantId: string;
  
  // Status & Dates
  status: DocumentStatus;
  expiryDate?: string;
  issuedDate?: string;
  
  // Audit
  uploadedBy: string;
  uploadedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
}

export interface DocumentUploadInput {
  file: File;
  category: DocumentCategory;
  title: string;
  titleAr?: string;
  description?: string;
  employeeId: string;
  expiryDate?: string;
  issuedDate?: string;
}

// Category labels
export const documentCategoryLabels: Record<DocumentCategory, { en: string; ar: string }> = {
  personal: { en: "Personal Documents", ar: "وثائق شخصية" },
  employment: { en: "Employment Documents", ar: "وثائق توظيف" },
  education: { en: "Education Certificates", ar: "شهادات تعليمية" },
  medical: { en: "Medical Records", ar: "تقارير طبية" },
  financial: { en: "Financial Documents", ar: "وثائق مالية" },
  legal: { en: "Legal Documents", ar: "وثائق قانونية" },
  other: { en: "Other", ar: "أخرى" },
};

export const documentStatusLabels: Record<DocumentStatus, { en: string; ar: string; color: string }> = {
  pending: { en: "Pending Review", ar: "قيد المراجعة", color: "bg-yellow-500" },
  approved: { en: "Approved", ar: "معتمد", color: "bg-green-500" },
  rejected: { en: "Rejected", ar: "مرفوض", color: "bg-red-500" },
  expired: { en: "Expired", ar: "منتهي الصلاحية", color: "bg-gray-500" },
};

// Mock documents
export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    fileName: "national_id_ahmed.pdf",
    originalName: "هوية_أحمد.pdf",
    mimeType: "application/pdf",
    size: 245000,
    url: "/uploads/documents/doc-1.pdf",
    category: "personal",
    title: "National ID",
    titleAr: "الهوية الوطنية",
    employeeId: "emp-1",
    tenantId: "tenant-1",
    status: "approved",
    expiryDate: "2028-05-15",
    issuedDate: "2023-05-15",
    uploadedBy: "admin",
    uploadedAt: "2024-03-15T10:00:00Z",
    approvedBy: "admin",
    approvedAt: "2024-03-15T11:00:00Z",
  },
  {
    id: "doc-2",
    fileName: "employment_contract_ahmed.pdf",
    originalName: "عقد_العمل.pdf",
    mimeType: "application/pdf",
    size: 520000,
    url: "/uploads/documents/doc-2.pdf",
    category: "employment",
    title: "Employment Contract",
    titleAr: "عقد العمل",
    employeeId: "emp-1",
    tenantId: "tenant-1",
    status: "approved",
    issuedDate: "2024-03-15",
    uploadedBy: "admin",
    uploadedAt: "2024-03-15T10:00:00Z",
    approvedBy: "admin",
    approvedAt: "2024-03-15T11:00:00Z",
  },
  {
    id: "doc-3",
    fileName: "degree_fatima.pdf",
    originalName: "شهادة_البكالوريوس.pdf",
    mimeType: "application/pdf",
    size: 180000,
    url: "/uploads/documents/doc-3.pdf",
    category: "education",
    title: "Bachelor's Degree",
    titleAr: "شهادة البكالوريوس",
    employeeId: "emp-2",
    tenantId: "tenant-1",
    status: "approved",
    issuedDate: "2020-06-01",
    uploadedBy: "admin",
    uploadedAt: "2024-06-01T10:00:00Z",
    approvedBy: "admin",
    approvedAt: "2024-06-01T11:00:00Z",
  },
  {
    id: "doc-4",
    fileName: "medical_checkup.pdf",
    originalName: "فحص_طبي.pdf",
    mimeType: "application/pdf",
    size: 95000,
    url: "/uploads/documents/doc-4.pdf",
    category: "medical",
    title: "Medical Checkup Report",
    titleAr: "تقرير الفحص الطبي",
    employeeId: "emp-3",
    tenantId: "tenant-1",
    status: "pending",
    issuedDate: "2026-01-20",
    uploadedBy: "emp-3",
    uploadedAt: "2026-01-20T10:00:00Z",
  },
];

// Helper functions
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.includes("pdf")) return "📄";
  if (mimeType.includes("image")) return "🖼️";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
  return "📁";
}

export function isDocumentExpired(doc: Document): boolean {
  if (!doc.expiryDate) return false;
  return new Date(doc.expiryDate) < new Date();
}

export function getDocumentsForEmployee(employeeId: string, docs: Document[]): Document[] {
  return docs.filter(d => d.employeeId === employeeId);
}
