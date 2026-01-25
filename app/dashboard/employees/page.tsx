import type { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { EmployeesManager } from "./employees-manager";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "الموظفون - Employees",
    description: "إدارة بيانات الموظفين - Core HR Phase 3",
  });
}

export default function EmployeesPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">الموظفون</h1>
      </div>
      <EmployeesManager />
    </>
  );
}
