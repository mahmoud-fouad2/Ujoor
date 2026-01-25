import type { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { JobTitlesManager } from "./job-titles-manager";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "المسميات الوظيفية - Job Titles",
    description: "إدارة المسميات الوظيفية - Core HR Phase 3",
  });
}

export default function JobTitlesPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">المسميات الوظيفية</h1>
      </div>
      <JobTitlesManager />
    </>
  );
}
