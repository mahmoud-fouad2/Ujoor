import { ApplicantsManager } from "./applicants-manager";

export default function ApplicantsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المتقدمون للوظائف</h1>
          <p className="text-muted-foreground">إدارة طلبات التقديم ومتابعة المرشحين</p>
        </div>
      </div>
      <ApplicantsManager />
    </div>
  );
}
