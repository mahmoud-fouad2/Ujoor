import { JobPostingsManager } from "./job-postings-manager";

export default function JobPostingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الوظائف الشاغرة</h1>
          <p className="text-muted-foreground">إدارة إعلانات الوظائف والمناصب المتاحة</p>
        </div>
      </div>
      <JobPostingsManager />
    </div>
  );
}
