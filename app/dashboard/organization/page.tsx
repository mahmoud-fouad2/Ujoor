import type { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { OrganizationManager } from "./organization-manager";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "الهيكل التنظيمي - Organization",
    description: "إدارة بيانات الشركة والفروع - Core HR Phase 3",
  });
}

export default function OrganizationPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">الهيكل التنظيمي</h1>
      </div>
      <OrganizationManager />
    </>
  );
}
