import type { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { DepartmentsManager } from "./departments-manager";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "الأقسام - Departments",
    description: "إدارة أقسام الشركة - Core HR Phase 3",
  });
}

export default function DepartmentsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">الأقسام</h1>
      </div>
      <DepartmentsManager />
    </>
  );
}
