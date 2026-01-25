/**
 * Super Admin Layout
 * محمي - Super Admin فقط
 */

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isSuperAdmin, TenantRole } from "@/lib/tenant";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // في الـ development، نسمح بالوصول بدون session
  // في الـ production، هذا سيتم تفعيله
  if (process.env.NODE_ENV === "production") {
    if (!user || !isSuperAdmin(user.role as TenantRole)) {
      redirect("/dashboard?error=unauthorized");
    }
  }

  return (
    <div className="super-admin-layout">
      {/* Development Banner */}
      {process.env.NODE_ENV !== "production" && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-sm text-amber-600 dark:text-amber-400">
          🛡️ وضع التطوير - Super Admin Mode
        </div>
      )}
      {children}
    </div>
  );
}
