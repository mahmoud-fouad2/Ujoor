/**
 * Pricing Plans Management Page (Super Admin)
 * إدارة خطط التسعير
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { PricingPlansManager } from "./pricing-plans-manager";

export default async function PricingPlansPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إدارة الأسعار والباقات</h1>
        <p className="text-muted-foreground">
          تحديث أسعار الباقات والمميزات التي تظهر في صفحة التسعير
        </p>
      </div>

      <PricingPlansManager />
    </div>
  );
}
