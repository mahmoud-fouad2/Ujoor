/**
 * Platform Settings Page (Super Admin)
 * إعدادات المنصة
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { PlatformSettingsManager } from "./platform-settings-manager";

export default async function PlatformSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إعدادات المنصة</h1>
        <p className="text-muted-foreground">
          تكوين الإعدادات العامة للمنصة
        </p>
      </div>

      <PlatformSettingsManager />
    </div>
  );
}
