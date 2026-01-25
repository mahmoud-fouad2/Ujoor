import { TrainingEnrollmentsManager } from "./training-enrollments-manager";

export default function TrainingEnrollmentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">تسجيلات التدريب</h1>
          <p className="text-muted-foreground">متابعة تسجيلات الموظفين في الدورات</p>
        </div>
      </div>
      <TrainingEnrollmentsManager />
    </div>
  );
}
